"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { register } from "@/services/auth.service";
import { toast } from "sonner";

import {
  IconArrowRight,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconSparkles,
  IconCircleCheckFilled,
  IconBrain,
} from "@tabler/icons-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (isLoading) return;
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      toast.success(
        response.message || "Account created successfully!"
      );

      router.replace("/auth/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">

      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-violet-300/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-fuchsia-300/15 blur-3xl" />

      <div className="relative grid w-full max-w-7xl items-center gap-20 lg:grid-cols-2">

        {/* LEFT */}

        <div className="hidden lg:block">

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-5 py-2 text-sm font-medium text-violet-700 shadow-sm">
            <IconSparkles size={16} />
            AI Powered Interview Platform
          </div>

          <h1 className="mt-8 text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
            Start your
            <br />
            AI interview
            <span className="text-violet-600"> journey.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
            Create your free account and begin practicing technical interviews with instant AI feedback.
          </p>

          <div className="mt-14 space-y-5">

            {[
              "Unlimited practice interviews",
              "AI-powered feedback",
              "Track your progress",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4"
              >
                <IconCircleCheckFilled
                  size={20}
                  className="text-violet-600"
                />

                <span className="text-lg text-slate-700">
                  {item}
                </span>
              </div>
            ))}

          </div>

        </div>

        {/* RIGHT */}

        <div className="mx-auto w-full max-w-[420px] rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_30px_80px_rgba(109,94,247,0.15)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_90px_rgba(109,94,247,0.22)]">

          <div className="mb-5 flex justify-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
              <IconBrain
                size={24}
                className="text-violet-600"
              />
            </div>

          </div>

          <h2 className="text-center text-3xl font-bold text-slate-900">
            Create Account
          </h2>

          <p className="mt-3 text-center text-slate-500">
            Create your account and start practicing AI-powered interviews.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >

            <div>

              <Label className="text-slate-700">
                Full Name
              </Label>

              <div className="relative mt-2">

                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 transition-all duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                />

              </div>

            </div>

            <div>

              <Label className="text-slate-700">
                Email Address
              </Label>

              <div className="relative mt-2">

                <IconMail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 pl-11 transition-all duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                />

              </div>

            </div>

            <div>

              <Label className="text-slate-700">
                Password
              </Label>

              <div className="relative mt-2">

                <IconLock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 pl-11 pr-12 transition-all duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-violet-600"
                >
                  {showPassword ? (
                    <IconEyeOff size={18} />
                  ) : (
                    <IconEye size={18} />
                  )}
                </button>

              </div>

            </div>

            <div>

              <Label className="text-slate-700">
                Confirm Password
              </Label>

              <div className="relative mt-2">

                <IconLock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 rounded-xl border-slate-200 pl-11 pr-12 transition-all duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-violet-600"
                >
                  {showPassword ? (
                    <IconEyeOff size={18} />
                  ) : (
                    <IconEye size={18} />
                  )}
                </button>

              </div>

            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="group h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Creating Account..." : "Create Account"}

              {!isLoading && (
                <IconArrowRight
                  size={18}
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                />
              )}
            </Button>

          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">
              OR
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-violet-600 transition-colors hover:text-violet-700"
            >
              Sign In
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}