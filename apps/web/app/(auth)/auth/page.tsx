"use client";

import React from "react";
import { AtSignIcon, ChevronLeftIcon, Grid2x2PlusIcon } from "lucide-react";
import { FloatingPaths } from "./_components/FloatingPaths";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons } from "./_components/OAuthButtons";
import Link from "next/link";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function AuthContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "login";
  const isSignUp = type === "signup";

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="bg-muted/60 relative hidden h-full flex-col border-r border-white/6 p-10 lg:flex z-10 overflow-hidden">
        <div className="bg-[radial-gradient(ellipse_at_top_left,rgba(0,85,254,0.15)_0,transparent_70%)] absolute inset-0 z-0" />
        <div className="from-background absolute inset-0 z-10 bg-linear-to-t to-transparent" />
        <div className="z-10 flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Deszyn"
            width={26}
            height={26}
            loading="eager"
            priority
            className="rounded-md group-hover:scale-105 transition-transform duration-300 w-auto h-auto"
          />
          <p className="text-xl font-semibold text-white">Deszyn</p>
        </div>
        <div className="z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl text-white/90">
              &ldquo;The code took me 2 days, but design usually takes 3. This
              platform eliminates the entire design bottleneck for me.&rdquo;
            </p>
            <footer className="font-mono text-sm font-semibold text-white/70">
              ~ Senior Developer
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>
      <div className="relative flex min-h-screen flex-col justify-center p-4 z-10">
        <div
          aria-hidden
          className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
        >
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(0,85,254,0.15)_0,rgba(0,85,254,0.05)_50%,transparent_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full blur-2xl" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,85,254,0.1)_0,rgba(0,85,254,0.02)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full blur-xl" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,85,254,0.1)_0,rgba(0,85,254,0.02)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full blur-xl" />
        </div>
        <Button variant="ghost" className="absolute top-7 left-5" asChild>
          <Link href="/">
            <ChevronLeftIcon className="size-4 me-2" />
            Home
          </Link>
        </Button>
        <div className="mx-auto space-y-4 sm:w-sm">
          <div className="flex items-center gap-2 lg:hidden">
            <Image
              src="/logo.png"
              alt="Deszyn"
              width={24}
              height={24}
              loading="eager"
              priority
              className="rounded-md group-hover:scale-105 transition-transform duration-300 w-auto h-auto"
            />
            <p className="text-lg font-semibold text-white">Deszyn</p>
          </div>
          <div className="flex flex-col space-y-1">
            <h1 className="font-heading text-2xl font-bold tracking-wide">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignUp
                ? "Sign up to start designing with AI."
                : "Log in to your account."}
            </p>
          </div>
          <div className="space-y-2">
            <OAuthButtons />
          </div>

          <AuthSeparator />

          <form className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label
                  className="text-muted-foreground text-xs"
                  htmlFor="username"
                >
                  Username
                </Label>
                <div className="relative h-max">
                  <Input
                    id="username"
                    placeholder="Username"
                    className="peer ps-9"
                    type="text"
                  />
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <AtSignIcon className="size-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs" htmlFor="email">
                Email
              </Label>
              <div className="relative h-max">
                <Input
                  id="email"
                  placeholder="your.email@example.com"
                  className="peer ps-9"
                  type="email"
                />
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <AtSignIcon className="size-4" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                className="text-muted-foreground text-xs"
                htmlFor="password"
              >
                Password
              </Label>
              <div className="relative h-max">
                <Input
                  id="password"
                  placeholder="••••••••"
                  className="peer ps-9"
                  type="password"
                />
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>
            </div>

            <Button
              type="button"
              className="w-full rounded border border-white/10 bg-blue-600 font-semibold text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:bg-blue-500 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)]"
            >
              <span>{isSignUp ? "Sign Up" : "Log In"}</span>
            </Button>
          </form>

          <div className="mt-6 pt-4 text-center text-sm">
            {isSignUp ? (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="?type=login"
                  className="text-blue-500 hover:text-blue-400 font-semibold underline underline-offset-4 transition-colors"
                >
                  Login
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="?type=signup"
                  className="text-blue-500 hover:text-blue-400 font-semibold underline underline-offset-4 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            )}
          </div>

          <p className="text-muted-foreground mt-8 text-xs text-center border-t border-white/10 pt-4">
            By clicking continue, you agree to our{" "}
            <a
              href="#"
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}

const AuthSeparator = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-border h-px w-full" />
      <span className="text-muted-foreground px-2 text-xs">OR</span>
      <div className="bg-border h-px w-full" />
    </div>
  );
};
