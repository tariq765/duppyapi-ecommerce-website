import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/app/context/AuthContext";

// Define Zod schemas for login and signup
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .refine((val) => /[0-9]/.test(val) && /[a-zA-Z]/.test(val), {
      message: "Password must contain letters and numbers",
    }),
});

type Props = {
  mode: "login" | "signup";
  onSuccess?: () => void; // optional callback after successful auth
};

export const AuthForm: React.FC<Props> = ({ mode, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const schema = mode === "login" ? loginSchema : signupSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (mode === "login") {
        const { email, password, rememberMe } = data;
        await login(email, password, rememberMe);
        onSuccess?.();
      } else {
        const { name, email, password } = data;
        await signup(name, email, password);
        onSuccess?.();
      }
    } catch (err: any) {
      // Errors are handled inside AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4">
      {mode === "signup" && (
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full border rounded px-2 py-1"
          />
          {(errors as any).name && (
            <p className="text-red-600 text-sm">{(errors as any).name.message?.toString()}</p>
          )}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full border rounded px-2 py-1"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message?.toString()}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full border rounded px-2 py-1"
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message?.toString()}</p>
        )}
      </div>
      {mode === "login" && (
        <div className="flex items-center">
          <input type="checkbox" {...register("rememberMe")} className="mr-2" />
          <label className="text-sm">Remember me</label>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : mode === "login" ? "Log In" : "Sign Up"}
      </button>
    </form>
  );
};
