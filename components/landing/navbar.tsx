"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { KineticNavigation } from "@/components/ui/kinetic-navigation";

const navLinks = [
  { label: "Features",     href: "#features"     },
  { label: "How It Works",  href: "#how-it-works"  },
  { label: "Pricing",      href: "#pricing"       },
  { label: "Reviews",      href: "#reviews"       },
  { label: "FAQ",          href: "#faq"           },
  { label: "Contact",      href: "#contact"       },
];

export function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring" as const, damping: 30, stiffness: 200, delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0d0d0f]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/40"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Deszyn"
              width={22}
              height={22}
              className="rounded-md group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-display font-bold text-base tracking-tight text-white">
              Deszyn
            </span>
          </Link>

          {/* Desktop nav pill */}
          <div
            className="hidden md:flex items-center px-1.5 py-1.5 gap-0.5"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-1.5 text-sm text-white/50 hover:text-white/90 transition-colors duration-200 font-medium whitespace-nowrap"
                style={{ borderRadius: "8px" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            href="/signup"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            style={{
              backgroundColor: "rgb(0, 85, 254)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "10px",
              boxShadow: "0 8px 40px 0 rgba(0, 85, 255, 0.5), 0 0 10px 1px rgba(255, 255, 255, 0) inset, 0 0 0 1px rgba(0, 85, 255, 0.12)",
            }}
          >
            Get Started Free
          </Link>
        </nav>
      </motion.header>

      {/* KineticNavigation owns the mobile toggle button */}
      <KineticNavigation
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onToggle={() => setMobileOpen((v) => !v)}
      />
    </>
  );
}