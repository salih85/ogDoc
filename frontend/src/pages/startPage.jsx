import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const navigate = useNavigate();

  // 🌗 Same theme logic as HomeFeed
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div
      className="
        min-h-screen transition-colors duration-500 relative overflow-hidden
        bg-slate-50 text-slate-900
        dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#1e293b] dark:to-black dark:text-slate-300
      "
    >
      {/* Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none hidden dark:block" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none hidden dark:block" />

      {/* 🌗 Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="
          fixed top-6 right-6 z-50
          text-slate-700 dark:text-yellow-400
          hover:scale-110 active:scale-95
          transition-transform duration-200
        "
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* 🧊 HERO CAPSULE */}
      <section className="relative z-10 h-screen flex items-center justify-center px-4">
        <div
          className="
            w-full max-w-5xl rounded-[3rem] border
            bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl
            border-slate-200 dark:border-white/10
            shadow-xl dark:shadow-[0_0_60px_rgba(79,70,229,0.25)]
            px-8 sm:px-14 py-24 text-center
          "
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-white">
            Welcome to{" "}
            <span
              className="
                font-serif text-transparent bg-clip-text
                bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600
                dark:from-indigo-400 dark:via-blue-400 dark:to-purple-400
              "
            >
              Blogify
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed
            text-slate-600 dark:text-slate-400">
            A modern space to write, explore ideas, and share your journey.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="
              inline-flex items-center justify-center
              px-12 py-4 rounded-full
              text-white font-semibold text-lg
              bg-indigo-600 hover:bg-indigo-500
              transition-all duration-300
              shadow-lg hover:shadow-indigo-500/40
              hover:scale-105 active:scale-95
            "
          >
            Start Writing ✍️
          </button>
        </div>
      </section>
    </div>
  );
}
