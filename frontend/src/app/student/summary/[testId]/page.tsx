"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Code2,
  Play,
  Pause,
  Shield,
  Home,
  FileCode,
  TrendingUp,
  Eye,
  Download,
  ChevronRight,
  Video,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { AnimatedButton, IconButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface QuestionResult {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  testsPassed: number;
  totalTests: number;
  timeSpent: number;
}

interface Violation {
  type: string;
  timestamp: string;
  description: string;
}

const mockResults = {
  testTitle: "Senior Frontend Developer Assessment",
  totalScore: 82,
  maxScore: 100,
  duration: 78,
  totalDuration: 90,
  submittedAt: "2024-01-20T14:30:00",
  rank: 12,
  totalCandidates: 45,
  questions: [
    {
      id: "1",
      title: "Two Sum",
      score: 30,
      maxScore: 30,
      testsPassed: 3,
      totalTests: 3,
      timeSpent: 18,
    },
    {
      id: "2",
      title: "Valid Parentheses",
      score: 25,
      maxScore: 30,
      testsPassed: 2,
      totalTests: 3,
      timeSpent: 22,
    },
    {
      id: "3",
      title: "Merge Two Sorted Lists",
      score: 27,
      maxScore: 40,
      testsPassed: 4,
      totalTests: 5,
      timeSpent: 38,
    },
  ] as QuestionResult[],
  violations: [
    {
      type: "tab_switch",
      timestamp: "00:15:23",
      description: "Switched to another tab",
    },
    {
      type: "fullscreen_exit",
      timestamp: "00:42:15",
      description: "Exited fullscreen mode",
    },
  ] as Violation[],
};

export default function StudentSummaryPage() {
  const params = useParams();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const totalVideoDuration = 78 * 60; // 78 minutes in seconds

  const scorePercentage = (mockResults.totalScore / mockResults.maxScore) * 100;
  const scoreColor =
    scorePercentage >= 80
      ? "text-emerald-500"
      : scorePercentage >= 60
      ? "text-yellow-500"
      : "text-red-500";

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalVideoDuration) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 100); // Faster for demo
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalVideoDuration]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">ProctorX</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Test Summary</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/">
              <AnimatedButton variant="ghost" size="sm" icon={<Home className="h-4 w-4" />}>
                Home
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{mockResults.testTitle}</h1>
              <p className="mt-2 text-muted-foreground">
                Submitted on{" "}
                {new Date(mockResults.submittedAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <AnimatedButton
              variant="outline"
              size="sm"
              icon={<Download className="h-4 w-4" />}
            >
              Download Report
            </AnimatedButton>
          </div>
        </motion.div>

        {/* Score Overview */}
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <motion.div
            className="col-span-2 rounded-2xl border border-border bg-card p-6 md:col-span-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-sm text-muted-foreground">Total Score</p>
            <div className="mt-4 flex items-end gap-2">
              <span className={`text-5xl font-bold ${scoreColor}`}>
                {mockResults.totalScore}
              </span>
              <span className="mb-2 text-xl text-muted-foreground">
                / {mockResults.maxScore}
              </span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-muted">
              <motion.div
                className={`h-full rounded-full ${
                  scorePercentage >= 80
                    ? "bg-emerald-500"
                    : scorePercentage >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${scorePercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-border bg-card p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-sm text-muted-foreground">Time Spent</p>
            <div className="mt-4 flex items-center gap-2">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-3xl font-bold">{mockResults.duration}</p>
                <p className="text-xs text-muted-foreground">
                  of {mockResults.totalDuration} mins
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-border bg-card p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm text-muted-foreground">Your Rank</p>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-3xl font-bold">#{mockResults.rank}</p>
                <p className="text-xs text-muted-foreground">
                  of {mockResults.totalCandidates} candidates
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-border bg-card p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm text-muted-foreground">Violations</p>
            <div className="mt-4 flex items-center gap-2">
              <AlertTriangle
                className={`h-8 w-8 ${
                  mockResults.violations.length > 0
                    ? "text-destructive"
                    : "text-emerald-500"
                }`}
              />
              <div>
                <p className="text-3xl font-bold">{mockResults.violations.length}</p>
                <p className="text-xs text-muted-foreground">
                  {mockResults.violations.length === 0
                    ? "Clean record"
                    : "Events logged"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Question Results */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold">Question Results</h2>
          <div className="mt-4 space-y-4">
            {mockResults.questions.map((question, i) => (
              <motion.div
                key={question.id}
                className="rounded-xl border border-border bg-card p-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        question.score === question.maxScore
                          ? "bg-emerald-500/20 text-emerald-500"
                          : question.score >= question.maxScore * 0.7
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {question.score === question.maxScore ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Code2 className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Question {i + 1}: {question.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          {question.testsPassed}/{question.totalTests} tests
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {question.timeSpent} mins
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-2xl font-bold ${
                        question.score === question.maxScore
                          ? "text-emerald-500"
                          : question.score >= question.maxScore * 0.7
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {question.score}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      / {question.maxScore} pts
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <motion.div
                    className={`h-full rounded-full ${
                      question.score === question.maxScore
                        ? "bg-emerald-500"
                        : question.score >= question.maxScore * 0.7
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(question.score / question.maxScore) * 100}%`,
                    }}
                    transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video Replay Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <h2 className="text-xl font-semibold">Session Recording</h2>
          <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
            {/* Video Player Placeholder */}
            <div className="relative aspect-video bg-slate-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Video className="mx-auto h-16 w-16 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    Session recording playback
                  </p>
                </div>
              </div>

              {/* Violation Markers */}
              {mockResults.violations.map((violation, i) => (
                <motion.div
                  key={i}
                  className="absolute top-4 bg-destructive/90 text-white px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    left: `${(parseInt(violation.timestamp.split(":")[0]) * 60 + parseInt(violation.timestamp.split(":")[1])) / (mockResults.duration * 60) * 100}%`,
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.2 }}
                >
                  <AlertTriangle className="inline h-4 w-4 mr-1" />
                  {violation.type.replace("_", " ")}
                </motion.div>
              ))}

              {/* Play Button Overlay */}
              {!isPlaying && (
                <motion.button
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                  onClick={() => setIsPlaying(true)}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 text-primary-foreground">
                    <Play className="h-8 w-8 ml-1" />
                  </div>
                </motion.button>
              )}
            </div>

            {/* Video Controls */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-4">
                <IconButton
                  variant="ghost"
                  onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                >
                  <SkipBack className="h-5 w-5" />
                </IconButton>
                <IconButton
                  variant="default"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </IconButton>
                <IconButton
                  variant="ghost"
                  onClick={() =>
                    setCurrentTime(Math.min(totalVideoDuration, currentTime + 10))
                  }
                >
                  <SkipForward className="h-5 w-5" />
                </IconButton>

                <div className="flex-1">
                  <div
                    className="relative h-2 cursor-pointer rounded-full bg-muted"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      setCurrentTime(percent * totalVideoDuration);
                    }}
                  >
                    <motion.div
                      className="absolute h-full rounded-full bg-primary"
                      style={{
                        width: `${(currentTime / totalVideoDuration) * 100}%`,
                      }}
                    />
                    {/* Violation markers on timeline */}
                    {mockResults.violations.map((violation, i) => {
                      const timeParts = violation.timestamp.split(":");
                      const seconds =
                        parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
                      return (
                        <div
                          key={i}
                          className="absolute top-1/2 -translate-y-1/2 h-4 w-1 rounded-full bg-destructive"
                          style={{
                            left: `${(seconds / totalVideoDuration) * 100}%`,
                          }}
                          title={violation.description}
                        />
                      );
                    })}
                  </div>
                </div>

                <span className="text-sm text-muted-foreground min-w-[100px] text-right">
                  {formatTime(currentTime)} / {formatTime(totalVideoDuration)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Violations Log */}
        {mockResults.violations.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <h2 className="text-xl font-semibold">Violation Log</h2>
            <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
              <div className="divide-y divide-border">
                {mockResults.violations.map((violation, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.1 + i * 0.1 }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {violation.type
                          .split("_")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {violation.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">{violation.timestamp}</p>
                      <button
                        className="text-xs text-primary hover:underline"
                        onClick={() => {
                          const timeParts = violation.timestamp.split(":");
                          const seconds =
                            parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
                          setCurrentTime(seconds);
                        }}
                      >
                        Jump to timestamp
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer Actions */}
        <motion.div
          className="mt-12 flex items-center justify-between rounded-xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <div>
            <h3 className="font-semibold">Need help?</h3>
            <p className="text-sm text-muted-foreground">
              Contact support if you have questions about your results
            </p>
          </div>
          <AnimatedButton variant="outline">Contact Support</AnimatedButton>
        </motion.div>
      </main>
    </div>
  );
}
