"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Plus,
  Search,
  Filter,
  MoreVertical,
  FileCode,
  Users,
  Clock,
  BarChart3,
  Eye,
  Trash2,
  Copy,
  ExternalLink,
  ChevronDown,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  X,
} from "lucide-react";
import { AnimatedButton, IconButton } from "@/components/ui/animated-button";
import { StatsCard } from "@/components/ui/animated-card";
import { AnimatedModal } from "@/components/ui/animated-modal";
import { FloatingInput, FloatingTextarea } from "@/components/ui/floating-input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SkeletonTable, SkeletonStats } from "@/components/ui/skeleton-loader";

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: number;
  candidates: number;
  status: "active" | "draft" | "completed";
  createdAt: string;
  submissions: number;
  avgScore: number;
}

interface Submission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  testTitle: string;
  score: number;
  status: "completed" | "in_progress" | "flagged";
  violations: number;
  submittedAt: string;
}

const mockTests: Test[] = [
  {
    id: "1",
    title: "Senior Frontend Developer Assessment",
    description: "React, TypeScript, and system design challenges",
    duration: 90,
    questions: 5,
    candidates: 45,
    status: "active",
    createdAt: "2024-01-15",
    submissions: 32,
    avgScore: 78,
  },
  {
    id: "2",
    title: "Backend Engineering Challenge",
    description: "Node.js, databases, and API design",
    duration: 120,
    questions: 6,
    candidates: 28,
    status: "active",
    createdAt: "2024-01-10",
    submissions: 24,
    avgScore: 72,
  },
  {
    id: "3",
    title: "Full Stack Developer Test",
    description: "End-to-end application development",
    duration: 150,
    questions: 8,
    candidates: 15,
    status: "draft",
    createdAt: "2024-01-18",
    submissions: 0,
    avgScore: 0,
  },
  {
    id: "4",
    title: "Algorithm & Data Structures",
    description: "Core CS fundamentals assessment",
    duration: 60,
    questions: 10,
    candidates: 120,
    status: "completed",
    createdAt: "2024-01-05",
    submissions: 118,
    avgScore: 65,
  },
];

const mockSubmissions: Submission[] = [
  {
    id: "1",
    candidateName: "Alice Johnson",
    candidateEmail: "alice@email.com",
    testTitle: "Senior Frontend Developer Assessment",
    score: 92,
    status: "completed",
    violations: 0,
    submittedAt: "2024-01-20T14:30:00",
  },
  {
    id: "2",
    candidateName: "Bob Smith",
    candidateEmail: "bob@email.com",
    testTitle: "Senior Frontend Developer Assessment",
    score: 78,
    status: "flagged",
    violations: 3,
    submittedAt: "2024-01-20T12:15:00",
  },
  {
    id: "3",
    candidateName: "Carol Williams",
    candidateEmail: "carol@email.com",
    testTitle: "Backend Engineering Challenge",
    score: 85,
    status: "completed",
    violations: 0,
    submittedAt: "2024-01-19T16:45:00",
  },
  {
    id: "4",
    candidateName: "David Brown",
    candidateEmail: "david@email.com",
    testTitle: "Algorithm & Data Structures",
    score: 0,
    status: "in_progress",
    violations: 1,
    submittedAt: "",
  },
  {
    id: "5",
    candidateName: "Emma Davis",
    candidateEmail: "emma@email.com",
    testTitle: "Senior Frontend Developer Assessment",
    score: 88,
    status: "completed",
    violations: 0,
    submittedAt: "2024-01-18T09:20:00",
  },
];

export default function RecruiterDashboard() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"tests" | "submissions" | "analytics">("tests");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState<Test | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const [newTest, setNewTest] = React.useState({
    title: "",
    description: "",
    duration: "90",
    questions: "",
  });

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredTests = mockTests.filter(
    (test) =>
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubmissions = mockSubmissions.filter(
    (sub) =>
      sub.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.testTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTest = () => {
    // Simulate API call
    setIsCreateModalOpen(false);
    setNewTest({ title: "", description: "", duration: "90", questions: "" });
  };

  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-500",
    draft: "bg-yellow-500/10 text-yellow-500",
    completed: "bg-slate-500/10 text-slate-500",
    in_progress: "bg-blue-500/10 text-blue-500",
    flagged: "bg-red-500/10 text-red-500",
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            {isSidebarOpen && <span className="font-bold">ProctorX</span>}
          </Link>
          <IconButton
            variant="ghost"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="h-8 w-8"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isSidebarOpen ? "rotate-90" : "-rotate-90"
              }`}
            />
          </IconButton>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {[
            { icon: BarChart3, label: "Dashboard", active: true },
            { icon: FileCode, label: "Tests", active: false },
            { icon: Users, label: "Candidates", active: false },
            { icon: Calendar, label: "Schedule", active: false },
            { icon: Settings, label: "Settings", active: false },
          ].map((item, i) => (
            <motion.button
              key={i}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              whileHover={{ x: 4 }}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {isSidebarOpen && <span>{item.label}</span>}
            </motion.button>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-medium text-white">
              JD
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">John Doe</p>
                <p className="truncate text-xs text-muted-foreground">
                  john@company.com
                </p>
              </div>
            )}
            {isSidebarOpen && (
              <IconButton variant="ghost" className="h-8 w-8">
                <LogOut className="h-4 w-4" />
              </IconButton>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage your assessments and candidates
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <IconButton variant="ghost">
              <Bell className="h-5 w-5" />
            </IconButton>
            <AnimatedButton
              variant="gradient"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Test
            </AnimatedButton>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Grid */}
          {isLoading ? (
            <SkeletonStats />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Tests"
                value={mockTests.length}
                description="Active assessments"
                icon={<FileCode className="h-5 w-5" />}
                trend={{ value: 12, isPositive: true }}
                delay={0}
              />
              <StatsCard
                title="Total Candidates"
                value="208"
                description="This month"
                icon={<Users className="h-5 w-5" />}
                trend={{ value: 8, isPositive: true }}
                delay={0.1}
              />
              <StatsCard
                title="Avg. Score"
                value="74%"
                description="Across all tests"
                icon={<TrendingUp className="h-5 w-5" />}
                trend={{ value: 5, isPositive: true }}
                delay={0.2}
              />
              <StatsCard
                title="Flagged"
                value="7"
                description="Requires review"
                icon={<AlertTriangle className="h-5 w-5" />}
                trend={{ value: 15, isPositive: false }}
                delay={0.3}
              />
            </div>
          )}

          {/* Tabs */}
          <div className="mt-8 flex items-center gap-6 border-b border-border">
            {[
              { id: "tests", label: "Tests", count: mockTests.length },
              { id: "submissions", label: "Submissions", count: mockSubmissions.length },
              { id: "analytics", label: "Analytics", count: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`relative pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  {tab.count !== null && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {tab.count}
                    </span>
                  )}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeTab"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <AnimatedButton variant="outline" size="sm" icon={<Filter className="h-4 w-4" />}>
                Filter
              </AnimatedButton>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <SkeletonTable rows={5} />
              ) : activeTab === "tests" ? (
                <motion.div
                  key="tests"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {filteredTests.map((test, i) => (
                    <motion.div
                      key={test.id}
                      className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            statusColors[test.status]
                          }`}
                        >
                          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        </div>
                        <IconButton variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                        </IconButton>
                      </div>

                      <h3 className="mt-3 font-semibold line-clamp-1">{test.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {test.description}
                      </p>

                      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {test.duration}m
                        </span>
                        <span className="flex items-center gap-1">
                          <FileCode className="h-4 w-4" />
                          {test.questions} Qs
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {test.candidates}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                        <AnimatedButton
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedTest(test);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </AnimatedButton>
                        <AnimatedButton variant="ghost" size="sm" className="flex-1">
                          <Copy className="mr-1 h-4 w-4" />
                          Copy Link
                        </AnimatedButton>
                      </div>
                    </motion.div>
                  ))}

                  {/* Add New Test Card */}
                  <motion.button
                    className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 p-5 transition-colors hover:border-primary/50 hover:bg-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: filteredTests.length * 0.05 }}
                    whileHover={{ y: -2 }}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-3 font-medium">Create New Test</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add a new assessment
                    </p>
                  </motion.button>
                </motion.div>
              ) : activeTab === "submissions" ? (
                <motion.div
                  key="submissions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-xl border border-border overflow-hidden"
                >
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Candidate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Test
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Violations
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredSubmissions.map((submission, i) => (
                        <motion.tr
                          key={submission.id}
                          className="transition-colors hover:bg-muted/30"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-xs font-medium text-white">
                                {submission.candidateName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {submission.candidateName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {submission.candidateEmail}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {submission.testTitle}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-sm font-medium ${
                                submission.score >= 80
                                  ? "text-emerald-500"
                                  : submission.score >= 60
                                  ? "text-yellow-500"
                                  : submission.score > 0
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {submission.status === "in_progress"
                                ? "-"
                                : `${submission.score}%`}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                statusColors[submission.status]
                              }`}
                            >
                              {submission.status === "in_progress"
                                ? "In Progress"
                                : submission.status.charAt(0).toUpperCase() +
                                  submission.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {submission.violations > 0 ? (
                              <span className="flex items-center gap-1 text-sm text-red-500">
                                <AlertTriangle className="h-4 w-4" />
                                {submission.violations}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-sm text-emerald-500">
                                <CheckCircle2 className="h-4 w-4" />
                                Clean
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/recruiter/review/${submission.id}`}>
                                <IconButton variant="ghost" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </IconButton>
                              </Link>
                              <IconButton variant="ghost" className="h-8 w-8">
                                <ExternalLink className="h-4 w-4" />
                              </IconButton>
                              <IconButton variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </IconButton>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              ) : (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid gap-6 lg:grid-cols-2"
                >
                  {/* Score Distribution */}
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="font-semibold">Score Distribution</h3>
                    <p className="text-sm text-muted-foreground">
                      Candidate performance across all tests
                    </p>
                    <div className="mt-6 flex items-end justify-between gap-2 h-48">
                      {[
                        { range: "0-20", count: 5, color: "bg-red-500" },
                        { range: "21-40", count: 12, color: "bg-orange-500" },
                        { range: "41-60", count: 28, color: "bg-yellow-500" },
                        { range: "61-80", count: 45, color: "bg-emerald-400" },
                        { range: "81-100", count: 32, color: "bg-emerald-500" },
                      ].map((bar, i) => (
                        <div key={i} className="flex flex-1 flex-col items-center gap-2">
                          <motion.div
                            className={`w-full rounded-t-lg ${bar.color}`}
                            initial={{ height: 0 }}
                            animate={{ height: `${(bar.count / 50) * 100}%` }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {bar.range}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Completion Rate */}
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="font-semibold">Completion Rate</h3>
                    <p className="text-sm text-muted-foreground">
                      Test completion statistics
                    </p>
                    <div className="mt-6 flex items-center justify-center">
                      <div className="relative h-48 w-48">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            className="text-muted"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            strokeLinecap="round"
                            className="text-primary"
                            strokeDasharray="251.2"
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 * (1 - 0.87) }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold">87%</span>
                          <span className="text-sm text-muted-foreground">
                            Completion
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
                    <h3 className="font-semibold">Recent Activity</h3>
                    <p className="text-sm text-muted-foreground">
                      Latest candidate submissions
                    </p>
                    <div className="mt-6 space-y-4">
                      {mockSubmissions.slice(0, 4).map((sub, i) => (
                        <motion.div
                          key={sub.id}
                          className="flex items-center gap-4 rounded-lg border border-border p-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-sm font-medium text-white">
                            {sub.candidateName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{sub.candidateName}</p>
                            <p className="text-sm text-muted-foreground">
                              {sub.status === "completed"
                                ? `Completed ${sub.testTitle} with ${sub.score}%`
                                : sub.status === "in_progress"
                                ? `Started ${sub.testTitle}`
                                : `Flagged in ${sub.testTitle}`}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              statusColors[sub.status]
                            }`}
                          >
                            {sub.status === "in_progress"
                              ? "In Progress"
                              : sub.status.charAt(0).toUpperCase() +
                                sub.status.slice(1)}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Create Test Modal */}
      <AnimatedModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Test"
        description="Set up a new assessment for your candidates"
        size="lg"
      >
        <div className="space-y-5">
          <FloatingInput
            label="Test title"
            value={newTest.title}
            onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
          />
          <FloatingTextarea
            label="Description"
            value={newTest.description}
            onChange={(e) =>
              setNewTest({ ...newTest, description: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              label="Duration (minutes)"
              type="number"
              value={newTest.duration}
              onChange={(e) =>
                setNewTest({ ...newTest, duration: e.target.value })
              }
            />
            <FloatingInput
              label="Number of questions"
              type="number"
              value={newTest.questions}
              onChange={(e) =>
                setNewTest({ ...newTest, questions: e.target.value })
              }
            />
          </div>

          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <FileCode className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop question files here, or{" "}
              <button className="text-primary hover:underline">browse</button>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supports .json, .md, .txt files
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <AnimatedButton
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton variant="gradient" onClick={handleCreateTest}>
              Create Test
            </AnimatedButton>
          </div>
        </div>
      </AnimatedModal>

      {/* Test Detail Modal */}
      <AnimatedModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedTest?.title || "Test Details"}
        size="lg"
      >
        {selectedTest && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  statusColors[selectedTest.status]
                }`}
              >
                {selectedTest.status.charAt(0).toUpperCase() +
                  selectedTest.status.slice(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                Created on {selectedTest.createdAt}
              </span>
            </div>

            <p className="text-muted-foreground">{selectedTest.description}</p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-border p-4 text-center">
                <Clock className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-2xl font-bold">{selectedTest.duration}</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <FileCode className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-2xl font-bold">{selectedTest.questions}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <Users className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-2xl font-bold">
                  {selectedTest.submissions}
                </p>
                <p className="text-xs text-muted-foreground">Submissions</p>
              </div>
              <div className="rounded-lg border border-border p-4 text-center">
                <TrendingUp className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-2xl font-bold">
                  {selectedTest.avgScore || "-"}%
                </p>
                <p className="text-xs text-muted-foreground">Avg. Score</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <AnimatedButton variant="outline" icon={<Copy className="h-4 w-4" />}>
                Copy Link
              </AnimatedButton>
              <AnimatedButton variant="gradient" icon={<ExternalLink className="h-4 w-4" />}>
                View Submissions
              </AnimatedButton>
            </div>
          </div>
        )}
      </AnimatedModal>
    </div>
  );
}
