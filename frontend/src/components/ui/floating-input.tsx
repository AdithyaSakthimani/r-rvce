"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
}

export function FloatingInput({
  label,
  error,
  success,
  icon,
  className,
  type,
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isFloating = isFocused || hasValue;
  const isPassword = type === "password";

  return (
    <div className="relative">
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          ref={inputRef}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={cn(
            "peer h-14 w-full rounded-xl border bg-background px-4 pt-4 text-sm outline-none transition-all duration-200",
            "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
            icon && "pl-12",
            isPassword && "pr-12",
            error
              ? "border-destructive focus:border-destructive"
              : success
              ? "border-emerald-500 focus:border-emerald-500"
              : "border-input focus:border-primary",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            setHasValue(e.target.value.length > 0);
            props.onChange?.(e);
          }}
          {...props}
        />
        <motion.label
          className={cn(
            "pointer-events-none absolute left-4 text-muted-foreground transition-all duration-200",
            icon && "left-12"
          )}
          initial={false}
          animate={{
            top: isFloating ? "6px" : "50%",
            y: isFloating ? 0 : "-50%",
            fontSize: isFloating ? "10px" : "14px",
            color: error
              ? "hsl(var(--destructive))"
              : isFocused
              ? "hsl(var(--primary))"
              : undefined,
          }}
          transition={{ duration: 0.15 }}
        >
          {label}
        </motion.label>
        {isPassword && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        {success && !isPassword && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            className="mt-2 flex items-center gap-1.5 text-xs text-destructive"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <AlertCircle className="h-3 w-3" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function FloatingTextarea({
  label,
  error,
  className,
  ...props
}: FloatingTextareaProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  const isFloating = isFocused || hasValue;

  return (
    <div className="relative">
      <div className="relative">
        <textarea
          className={cn(
            "peer min-h-[120px] w-full rounded-xl border bg-background px-4 pt-6 text-sm outline-none transition-all duration-200 resize-none",
            "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
            error
              ? "border-destructive focus:border-destructive"
              : "border-input focus:border-primary",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            setHasValue(e.target.value.length > 0);
            props.onChange?.(e);
          }}
          {...props}
        />
        <motion.label
          className="pointer-events-none absolute left-4 text-muted-foreground transition-all duration-200"
          initial={false}
          animate={{
            top: isFloating ? "8px" : "16px",
            fontSize: isFloating ? "10px" : "14px",
            color: error
              ? "hsl(var(--destructive))"
              : isFocused
              ? "hsl(var(--primary))"
              : undefined,
          }}
          transition={{ duration: 0.15 }}
        >
          {label}
        </motion.label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            className="mt-2 flex items-center gap-1.5 text-xs text-destructive"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <AlertCircle className="h-3 w-3" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
