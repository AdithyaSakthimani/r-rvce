"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Eye,
  BarChart3,
  Code2,
  Lock,
  ArrowRight,
  Users,
  FileCode,
  MonitorPlay,
  BrainCircuit,
} from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    icon: Eye,
    title: "AI-Powered Monitoring",
    description:
      "Advanced computer vision detects suspicious behavior in real-time with high accuracy.",
  },
  {
    icon: MonitorPlay,
    title: "Screen Recording",
    description:
      "Full screen capture with intelligent activity tracking and timestamped events.",
  },
  {
    icon: BrainCircuit,
    title: "Plagiarism Detection",
    description:
      "LLM-powered code similarity analysis identifies copied solutions instantly.",
  },
  {
    icon: Code2,
    title: "Integrated Code Editor",
    description:
      "Monaco Editor with language support, syntax highlighting, and auto-completion.",
  },
  {
    icon: BarChart3,
    title: "Rich Analytics",
    description:
      "Comprehensive dashboards with detailed candidate performance metrics.",
  },
  {
    icon: Lock,
    title: "Secure Environment",
    description:
      "Fullscreen enforcement, tab detection, and copy-paste monitoring.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">ProctorX</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How it Works
            </Link>
            <Link
              href="/recruiter/dashboard"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login-recruiter">
              <AnimatedButton variant="ghost" size="sm">
                Sign In
              </AnimatedButton>
            </Link>
            <Link href="/signup-recruiter">
              <AnimatedButton variant="default" size="sm">
                Get Started
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-1/4 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              The Future of{" "}
              <span className="bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent">
                Secure Assessments
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              AI-powered exam proctoring that ensures integrity without
              compromising candidate experience. Monitor, analyze, and report—all
              in real-time.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/signup-recruiter">
                <AnimatedButton
                  variant="gradient"
                  size="lg"
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Get Started
                </AnimatedButton>
              </Link>
              <Link href="/login-student">
                <AnimatedButton variant="outline" size="lg">
                  I&apos;m a Student
                </AnimatedButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image/Dashboard Preview */}
          <motion.div
            className="relative mx-auto mt-16 max-w-5xl"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-violet-500/5" />
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 h-6 flex-1 rounded-md bg-muted" />
              </div>
              <div className="grid grid-cols-4 gap-4 p-6">
                {/* Stats Cards */}
                {[
                  { label: "Active Tests", value: "24", trend: "+12%" },
                  { label: "Candidates", value: "1,847", trend: "+8%" },
                  { label: "Avg. Score", value: "78%", trend: "+5%" },
                  { label: "Violations", value: "23", trend: "-15%" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="rounded-xl border border-border bg-background/50 p-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  >
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                    <p
                      className={`mt-1 text-xs ${
                        stat.trend.startsWith("+")
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.trend} from last month
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <div className="h-48 rounded-xl border border-border bg-muted/30" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for secure assessments
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed for modern technical hiring
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="border-t border-border bg-muted/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How ProctorX Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple setup, powerful results
            </p>
          </motion.div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: FileCode,
                title: "Create Your Test",
                description:
                  "Upload coding challenges or choose from our library. Set time limits and parameters.",
              },
              {
                step: "02",
                icon: Users,
                title: "Invite Candidates",
                description:
                  "Send secure test links to your candidates. They can start instantly.",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Review Results",
                description:
                  "Get detailed analytics, violation reports, and code similarity scores.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <div className="mb-4 text-6xl font-bold text-primary/10">
                  {item.step}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-violet-600 p-12 text-center md:p-20"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                Ready to secure your assessments?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                Create your first proctored test in minutes with our intuitive platform.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/signup-recruiter">
                  <AnimatedButton
                    variant="secondary"
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    Get Started Now
                  </AnimatedButton>
                </Link>
                <Link href="/recruiter/dashboard">
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    View Demo Dashboard
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">ProctorX</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ProctorX. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}