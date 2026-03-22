import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";
import { LogoMark } from "@/components/ui/LogoMark";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-zinc-200 p-6 shadow-lg sm:p-10">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <LogoMark size="lg" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            New here?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-700 underline-offset-2 hover:text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-sm"
            >
              Create a free account
            </Link>
          </p>
        </div>

        <Suspense
          fallback={
            <div className="mt-8 space-y-6 animate-pulse">
              <div className="h-11 rounded-lg bg-zinc-100" />
              <div className="mx-auto h-4 w-1/2 rounded bg-zinc-100" />
              <div className="space-y-4">
                <div className="h-16 rounded-lg bg-zinc-100" />
                <div className="h-16 rounded-lg bg-zinc-100" />
                <div className="h-11 rounded-lg bg-zinc-200" />
              </div>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
