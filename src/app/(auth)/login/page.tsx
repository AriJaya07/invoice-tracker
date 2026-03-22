import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 font-geist-sans">
        <div className="text-center">
          <Link href="/" className="inline-block group">
             <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-100 group-hover:scale-110 transition-transform">
               <span className="text-white font-black text-2xl">IF</span>
             </div>
          </Link>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            New here?{" "}
            <Link href="/register" className="font-bold text-blue-600 hover:text-blue-500">
              Create a free account
            </Link>
          </p>
        </div>

        <Suspense fallback={
          <div className="mt-8 space-y-6 animate-pulse">
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-4 bg-gray-50 rounded-lg w-1/2 mx-auto" />
            <div className="space-y-4">
              <div className="h-16 bg-gray-50 rounded-xl" />
              <div className="h-16 bg-gray-50 rounded-xl" />
              <div className="h-12 bg-gray-200 rounded-xl" />
            </div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}