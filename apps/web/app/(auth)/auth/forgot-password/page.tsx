'use client';

import { AtSignIcon, ChevronLeftIcon, MailCheckIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { TimelineAnimation } from '@/components/ui/timeline-animation';
import { AuthLeftPanel } from '../_components/AuthLeftPanel';

// ─── Skeleton ────────────────────────────────────────────────────────────────
const ForgotSkeleton = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="animate-pulse space-y-4 sm:w-sm w-full px-4">
      <div className="h-8 w-48 rounded bg-white/10" />
      <div className="h-4 w-64 rounded bg-white/6" />
      <div className="h-10 rounded bg-white/10" />
      <div className="h-10 rounded bg-white/10" />
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
function ForgotPasswordContent() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const timelineRef = React.useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: wire Better Auth
    // await authClient.forgetPassword({ email, redirectTo: '/auth/reset-password' });
    await new Promise((r) => setTimeout(r, 800)); // remove when wired
    setLoading(false);
    setSent(true);
  }

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <AuthLeftPanel>
        <div className="max-w-xs space-y-3 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-600/10">
            <MailCheckIcon className="size-8 text-blue-400" />
          </div>
          <p className="text-lg font-semibold text-white">Password recovery</p>
          <p className="text-sm text-white/50 leading-relaxed">
            We&apos;ll send a secure link to your inbox so you can reset your password safely.
          </p>
        </div>
      </AuthLeftPanel>

      {/* ── Right panel ── */}
      <div
        ref={timelineRef}
        className="relative flex min-h-screen flex-col justify-center p-4 z-10"
      >
        {/* Blue glow background — identical to auth page */}
        <div aria-hidden className="absolute inset-0 isolate contain-strict -z-10 opacity-60">
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(0,85,254,0.15)_0,rgba(0,85,254,0.05)_50%,transparent_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full blur-2xl" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,85,254,0.1)_0,rgba(0,85,254,0.02)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full blur-xl" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,85,254,0.1)_0,rgba(0,85,254,0.02)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full blur-xl" />
        </div>

        {/* Back button */}
        <Button
          variant="ghost"
          className="absolute top-7 left-5 border border-transparent text-white/75 hover:border-white/10 hover:bg-black/40 hover:text-white dark:hover:bg-black/40"
          asChild
        >
          <Link href="/auth">
            <ChevronLeftIcon className="size-4 me-2" />
            Back to login
          </Link>
        </Button>

        <div className="mx-auto space-y-6 sm:w-sm w-full">
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

          {!sent ? (
            <>
              <TimelineAnimation
                animationNum={1}
                timelineRef={timelineRef}
                className="flex flex-col space-y-1"
              >
                <h1 className="font-heading text-2xl font-bold tracking-wide">
                  Forgot your password?
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </TimelineAnimation>

              <TimelineAnimation animationNum={2} timelineRef={timelineRef}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs" htmlFor="email">
                      Email address
                    </Label>
                    <div className="relative h-max">
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="peer ps-9 border-white/15 focus:border-white/30"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                        <AtSignIcon className="size-4" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full rounded-lg border border-white/10 bg-blue-600 font-semibold text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:bg-blue-500 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="size-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>
              </TimelineAnimation>

              <TimelineAnimation
                animationNum={3}
                timelineRef={timelineRef}
                as="p"
                className="text-center text-sm text-muted-foreground"
              >
                Remembered it?{' '}
                <Link
                  href="/auth"
                  className="text-blue-500 hover:text-blue-400 font-semibold underline underline-offset-4 transition-colors"
                >
                  Back to login
                </Link>
              </TimelineAnimation>
            </>
          ) : (
            <TimelineAnimation
              animationNum={1}
              timelineRef={timelineRef}
              className="flex flex-col items-center space-y-4 py-4 text-center"
            >
              <div className="flex size-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-600/10">
                <MailCheckIcon className="size-8 text-blue-400" />
              </div>
              <div className="space-y-1">
                <h1 className="font-heading text-2xl font-bold tracking-wide">Check your inbox</h1>
                <p className="text-muted-foreground text-sm max-w-xs">
                  We sent a reset link to <span className="text-white font-medium">{email}</span>.
                  It expires in 15 minutes.
                </p>
              </div>
              <Button
                variant="ghost"
                className="text-blue-500 hover:text-blue-400 text-sm underline underline-offset-4"
                onClick={() => setSent(false)}
              >
                Wrong email? Try again
              </Button>
              <p className="text-muted-foreground text-xs border-t border-white/10 pt-4 w-full text-left">
                Didn&apos;t receive it? Check your spam folder or wait a minute before resending.
              </p>
            </TimelineAnimation>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotSkeleton />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
