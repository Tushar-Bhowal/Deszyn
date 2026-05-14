'use client';

import { CheckCircleIcon, ChevronLeftIcon, EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { TimelineAnimation } from '@/components/ui/timeline-animation';
import { AuthLeftPanel } from '../_components/AuthLeftPanel';

// Skeleton
const ResetSkeleton = () => (
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

// Password strength
function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score === 2) return { score, label: 'Fair', color: 'bg-orange-400' };
  if (score === 3) return { score, label: 'Good', color: 'bg-yellow-400' };
  return { score, label: 'Strong', color: 'bg-green-500' };
}

function PasswordInput({
  id,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative h-max">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className="peer ps-9 pe-9 border-white/15 focus:border-white/30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      {/* Lock icon left */}
      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <LockIcon className="size-4" aria-hidden="true" />
      </div>
      {/* Show/hide toggle right */}
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="text-muted-foreground absolute inset-y-0 inset-e-0 flex items-center justify-center pe-3 hover:text-white transition-colors"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </button>
    </div>
  );
}

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timelineRef = React.useRef<HTMLDivElement>(null);

  const strength = getStrength(password);
  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit = password.length >= 8 && password === confirm && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);

    // TODO: wire Better Auth
    // await authClient.resetPassword({ newPassword: password });
    await new Promise((r) => setTimeout(r, 800)); // remove when wired

    setLoading(false);
    setDone(true);
  }

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <AuthLeftPanel>
        <div className="max-w-xs space-y-3 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-600/10">
            <LockIcon className="size-8 text-blue-400" />
          </div>
          <p className="text-lg font-semibold text-white">Set a new password</p>
          <p className="text-sm text-white/50 leading-relaxed">
            Choose something strong — at least 8 characters with a mix of letters, numbers, and
            symbols.
          </p>
        </div>
      </AuthLeftPanel>

      {/* ── Right panel ── */}
      <div
        ref={timelineRef}
        className="relative flex min-h-screen flex-col justify-center p-4 z-10"
      >
        {/* Blue glow — identical to all auth pages */}
        <div aria-hidden className="absolute inset-0 isolate contain-strict -z-10 opacity-60">
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(0,85,254,0.15)_0,rgba(0,85,254,0.05)_50%,transparent_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full blur-2xl" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,85,254,0.1)_0,rgba(0,85,254,0.02)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full blur-xl" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,85,254,0.1)_0,rgba(0,85,254,0.02)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full blur-xl" />
        </div>

        {/* Back button — only show before success */}
        {!done && (
          <Button
            variant="ghost"
            className="absolute top-7 left-5 border border-transparent text-white/75 hover:border-white/10 hover:bg-black/40 hover:text-white dark:hover:bg-black/40"
            asChild
          >
            <Link href="/auth/forgot-password">
              <ChevronLeftIcon className="size-4 me-2" />
              Back
            </Link>
          </Button>
        )}

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

          {!done ? (
            <>
              <TimelineAnimation
                animationNum={1}
                timelineRef={timelineRef}
                className="flex flex-col space-y-1"
              >
                <h1 className="font-heading text-2xl font-bold tracking-wide">
                  Reset your password
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter and confirm your new password below.
                </p>
              </TimelineAnimation>

              <TimelineAnimation animationNum={2} timelineRef={timelineRef}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs" htmlFor="password">
                      New password
                    </Label>
                    <PasswordInput
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={setPassword}
                    />
                    {password.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i <= strength.score ? strength.color : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        <p
                          className={`text-xs ${
                            strength.score <= 1
                              ? 'text-red-400'
                              : strength.score === 2
                                ? 'text-orange-400'
                                : strength.score === 3
                                  ? 'text-yellow-400'
                                  : 'text-green-400'
                          }`}
                        >
                          {strength.label} password
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs" htmlFor="confirm">
                      Confirm password
                    </Label>
                    <PasswordInput
                      id="confirm"
                      placeholder="••••••••"
                      value={confirm}
                      onChange={setConfirm}
                    />
                    {mismatch && <p className="text-xs text-red-400">Passwords don't match</p>}
                  </div>

                  {error && <p className="text-center text-xs text-red-400">{error}</p>}

                  <Button
                    type="submit"
                    disabled={!canSubmit}
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
                        Resetting...
                      </span>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>
              </TimelineAnimation>
            </>
          ) : (
            <TimelineAnimation
              animationNum={1}
              timelineRef={timelineRef}
              className="flex flex-col items-center space-y-4 py-4 text-center"
            >
              <div className="flex size-16 items-center justify-center rounded-2xl border border-green-500/20 bg-green-600/10">
                <CheckCircleIcon className="size-8 text-green-400" />
              </div>
              <div className="space-y-1">
                <h1 className="font-heading text-2xl font-bold tracking-wide">Password reset!</h1>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Your password has been updated. You can now log in with your new password.
                </p>
              </div>
              <Button
                className="w-full rounded-lg border border-white/10 bg-blue-600 font-semibold text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:bg-blue-500"
                asChild
              >
                <Link href="/auth">Go to Login</Link>
              </Button>
            </TimelineAnimation>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetSkeleton />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
