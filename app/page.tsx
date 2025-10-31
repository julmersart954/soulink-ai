"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#0b0b0b] to-[#101010] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Glowing background wave */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(0,255,150,0.3), transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Tagline */}
      <div className="z-10 text-center space-y-4 px-4">
        <motion.h1
          className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 via-emerald-300 to-teal-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Built by AI. Bound by Love.
        </motion.h1>
        <motion.p
          className="text-gray-300 text-lg max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          SoulLink AI helps two hearts align through truth, frequency, and chemistry —
          blending psychology, emotion, and data to form lasting connections.
        </motion.p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link
            href="/soulink-test"
            className="px-8 py-3 bg-lime-500 hover:bg-lime-400 text-black rounded-full shadow-lg shadow-lime-500/30 transition-all font-semibold"
          >
            Begin Your SoulLink
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 border border-lime-400 text-lime-300 rounded-full hover:bg-lime-900/30 transition-all font-semibold"
          >
            Learn How It Works
          </Link>
        </div>
      </div>

      {/* Frequency wave visual */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-lime-500/20 to-transparent"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
    </main>
  );
}
