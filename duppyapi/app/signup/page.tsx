"use client";

import React from "react";
import { AuthForm } from "@/app/components/AuthForm";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // After signup, we might want them to login or auto-login
    // For now, let's redirect to login
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in instead
            </Link>
          </p>
        </div>
        <AuthForm mode="signup" onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
