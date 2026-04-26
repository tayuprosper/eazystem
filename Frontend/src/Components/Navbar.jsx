import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../Context/userContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { session, loading } = useUser()
  const [navLinks, setNavLinks] = useState([
    { name: "Features", path: "#features" },
    { name: "Pricing", path: "#pricing" },
    { name: "Docs", path: "#docs" }
  ]);

  // check if user is logged in when page loads so navbar adjusts automatically
  useEffect(() => {
    if (loading) return;

    if (session?.user) {
      // User is logged in, ensure Dashboard link exists
      if (!navLinks.some(link => link.name === "Dashboard")) {
        setNavLinks(prev => [...prev, { name: "Dashboard", path: "/workspace" }]);
      }
    } else {
      // User is logged out, ensure Dashboard link is removed
      setNavLinks(prev => prev.filter(link => link.name !== "Dashboard"));
    }
  }, [loading, session])


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
            <Link to="/">EazyStem</Link>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{ color: "var(--text-secondary)" }}
              className="hover:text-white transition"
            >
              {link.name}
            </Link>
          ))}

          {/* CTA */}
          {!session?.user ? (
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
              style={{
                background:
                  "linear-gradient(90deg, var(--primary), var(--accent))",
              }}
            >
              <Link to={'/login'}>Get Started</Link>
            </button>
          ) : (
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
              style={{
                background:
                  "linear-gradient(90deg, var(--primary), var(--accent))",
              }}
            >
              <Link to={'/workspace'}>Go to Workspace</Link>
            </button>
          )}
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
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="block"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setOpen(false)}
            >
              {link.name}
            </a>
          ))}

          {!session?.user ? (
            <button
              className="w-full px-4 py-3 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
              style={{
                background:
                  "linear-gradient(90deg, var(--primary), var(--accent))",
              }}
            >
              <Link to={'/login'} className="block w-full text-center" onClick={() => setOpen(false)}>Get Started</Link>
            </button>
          ) : (
            <button
              className="w-full px-4 py-3 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
              style={{
                background:
                  "linear-gradient(90deg, var(--primary), var(--accent))",
              }}
            >
              <Link to={'/workspace'} className="block w-full text-center" onClick={() => setOpen(false)}>Go to Workspace</Link>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}