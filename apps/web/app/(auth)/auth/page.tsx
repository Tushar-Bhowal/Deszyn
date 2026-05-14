'use client';

import {
  AtSignIcon,
  Brain,
  ChevronLeftIcon,
  Code2,
  Gauge,
  LockIcon,
  Palette,
  UserIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TimelineAnimation } from '@/components/ui/timeline-animation';
import { AuthLeftPanel } from './_components/AuthLeftPanel';
import { OAuthButtons } from './_components/OAuthButtons';

const AuthSeparator = () => (
  <div className="flex w-full items-center justify-center">
    <div className="bg-border h-px w-full" />
    <span className="text-muted-foreground px-2 text-xs">OR</span>
    <div className="bg-border h-px w-full" />
  </div>
);

// Left panel feature highlights
const features = [
  { icon: Brain, label: 'AI-powered design generation in seconds' },
  { icon: Code2, label: 'Export clean global.css & production assets' },
  { icon: Gauge, label: '10× faster than traditional design' },
  { icon: Palette, label: 'Full brand identity — logo, colors & brand name' },
];

// Suspense fallback
const AuthSkeleton = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="animate-pulse space-y-4 sm:w-sm w-full px-4">
      <div className="h-8 w-48 rounded bg-white/10" />
      <div className="h-4 w-64 rounded bg-white/6" />
      <div className="h-10 rounded bg-white/10" />
      <div className="h-10 rounded bg-white/10" />
      <div className="h-10 rounded bg-white/10" />
    </div>
  </div>
);

function AuthContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'login';
  const isSignUp = type === 'signup';
  const timelineRef = React.useRef<HTMLDivElement>(null);

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <AuthLeftPanel>
        <div className="w-full max-w-sm space-y-3">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/20">
                <Icon className="size-4 text-blue-400" />
              </div>
              <span className="text-sm text-white/80">{label}</span>
            </div>
          ))}
        </div>
      </AuthLeftPanel>

      {/* ── Right panel ── */}
      <div
        ref={timelineRef}
        className="relative flex min-h-screen flex-col justify-center p-4 z-10"
      >
        <div aria-hidden className="absolute inset-0 isolate contain-strict -z-10 opacity-60">
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(0,85,254,0.15)_0,rgba(0,85,254,0.05)_50%,transparent_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full blur-2xl" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,85,254,0.1)_0,rgba(0,85,254,0.02)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full blur-xl" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,85,254,0.1)_0,rgba(0,85,254,0.02)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full blur-xl" />
        </div>

        <Button
          variant="ghost"
          className="absolute top-7 left-5 border border-transparent text-white/75 hover:border-white/10 hover:bg-black/40 hover:text-white dark:hover:bg-black/40"
          asChild
        >
          <Link href="/">
            <ChevronLeftIcon className="size-4 me-2" />
            Home
          </Link>
        </Button>

        <div className="mx-auto space-y-4 sm:w-sm w-full">
          <TimelineAnimation
            animationNum={0}
            timelineRef={timelineRef}
            className="flex items-center gap-2 lg:hidden"
          >
            <Image
              src="/logo.png"
              alt="Deszyn"
              width={24}
              height={24}
              priority
              className="rounded-md w-auto h-auto"
            />
            <p className="text-lg font-semibold text-white">Deszyn</p>
          </TimelineAnimation>

          <TimelineAnimation
            animationNum={1}
            timelineRef={timelineRef}
            className="flex flex-col space-y-1"
          >
            <h1 className="font-heading text-2xl font-bold tracking-wide">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignUp ? 'Sign up to start designing with AI.' : 'Log in to your account.'}
            </p>
          </TimelineAnimation>

          <TimelineAnimation animationNum={2} timelineRef={timelineRef}>
            <OAuthButtons />
          </TimelineAnimation>

          <TimelineAnimation animationNum={3} timelineRef={timelineRef}>
            <AuthSeparator />
          </TimelineAnimation>

          <TimelineAnimation animationNum={4} timelineRef={timelineRef}>
            <form className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs" htmlFor="username">
                    Username
                  </Label>
                  <div className="relative h-max">
                    <Input
                      id="username"
                      placeholder="johndoe"
                      className="peer ps-9 border-white/15 focus:border-white/30"
                      type="text"
                    />
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                      <UserIcon className="size-4" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs" htmlFor="email">
                  Email
                </Label>
                <div className="relative h-max">
                  <Input
                    id="email"
                    placeholder="your.email@example.com"
                    className="peer ps-9 border-white/15 focus:border-white/30"
                    type="email"
                  />
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <AtSignIcon className="size-4" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground text-xs" htmlFor="password">
                    Password
                  </Label>
                  {!isSignUp && (
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative h-max">
                  <Input
                    id="password"
                    placeholder="••••••••"
                    className="peer ps-9 border-white/15 focus:border-white/30"
                    type="password"
                  />
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <LockIcon className="size-4" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <Button
                type="button"
                className="w-full rounded-lg border border-white/10 bg-blue-600 font-semibold text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:bg-blue-500 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)]"
              >
                {isSignUp ? 'Sign Up' : 'Log In'}
              </Button>
            </form>
          </TimelineAnimation>

          <TimelineAnimation
            animationNum={5}
            timelineRef={timelineRef}
            className="text-center text-sm"
          >
            {isSignUp ? (
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="?type=login"
                  className="text-blue-500 hover:text-blue-400 font-semibold underline underline-offset-4 transition-colors"
                >
                  Login
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link
                  href="?type=signup"
                  className="text-blue-500 hover:text-blue-400 font-semibold underline underline-offset-4 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            )}
          </TimelineAnimation>

          <TimelineAnimation
            animationNum={6}
            timelineRef={timelineRef}
            as="p"
            className="text-muted-foreground border-t border-white/10 pt-4 text-left text-xs"
          >
            By clicking continue, you agree to our{' '}
            <button type="button" className="hover:text-primary underline underline-offset-4">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="hover:text-primary underline underline-offset-4">
              Privacy Policy
            </button>
            .
          </TimelineAnimation>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <AuthContent />
    </Suspense>
  );
}
