export default function Hero() {
  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center px-6 text-center overflow-hidden"
      style={{ backgroundColor: "var(--bg-main)" }}
    >
      {/* Radial Glow Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(59,130,246,0.18), transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Powered Badge */}
        <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full border text-sm"
             style={{
               borderColor: "rgba(59,130,246,0.3)",
               background: "rgba(59,130,246,0.08)",
               color: "var(--primary)"
             }}>
          Powered by Manim Engine
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
          Bring Mathematics to Life
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, var(--primary), var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            with Manim AI
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mt-6 text-lg md:text-xl max-w-2xl mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Describe any mathematical concept or physical phenomenon,
          and watch AI generate professional-grade animations in seconds.
        </p>

        {/* Input + CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Describe a concept (e.g., How a Fourier Transform works)"
            className="w-full px-5 py-4 rounded-xl outline-none border backdrop-blur-md"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "rgba(255,255,255,0.08)",
              color: "var(--text-primary)",
            }}
          />

          <button
            className="px-6 py-4 rounded-xl font-medium text-white transition hover:opacity-90 whitespace-nowrap"
            style={{
              background:
                "linear-gradient(90deg, var(--primary), var(--accent))",
              boxShadow: "0 0 40px rgba(59,130,246,0.35)",
            }}
          >
            Visualize ⚡
          </button>
        </div>

        {/* Suggestion Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Taylor Series", "Binary Search Trees", "Quantum Tunneling", "Fluid Dynamics"].map((item) => (
            <span
              key={item}
              className="px-4 py-2 text-sm rounded-full border cursor-pointer transition hover:bg-white/5"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                color: "var(--text-secondary)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
