import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// Body font

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// Code/mono font

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Display/heading font

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Deszyn — AI Design Platform for Developers",
    template: "%s | Deszyn",
  },
  description:
    "From idea to shipped product — generate startup names, logos, and production-ready React design systems using AI. No design skills needed.",
  keywords: [
    "AI design tool",
    "React component generator",
    "design system generator",
    "CSS variables generator",
    "UI generator for developers",
    "Figma alternative",
    "startup name generator",
    "logo generator",
  ],
  authors: [{ name: "Deszyn" }],
  creator: "Deszyn",
  metadataBase: new URL("https://deszyn.io"), // need to update when domain is ready

  // Open Graph — controls how link looks when shared on LinkedIn, Twitter etc.

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://deszyn.io",
    siteName: "Deszyn",
    title: "Deszyn — AI Design Platform for Developers",
    description:
      "From idea to shipped product — generate startup names, logos, and production-ready React design systems using AI. No design skills needed.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Deszyn — AI Design Platform for Developers",
      },
    ],
  },

  // Twitter/X card

  twitter: {
    card: "summary_large_image",
    title: "Deszyn — AI Design Platform for Developers",
    description:
      "From idea to shipped product — generate startup names, logos, and production-ready React design systems using AI. No design skills needed.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  // Prevents search engines from indexing /dashboard pages
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${plusJakartaSans.variable}
          font-sans
          antialiased
          bg-background
          text-foreground
          min-h-screen
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="bottom-center" theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
