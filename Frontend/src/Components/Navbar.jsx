import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../Context/userContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null)
  const { session, loading } = useUser()

  useEffect(() => {
    if (loading) {
      setUser(null);
    } else {
      setUser(user)
    }
  }, [loading])

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
            <Link to={'/login'}>Get Started</Link>
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
            <Link to={'/login'} className="block w-full text-center">Get Started</Link>
          </button>
        </div>
      )}
    </nav>
  );
}



// const getInfo = ()=>{
//   return {
//     name:"EazyStem",
//     description:"EazyStem is an AI-powered platform that simplifies the process of building and deploying machine learning models. With EazyStem, you can easily create, train, and deploy your models without needing extensive coding knowledge. Our intuitive interface and powerful tools make it easy for anyone to harness the power of AI and bring their ideas to life."
//   }
// }


// const  useInfo = ({name, description}) => {
//       return <div>{name}{des} </div>
//   }

// useInfo({name: "EazyStem", description: "EazyStem he power of AI and bring their ideas to life."})

// <useInfo name="" desc=""/>
// <useInfo name="" desc=""/>