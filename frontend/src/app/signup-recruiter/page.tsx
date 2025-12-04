"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Building2,
  Mail,
  User,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { FloatingInput } from "@/components/ui/floating-input";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SignupRecruiterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.company) newErrors.company = "Company name is required";
    if (!formData.role) newErrors.role = "Job title is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/recruiter/dashboard");
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
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Get Started</h1>
              <p className="text-sm text-muted-foreground">
                Create your recruiter account
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-8 flex items-center gap-4">
            {[1, 2].map((s) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <motion.div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    s <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  animate={{ scale: s === step ? 1.1 : 1 }}
                >
                  {s < step ? <CheckCircle2 className="h-4 w-4" /> : s}
                </motion.div>
                {s < 2 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors ${
                      s < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            {step === 1 ? (
              <motion.div
                className="space-y-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
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
                  label="Work email"
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={errors.email}
                />

                <AnimatedButton
                  type="button"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={handleNext}
                >
                  Continue
                </AnimatedButton>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <FloatingInput
                  label="Company name"
                  type="text"
                  icon={<Building2 className="h-4 w-4" />}
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  error={errors.company}
                />

                <FloatingInput
                  label="Your job title"
                  type="text"
                  icon={<Briefcase className="h-4 w-4" />}
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  error={errors.role}
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

                <div className="flex gap-3">
                  <AnimatedButton
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </AnimatedButton>
                  <AnimatedButton
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="flex-1"
                    isLoading={isLoading}
                    loadingText="Creating..."
                  >
                    Create Account
                  </AnimatedButton>
                </div>
              </motion.div>
            )}
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <AnimatedButton variant="outline" size="lg">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </AnimatedButton>
              <AnimatedButton variant="outline" size="lg">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </AnimatedButton>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login-recruiter"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Are you a student?{" "}
            <Link
              href="/signup-student"
              className="font-medium text-primary hover:text-primary/80"
            >
              Register here
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
              Hire with
              <br />
              Confidence
            </h2>

            <p className="mt-4 max-w-md text-lg text-white/80">
              Join hundreds of companies using ProctorX to find and verify top
              technical talent.
            </p>

            <div className="mt-12 space-y-4">
              {[
                "Create unlimited technical assessments",
                "AI-powered proctoring & plagiarism detection",
                "Rich analytics and candidate insights",
                "Enterprise-grade security & compliance",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 text-white/90"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  {feature}
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-6 border-t border-white/20 pt-8">
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-white/60">Companies</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold text-white">50K+</p>
                <p className="text-sm text-white/60">Assessments</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold text-white">99.7%</p>
                <p className="text-sm text-white/60">Accuracy</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
