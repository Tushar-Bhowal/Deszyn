"use client";

import React from "react";
import Image from "next/image";

import { TimelineAnimation } from "@/components/ui/timeline-animation";
import { FloatingPaths } from "./FloatingPaths";

export function AuthLeftPanel({ children }: { children?: React.ReactNode }) {
  const timelineRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={timelineRef}
      className="bg-muted/60 relative hidden h-full flex-col overflow-hidden border-r border-white/6 p-10 lg:flex z-10"
    >
      <div className="bg-[radial-gradient(ellipse_at_top_left,rgba(0,85,254,0.15)_0,transparent_70%)] absolute inset-0 z-0" />
      <div className="from-background absolute inset-0 z-10 bg-linear-to-t to-transparent" />

      <TimelineAnimation
        animationNum={0}
        timelineRef={timelineRef}
        className="z-10 flex items-center gap-2"
      >
        <Image
          src="/logo.png"
          alt="Deszyn"
          width={26}
          height={26}
          priority
          className="rounded-md w-auto h-auto"
        />
        <p className="text-xl font-semibold text-white">Deszyn</p>
      </TimelineAnimation>

      {children && (
        <TimelineAnimation
          animationNum={1}
          timelineRef={timelineRef}
          className="z-10 flex flex-1 items-center justify-center"
        >
          {children}
        </TimelineAnimation>
      )}

      <TimelineAnimation
        animationNum={2}
        timelineRef={timelineRef}
        className="z-10 mt-auto"
      >
        <blockquote className="space-y-2">
          <p className="text-xl text-white/90">
            &ldquo;The code took me 2 days, but design usually takes 3. This
            platform eliminates the entire design bottleneck for me.&rdquo;
          </p>
          <footer className="font-mono text-sm font-semibold text-white/70">
            ~ Senior Developer
          </footer>
        </blockquote>
      </TimelineAnimation>

      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
    </div>
  );
}
