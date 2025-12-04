"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, GraduationCap, Mail, ArrowLeft } from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LoginStudentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/test/demo-test");
  };

  return (
    <div className="relative flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="relative flex flex-1 flex-col justify-center px-8 py-12 lg:px-12">
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>

        <motion.div
          className="mx-auto w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">
                Student Portal Login
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FloatingInput
              label="Email address"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
            />

            <FloatingInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link
                href="#"
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>

            <AnimatedButton
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Sign In
            </AnimatedButton>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Have an access code?
                </span>
              </div>
            </div>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FloatingInput
                label="Enter test access code"
                type="text"
                className="text-center tracking-widest"
              />
              <AnimatedButton
                variant="outline"
                size="lg"
                className="mt-3 w-full"
              >
                Join Test
              </AnimatedButton>
            </motion.div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup-student"
              className="font-medium text-primary hover:text-primary/80"
            >
              Create account
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Are you a recruiter?{" "}
            <Link
              href="/login-recruiter"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Visual */}
      <div className="relative hidden flex-1 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-indigo-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <div className="relative z-10 flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 text-white">
              <Shield className="h-8 w-8" />
              <span className="text-2xl font-bold">ProctorX</span>
            </div>

            <h2 className="mt-8 text-4xl font-bold text-white">
              Ready for your
              <br />
              assessment?
            </h2>

            <p className="mt-4 max-w-md text-lg text-white/80">
              Join your scheduled test with a secure, fair, and seamless exam
              experience.
            </p>

            <div className="mt-12 space-y-4">
              {[
                "Integrated code editor with syntax highlighting",
                "Real-time feedback and auto-save",
                "Fair AI-powered proctoring",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 text-white/90"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
