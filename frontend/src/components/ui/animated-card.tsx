"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "hover" | "interactive" | "glass";
  children: React.ReactNode;
}

const cardVariants = {
  default: "bg-card border border-border",
  hover: "bg-card border border-border hover:border-primary/50 hover:shadow-lg",
  interactive: "bg-card border border-border cursor-pointer",
  glass: "bg-background/60 backdrop-blur-xl border border-white/10",
};

export function AnimatedCard({
  children,
  className,
  variant = "default",
  ...props
}: AnimatedCardProps) {
  const isInteractive = variant === "interactive" || variant === "hover";

  return (
    <motion.div
      className={cn(
        "rounded-xl p-6 transition-colors",
        cardVariants[variant],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={isInteractive ? { y: -4, scale: 1.01 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5 pb-4", className)}>
      {children}
    </div>
  );
}

export function AnimatedCardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function AnimatedCardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function AnimatedCardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("", className)}>{children}</div>;
}

export function AnimatedCardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center pt-4", className)}>
      {children}
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && (
          <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        )}
      </div>
      <div className="mt-3">
        <motion.p
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: delay + 0.2 }}
        >
          {value}
        </motion.p>
        {(description || trend) && (
          <div className="mt-1 flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-emerald-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
