"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Video,
  VideoOff,
  Monitor,
  Send,
  Terminal,
  FileCode,
  Settings,
  AlertCircle,
  X,
  Shield,
  Eye,
  Copy,
  Clipboard,
} from "lucide-react";
import { AnimatedButton, IconButton } from "@/components/ui/animated-button";
import { useTestStore } from "@/lib/store";

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  template: string;
  testCases: Array<{ input: string; expected: string }>;
}

const mockQuestions: Question[] = [
  {
    id: "1",
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

**Constraints:**
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
    difficulty: "easy",
    template: `function twoSum(nums: number[], target: number): number[] {
  // Write your solution here
  
}`,
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", expected: "[0, 1]" },
      { input: "nums = [3,2,4], target = 6", expected: "[1, 2]" },
      { input: "nums = [3,3], target = 6", expected: "[0, 1]" },
    ],
  },
  {
    id: "2",
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**
\`\`\`
Input: s = "()"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: s = "()[]{}"
Output: true
\`\`\`

**Example 3:**
\`\`\`
Input: s = "(]"
Output: false
\`\`\``,
    difficulty: "easy",
    template: `function isValid(s: string): boolean {
  // Write your solution here
  
}`,
    testCases: [
      { input: 's = "()"', expected: "true" },
      { input: 's = "()[]{}"', expected: "true" },
      { input: 's = "(]"', expected: "false" },
    ],
  },
  {
    id: "3",
    title: "Merge Two Sorted Lists",
    description: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

**Example 1:**
\`\`\`
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
\`\`\`

**Example 2:**
\`\`\`
Input: list1 = [], list2 = []
Output: []
\`\`\``,
    difficulty: "medium",
    template: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // Write your solution here
  
}`,
    testCases: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", expected: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", expected: "[]" },
      { input: "list1 = [], list2 = [0]", expected: "[0]" },
    ],
  },
];

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const { addViolation, violations, setFullscreen, isFullscreen } = useTestStore();

  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [code, setCode] = React.useState(mockQuestions[0].template);
  const [output, setOutput] = React.useState<string>("");
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(90 * 60); // 90 minutes
  const [showOutput, setShowOutput] = React.useState(true);
  const [isCameraOn, setIsCameraOn] = React.useState(true);
  const [showWarning, setShowWarning] = React.useState(false);
  const [warningMessage, setWarningMessage] = React.useState("");
  const [showSubmitModal, setShowSubmitModal] = React.useState(false);
  const [questionAnswers, setQuestionAnswers] = React.useState<Record<string, string>>({});
  const [testResults, setTestResults] = React.useState<Array<{ passed: boolean; input: string; expected: string; actual: string }>>([]);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Initialize camera
  React.useEffect(() => {
    if (isCameraOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Camera access denied:", err);
          setIsCameraOn(false);
        });
    }
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  // Timer countdown
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen detection
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setFullscreen(isFS);
      if (!isFS) {
        setWarningMessage("Please return to fullscreen mode to continue the test.");
        setShowWarning(true);
        addViolation({
          type: "fullscreen_exit",
          description: "Exited fullscreen mode",
        });
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [addViolation, setFullscreen]);

  // Tab visibility detection
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningMessage("Tab switch detected! This activity has been logged.");
        setShowWarning(true);
        addViolation({
          type: "tab_switch",
          description: "Switched to another tab or window",
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [addViolation]);

  // Copy-paste detection
  React.useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      setWarningMessage("Copy action detected and logged.");
      setShowWarning(true);
      addViolation({
        type: "copy",
        description: "Attempted to copy content",
      });
    };
    const handlePaste = (e: ClipboardEvent) => {
      setWarningMessage("Paste action detected and logged.");
      setShowWarning(true);
      addViolation({
        type: "paste",
        description: "Attempted to paste content",
      });
    };
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, [addViolation]);

  // Save answer when switching questions
  React.useEffect(() => {
    setQuestionAnswers((prev) => ({
      ...prev,
      [mockQuestions[currentQuestion].id]: code,
    }));
  }, [code, currentQuestion]);

  // Load answer when switching questions
  React.useEffect(() => {
    const savedCode = questionAnswers[mockQuestions[currentQuestion].id];
    setCode(savedCode || mockQuestions[currentQuestion].template);
    setTestResults([]);
    setOutput("");
  }, [currentQuestion]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error("Fullscreen error:", err);
    });
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput("Running tests...\n");

    setTimeout(() => {
      const question = mockQuestions[currentQuestion];
      const results = question.testCases.map((tc, i) => ({
        passed: Math.random() > 0.3,
        input: tc.input,
        expected: tc.expected,
        actual: Math.random() > 0.3 ? tc.expected : "undefined",
      }));
      setTestResults(results);
      const passed = results.filter((r) => r.passed).length;
      setOutput(
        `\n✓ ${passed}/${question.testCases.length} test cases passed\n\n` +
          results
            .map(
              (r, i) =>
                `Test ${i + 1}: ${r.passed ? "✓ Passed" : "✗ Failed"}\n  Input: ${r.input}\n  Expected: ${r.expected}${r.passed ? "" : `\n  Actual: ${r.actual}`}`
            )
            .join("\n\n")
      );
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    router.push(`/student/summary/${params.testId}`);
  };

  const question = mockQuestions[currentQuestion];
  const difficultyColors = {
    easy: "text-emerald-500 bg-emerald-500/10",
    medium: "text-yellow-500 bg-yellow-500/10",
    hard: "text-red-500 bg-red-500/10",
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl border border-destructive/50 bg-card p-8 text-center shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="mt-4 text-xl font-bold">Warning</h2>
              <p className="mt-2 text-muted-foreground">{warningMessage}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Violations logged: {violations.length}
              </p>
              <AnimatedButton
                variant="destructive"
                size="lg"
                className="mt-6 w-full"
                onClick={() => {
                  setShowWarning(false);
                  if (!isFullscreen) {
                    enterFullscreen();
                  }
                }}
              >
                I Understand
              </AnimatedButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <h2 className="mt-4 text-xl font-bold">Submit Test?</h2>
                <p className="mt-2 text-muted-foreground">
                  Are you sure you want to submit your test? This action cannot be undone.
                </p>

                <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Questions Attempted</span>
                    <span className="font-medium">
                      {Object.keys(questionAnswers).length}/{mockQuestions.length}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Remaining</span>
                    <span className="font-medium">{formatTime(timeRemaining)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Violations</span>
                    <span
                      className={`font-medium ${violations.length > 0 ? "text-destructive" : "text-emerald-500"}`}
                    >
                      {violations.length}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setShowSubmitModal(false)}
                  >
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton
                    variant="gradient"
                    size="lg"
                    className="flex-1"
                    onClick={confirmSubmit}
                  >
                    Submit
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">ProctorX</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">
            Senior Frontend Developer Assessment
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <motion.div
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ${
              timeRemaining < 300
                ? "bg-destructive/20 text-destructive"
                : timeRemaining < 600
                ? "bg-yellow-500/20 text-yellow-500"
                : "bg-muted text-foreground"
            }`}
            animate={
              timeRemaining < 300
                ? { scale: [1, 1.05, 1] }
                : {}
            }
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeRemaining)}
          </motion.div>

          {/* Violations Badge */}
          {violations.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-destructive/20 px-3 py-1.5 text-sm font-medium text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {violations.length} Violation{violations.length > 1 ? "s" : ""}
            </div>
          )}

          {/* Camera Toggle */}
          <IconButton
            variant={isCameraOn ? "ghost" : "destructive"}
            onClick={() => setIsCameraOn(!isCameraOn)}
          >
            {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </IconButton>

          {/* Fullscreen Toggle */}
          <IconButton variant="ghost" onClick={enterFullscreen}>
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </IconButton>

          {/* Submit Button */}
          <AnimatedButton
            variant="gradient"
            size="sm"
            icon={<Send className="h-4 w-4" />}
            onClick={handleSubmit}
          >
            Submit
          </AnimatedButton>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Question */}
        <div className="flex w-[400px] flex-col border-r border-border bg-card">
          {/* Question Tabs */}
          <div className="flex items-center gap-1 border-b border-border p-2">
            {mockQuestions.map((q, i) => (
              <motion.button
                key={q.id}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  i === currentQuestion
                    ? "bg-primary text-primary-foreground"
                    : questionAnswers[q.id]
                    ? "bg-emerald-500/20 text-emerald-500"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => setCurrentQuestion(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>

          {/* Question Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  difficultyColors[question.difficulty]
                }`}
              >
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {mockQuestions.length}
              </span>
            </div>

            <h2 className="mt-4 text-xl font-semibold">{question.title}</h2>

            <div className="prose prose-sm dark:prose-invert mt-4 max-w-none">
              <div
                className="text-sm text-muted-foreground whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: question.description
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted rounded-lg p-3 my-2"><code>$1</code></pre>')
                    .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-foreground">$1</code>'),
                }}
              />
            </div>

            {/* Test Cases Preview */}
            <div className="mt-6">
              <h3 className="text-sm font-medium">Test Cases</h3>
              <div className="mt-2 space-y-2">
                {question.testCases.map((tc, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-muted/50 p-3"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Input:</span>
                      <code className="rounded bg-background px-1.5 py-0.5">{tc.input}</code>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Expected:</span>
                      <code className="rounded bg-background px-1.5 py-0.5">{tc.expected}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="flex items-center justify-between border-t border-border p-4">
            <AnimatedButton
              variant="ghost"
              size="sm"
              icon={<ChevronLeft className="h-4 w-4" />}
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </AnimatedButton>
            <AnimatedButton
              variant="ghost"
              size="sm"
              icon={<ChevronRight className="h-4 w-4" />}
              iconPosition="right"
              onClick={() =>
                setCurrentQuestion(Math.min(mockQuestions.length - 1, currentQuestion + 1))
              }
              disabled={currentQuestion === mockQuestions.length - 1}
            >
              Next
            </AnimatedButton>
          </div>
        </div>

        {/* Right Panel - Editor */}
        <div className="flex flex-1 flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">solution.ts</span>
            </div>
            <div className="flex items-center gap-2">
              <AnimatedButton
                variant="outline"
                size="sm"
                icon={<Play className="h-4 w-4" />}
                onClick={handleRun}
                isLoading={isRunning}
                loadingText="Running..."
              >
                Run Code
              </AnimatedButton>
              <IconButton
                variant="ghost"
                onClick={() => setShowOutput(!showOutput)}
              >
                <Terminal className="h-4 w-4" />
              </IconButton>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                minimap: { enabled: false },
                padding: { top: 16 },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                cursorBlinking: "smooth",
                smoothScrolling: true,
              }}
            />
          </div>

          {/* Output Panel */}
          <AnimatePresence>
            {showOutput && (
              <motion.div
                className="border-t border-border bg-card"
                initial={{ height: 0 }}
                animate={{ height: 200 }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Output</span>
                  </div>
                  <IconButton
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => setShowOutput(false)}
                  >
                    <X className="h-3 w-3" />
                  </IconButton>
                </div>
                <div className="h-[calc(200px-40px)] overflow-y-auto p-4">
                  {isRunning ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <motion.div
                        className="h-2 w-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                      />
                      Running tests...
                    </div>
                  ) : output ? (
                    <pre className="font-mono text-sm whitespace-pre-wrap">
                      {testResults.map((result, i) => (
                        <div key={i} className="mb-3">
                          <div
                            className={`flex items-center gap-2 ${
                              result.passed ? "text-emerald-500" : "text-destructive"
                            }`}
                          >
                            {result.passed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                            <span>Test {i + 1}: {result.passed ? "Passed" : "Failed"}</span>
                          </div>
                          <div className="ml-6 mt-1 text-muted-foreground">
                            <div>Input: {result.input}</div>
                            <div>Expected: {result.expected}</div>
                            {!result.passed && <div>Actual: {result.actual}</div>}
                          </div>
                        </div>
                      ))}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Run your code to see output here
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Camera Preview */}
      {isCameraOn && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 overflow-hidden rounded-xl border border-border shadow-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-32 w-44 object-cover"
          />
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Recording
          </div>
        </motion.div>
      )}
    </div>
  );
}
