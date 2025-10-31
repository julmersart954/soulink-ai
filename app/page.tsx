"use client";

import React, { useState } from "react";

type Answer = 1 | 2 | 3 | 4 | 5;
const PILLARS = ["Honesty", "Stability", "Empathy", "Boundaries", "Growth"] as const;
type Pillar = (typeof PILLARS)[number];

const QUESTIONS: Array<{ id: string; text: string; pillar: Pillar }> = [
  { id: "q1", text: "I tell the truth even when it’s inconvenient.", pillar: "Honesty" },
  { id: "q2", text: "My moods are steady and I self-regulate under stress.", pillar: "Stability" },
  { id: "q3", text: "I listen to understand before I respond.", pillar: "Empathy" },
  { id: "q4", text: "I communicate my needs without guilt.", pillar: "Boundaries" },
  { id: "q5", text: "I actively work on improving myself each month.", pillar: "Growth" },
  { id: "q6", text: "I avoid white lies in dating (no catfishing).", pillar: "Honesty" },
  { id: "q7", text: "I put the phone down during quality time.", pillar: "Stability" },
  { id: "q8", text: "I can validate someone’s feelings even if I disagree.", pillar: "Empathy" },
  { id: "q9", text: "I respect a partner’s time and space.", pillar: "Boundaries" },
  { id: "q10", text: "I like shared goals and progress as a team.", pillar: "Growth" },
];

export default function Home() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [selfieFront, setSelfieFront] = useState<File | null>(null);
  const [selfieSide, setSelfieSide] = useState<File | null>(null);

  // calc pillar %
  const pillarScores = PILLARS.reduce<Record<Pillar, number>>((acc, p) => {
    const rel = QUESTIONS.filter((q) => q.pillar === p);
    if (!rel.length) {
      acc[p] = 0;
      return acc;
    }
    const sum = rel.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
    acc[p] = Math.round((sum / (rel.length * 5)) * 100);
    return acc;
  }, {} as any);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* top bar */}
      <header className="border-b border-lime-500/20 bg-black/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-pink-400 text-lg">♥</span>
            <span className="font-semibold tracking-tight">SoulLink AI</span>
          </div>
          <div className="flex gap-2 text-sm">
            <button className="px-3 py-1 rounded-full bg-lime-500 text-black font-medium">
              Start Quiz
            </button>
            <button className="px-3 py-1 rounded-full border border-lime-500/40 text-lime-200">
              Couple Mode
            </button>
          </div>
        </div>
      </header>

      {/* page content */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* hero */}
        <section className="bg-gradient-to-r from-lime-500/10 via-emerald-500/5 to-transparent border border-lime-500/10 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wide text-lime-300/70 mb-1">
            Built by AI. Bound by Love.
          </p>
          <h1 className="text-3xl font-bold mb-2">Find your person. Grow together.</h1>
          <p className="text-sm text-white/70 max-w-2xl">
            We scan honesty, empathy, and boundaries in 10 quick taps. Then we link two people with
            a private invite and a trust camera check.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="bg-lime-400 text-black px-4 py-2 rounded-full text-sm font-semibold">
              Begin your SoulLink
            </button>
            <button className="border border-lime-200/40 px-4 py-2 rounded-full text-sm text-lime-100">
              How it works
            </button>
          </div>
        </section>

        {/* quiz */}
        <section className="bg-white/5 rounded-2xl p-5 border border-white/5">
          <h2 className="text-xl font-semibold mb-1">10-Question Psychology Scan</h2>
          <p className="text-sm text-white/60 mb-4">
            Rate 1–5 (1 = strongly disagree, 5 = strongly agree).
          </p>

          <div className="space-y-4">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="bg-black/20 rounded-xl p-3">
                <p className="text-lime-200 text-xs uppercase tracking-wide">{q.pillar}</p>
                <p className="text-sm mt-1">{q.text}</p>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [q.id]: v as Answer,
                        }))
                      }
                      className={`w-9 h-9 rounded-lg text-sm border transition ${
                        answers[q.id] === v
                          ? "bg-lime-400 text-black border-lime-200"
                          : "bg-black/40 border-white/5 hover:bg-white/5"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* pillar display */}
          <div className="mt-5">
            <h3 className="text-sm font-semibold mb-2">Your Pillar Balance</h3>
            <div className="space-y-2">
              {PILLARS.map((p) => (
                <div key={p}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{p}</span>
                    <span>{pillarScores[p]}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-lime-400"
                      style={{ width: `${pillarScores[p]}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* selfies */}
        <section className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <h2 className="text-sm font-semibold mb-2">Selfie — Front</h2>
            <p className="text-xs text-white/60 mb-3">
              Good light. Face centered. No hat. This will NOT be saved in demo.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelfieFront(e.target.files?.[0] ?? null)}
              className="text-xs"
            />
            {selfieFront && (
              <p className="text-xs text-lime-200 mt-2">✅ {selfieFront.name} ready</p>
            )}
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <h2 className="text-sm font-semibold mb-2">Selfie — Side</h2>
            <p className="text-xs text-white/60 mb-3">
              Turn 45°. We check nose, jaw, forehead line to detect catfish/photoshop.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelfieSide(e.target.files?.[0] ?? null)}
              className="text-xs"
            />
            {selfieSide && <p className="text-xs text-lime-200 mt-2">✅ {selfieSide.name} ready</p>}
          </div>
        </section>

        {/* couple mode */}
        <section className="bg-white/5 rounded-2xl p-5 border border-white/5">
          <h2 className="text-lg font-semibold mb-2">Couple Mode</h2>
          <p className="text-sm text-white/60 mb-4">
            Share your quiz link, then paste your partner’s link to compare pillar scores.
          </p>
          <div className="flex flex-col gap-2">
            <input
              placeholder="Partner invite code / URL"
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <button className="bg-lime-400 text-black rounded-lg px-4 py-2 text-sm">
                Link Profiles
              </button>
              <button className="border border-lime-300/60 text-lime-100 rounded-lg px-4 py-2 text-sm">
                Generate My Invite Link
              </button>
            </div>
          </div>
          <ul className="text-xs text-white/50 mt-3 space-y-1">
            <li>• We compare the 5 pillars.</li>
            <li>• We flag big mismatches.</li>
            <li>• You unlock a couple dashboard.</li>
          </ul>
        </section>

        <footer className="py-4 text-center text-xs text-white/40">
          © {new Date().getFullYear()} SoulLink AI — Built by AI. Bound by Love.
        </footer>
      </div>
    </main>
  );
}
