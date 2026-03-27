import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-20 text-foreground">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 rounded-3xl border border-border bg-card/70 px-8 py-12 text-center shadow-lg backdrop-blur sm:px-12">
        <Image
          src="/logo.png"
          alt="Deszyn logo"
          width={192}
          height={128}
          priority
          className="h-auto w-40 sm:w-48"
        />

        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Deszyn
          </p>
          <h1 className="font-[var(--font-jakarta)] text-4xl font-extrabold tracking-tight sm:text-6xl">
            AI design tools built for developers shipping fast
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Generate startup names, logos, landing pages, and production-ready
            UI systems from one workspace without bouncing between tools.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="mailto:hello@deszyn.io"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Contact Deszyn
          </a>
          <a
            href="https://deszyn.io"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Visit deszyn.io
          </a>
        </div>
      </section>
    </main>
  );
}
