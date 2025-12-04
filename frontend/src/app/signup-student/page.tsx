"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  GraduationCap,
  Mail,
  User,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SignupStudentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/login-student");
  };

  const passwordStrength = React.useMemo(() => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }, [formData.password]);

  return (
    <div className="relative flex min-h-screen">
      {/* Left Panel - Visual */}
      <div className="relative hidden flex-1 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <div className="relative z-10 flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 text-white">
              <Shield className="h-8 w-8" />
              <span className="text-2xl font-bold">ProctorX</span>
            </div>

            <h2 className="mt-8 text-4xl font-bold text-white">
              Start your
              <br />
              journey today
            </h2>

            <p className="mt-4 max-w-md text-lg text-white/80">
              Create your account and get ready to showcase your skills with
              confidence.
            </p>

            <div className="mt-12 space-y-4">
              {[
                "Take assessments from top companies",
                "Track your progress and scores",
                "Get hired by leading tech firms",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 text-white/90"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create account</h1>
              <p className="text-sm text-muted-foreground">
                Student Registration
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FloatingInput
              label="Full name"
              type="text"
              icon={<User className="h-4 w-4" />}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={errors.name}
            />

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

            <div>
              <FloatingInput
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength
                            ? passwordStrength <= 1
                              ? "bg-red-500"
                              : passwordStrength <= 2
                              ? "bg-yellow-500"
                              : passwordStrength <= 3
                              ? "bg-emerald-400"
                              : "bg-emerald-500"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {passwordStrength <= 1
                      ? "Weak"
                      : passwordStrength <= 2
                      ? "Fair"
                      : passwordStrength <= 3
                      ? "Good"
                      : "Strong"}{" "}
                    password
                  </p>
                </div>
              )}
            </div>

            <FloatingInput
              label="Confirm password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
              success={
                formData.confirmPassword.length > 0 &&
                formData.password === formData.confirmPassword
              }
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-border"
                required
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground"
              >
                I agree to the{" "}
                <Link href="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <AnimatedButton
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              isLoading={isLoading}
              loadingText="Creating account..."
            >
              Create Account
            </AnimatedButton>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login-student"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Are you a recruiter?{" "}
            <Link
              href="/signup-recruiter"
              className="font-medium text-primary hover:text-primary/80"
            >
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
