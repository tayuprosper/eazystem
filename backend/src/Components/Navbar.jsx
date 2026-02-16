import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md"
      style={{
        backgroundColor: "rgba(11,18,32,0.7)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="text-lg font-semibold tracking-tight">
          <span
            style={{
              background: "linear-gradient(90deg, var(--primary), var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ManimAI
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a
            href="#features"
            style={{ color: "var(--text-secondary)" }}
            className="hover:text-white transition"
          >
            Features
          </a>
          <a
            href="#pricing"
            style={{ color: "var(--text-secondary)" }}
            className="hover:text-white transition"
          >
            Pricing
          </a>
          <a
            href="#docs"
            style={{ color: "var(--text-secondary)" }}
            className="hover:text-white transition"
          >
            Docs
          </a>

          {/* CTA */}
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
            style={{
              background:
                "linear-gradient(90deg, var(--primary), var(--accent))",
            }}
          >
            Get Started
          </button>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex items-center justify-center w-10 h-10"
        >
          <div className="space-y-1.5">
            <span className="block w-6 h-[2px] bg-white"></span>
            <span className="block w-6 h-[2px] bg-white"></span>
            <span className="block w-6 h-[2px] bg-white"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="md:hidden px-6 py-6 space-y-6"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <a
            href="#features"
            className="block"
            style={{ color: "var(--text-secondary)" }}
          >
            Features
          </a>
          <a
            href="#pricing"
            className="block"
            style={{ color: "var(--text-secondary)" }}
          >
            Pricing
          </a>
          <a
            href="#docs"
            className="block"
            style={{ color: "var(--text-secondary)" }}
          >
            Docs
          </a>

          <button
            className="w-full px-4 py-3 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
            style={{
              background:
                "linear-gradient(90deg, var(--primary), var(--accent))",
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
