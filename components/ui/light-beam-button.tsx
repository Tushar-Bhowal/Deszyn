"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LightBeamButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "children"
> {
  children: React.ReactNode;
  className?: string;
  gradientColors?: [string, string, string];
  tone?: "primary" | "dark";
}

export function LightBeamButton({
  children,
  className,
  gradientColors = [
    "rgba(255,255,255,0.78)",
    "rgba(169,204,255,0.98)",
    "rgba(255,255,255,0.78)",
  ],
  tone = "primary",
  ...props
}: LightBeamButtonProps) {
  const gradientString = `conic-gradient(from var(--gradient-angle), transparent 0%, ${gradientColors[0]} 40%, ${gradientColors[1]} 50%, transparent 60%, transparent 100%)`;
  const isDarkTone = tone === "dark";
  const baseFill = isDarkTone
    ? "linear-gradient(180deg, rgba(13,13,18,0.98) 0%, rgba(8,8,12,0.98) 100%)"
    : "linear-gradient(180deg, color-mix(in srgb, var(--cta-primary-background) 84%, black 16%) 0%, color-mix(in srgb, var(--cta-primary-background) 94%, black 6%) 100%)";
  const hoverFill = isDarkTone
    ? "linear-gradient(180deg, rgba(21,21,28,0.98) 0%, rgba(11,11,16,0.98) 100%)"
    : "linear-gradient(180deg, color-mix(in srgb, var(--cta-primary-background-hover) 86%, black 14%) 0%, color-mix(in srgb, var(--cta-primary-background) 92%, black 8%) 100%)";
  const borderColor = isDarkTone
    ? "rgba(138, 177, 255, 0.34)"
    : "var(--cta-primary-border)";
  const shadowClass = isDarkTone
    ? "shadow-[0_10px_30px_rgba(0,0,0,0.34)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.42)]"
    : "shadow-[0_10px_32px_rgba(0,85,255,0.28)] hover:shadow-[0_16px_42px_rgba(0,85,255,0.34)]";

  return (
    <>
      <style>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes border-spin {
          from { --gradient-angle: 0deg; }
          to   { --gradient-angle: 360deg; }
        }
        .animate-border-spin {
          animation: border-spin 3s linear infinite;
        }
      `}</style>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-xl",
          "px-8 py-3.5 text-sm font-semibold text-white",
          "transition-[box-shadow,filter,transform] duration-300",
          shadowClass,
          className,
        )}
        style={{
          border: `1px solid ${borderColor}`,
          background: baseFill,
        }}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        <div
          className="absolute inset-0 -z-10 rounded-xl p-[1.5px] animate-border-spin"
          style={
            {
              "--gradient-angle": "0deg",
              background: gradientString,
            } as React.CSSProperties
          }
        />

        <div
          className="absolute inset-[1.5px] -z-10 rounded-xl transition-all duration-300 group-hover:brightness-110"
          style={{
            background: hoverFill,
          }}
        />

        <div className="absolute inset-0 -z-10 rounded-xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.button>
    </>
  );
}
