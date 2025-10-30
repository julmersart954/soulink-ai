/* LoveLink AI — Built by AI. Bound by Love.  */
import React, { useState, useMemo } from "react";

export default function LoveLinkTest() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const QUESTIONS = [
    { id: "honesty", text: "I tell the truth even when it’s inconvenient." },
    { id: "growth", text: "I actively work on improving myself each month." },
    { id: "empathy", text: "I listen to understand before I respond." },
    { id: "boundaries", text: "I communicate my needs without guilt." },
    { id: "stability", text: "I remain calm under stress." },
  ];

  const score = useMemo(() => {
    const vals = Object.values(answers);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / (vals.length * 5) : 0;
  }, [answers]);

  return (
    <main className="min-h-screen bg-[#0b0f12] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-lime-300 tracking-tight">
          LoveLink AI
        </h1>
        <p className="text-white/70 mb-8">Built by AI. Bound by Love.</p>

        <label className="block mb-6">
          <span className="text-sm text-white/70">Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl bg-black/40 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-lime-400"
            placeholder="Type your name"
          />
        </label>

        <div className="space-y-5">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="font-medium mb-2">{q.text}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAnswers((p) => ({ ...p, [q.id]: v }))}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      answers[q.id] === v
                        ? "bg-lime-400 text-black border-lime-300"
                        : "bg-black/30 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="text-sm text-white/60 mb-1">Compatibility Readiness</div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-lime-400 transition-all"
              style={{ width: `${Math.round(score * 100)}%` }}
            />
          </div>
          <div className="text-white/70 text-xs mt-2">{Math.round(score * 100)} %</div>
        </div>

        <footer className="mt-12 text-center text-white/50 text-sm border-t border-white/10 pt-6">
          © {new Date().getFullYear()} LoveLink AI — Built by AI. Bound by Love.
        </footer>
      </div>
    </main>
  );
}
