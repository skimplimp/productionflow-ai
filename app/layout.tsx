import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProductionFlow — AI Workflow Intelligence",
  description: "Know when your AI stack is falling behind — and exactly what to replace it with.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen`}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Nav() {
  return (
    <header className="border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
          <span className="text-[var(--primary)] text-lg">⚡</span>
          <span>ProductionFlow</span>
          <span className="text-xs text-[var(--muted)] border border-[var(--card-border)] px-1.5 py-0.5 rounded">beta</span>
        </a>
        <nav className="flex items-center gap-1 text-sm">
          <a href="/audit"         className="px-3 py-1.5 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors">AI Audit</a>
          <a href="/stack-builder" className="px-3 py-1.5 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors">Stack Builder</a>
          <a href="/blueprints"    className="px-3 py-1.5 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors">Blueprints</a>
          <a href="https://hookflow.ai" target="_blank" rel="noopener noreferrer"
            className="ml-2 px-3 py-1.5 rounded-md border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--primary)] transition-colors text-xs">
            HookFlow →
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] mt-24 py-10 text-center text-sm text-[var(--muted)]">
      <p>
        ProductionFlow is a product of{" "}
        <a href="https://hookflow.ai" className="text-[var(--primary)] hover:underline">HookFlow.ai</a>
        {" "}— AI tool discovery powered by heat scores.
      </p>
    </footer>
  );
}
