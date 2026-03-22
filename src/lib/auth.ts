import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations";

const TRIAL_DAYS = parseInt(process.env.TRIAL_DURATION_DAYS ?? "14", 10);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers — ensure subscription/trial is created on first sign-in
      if (account?.provider !== "credentials" && user.id) {
        const existing = await db.subscription.findUnique({
          where: { userId: user.id },
        });
        if (!existing) {
          const now = new Date();
          const trialEnd = new Date(now);
          trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);

          await db.subscription.create({
            data: {
              userId: user.id,
              plan: "FREE",
              status: "TRIALING",
              trialEndsAt: trialEnd,
            },
          });

          await db.user.update({
            where: { id: user.id },
            data: {
              trialStartDate: now,
              trialEndDate: trialEnd,
            },
          });
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.userId = user.id;
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session.user };
      }

      // Attach subscription info to token
      if (token.userId) {
        const sub = await db.subscription.findUnique({
          where: { userId: token.userId as string },
        });
        if (sub) {
          token.subscriptionPlan = sub.plan;
          token.subscriptionStatus = sub.status;
          token.trialEndsAt = sub.trialEndsAt?.toISOString() ?? null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.subscriptionPlan = token.subscriptionPlan as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
        session.user.trialEndsAt = token.trialEndsAt as string | null;
      }
      return session;
    },
  },
});