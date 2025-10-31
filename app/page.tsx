"use client";

import React, { useEffect, useMemo, useState } from "react";

type Answer = 1 | 2 | 3 | 4 | 5;
type Q = {
  id: string;
  text: string;
  pillar: "Honesty" | "Stability" | "Empathy" | "Boundaries" | "Growth";
};

const QUESTIONS: Q[] = [
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

const PILLAR_COLORS: Record<Q["pillar"], string> = {
  Honesty: "bg-emerald-500",
  Stability: "bg-indigo-500",
  Empathy: "bg-rose-500",
  Boundaries: "bg-amber-500",
  Growth: "bg-lime-500",
};

function percent(n: number) {
  return Math.max(0, Math.min(100, Math.round(n * 100)));
}

function Gauge({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-lime-400 transition-all"
          style={{ width: `${percent(value)}%` }}
        />
      </div>
      <span className="text-sm tabular-nums text-white/80 w-14 text-right">
        {percent(value)}%
      </span>
      <span className="text-sm text-white/60">{label}</span>
    </div>
  );
}

export default function Home() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({});
  const [selfieA, setSelfieA] = useState<string | null>(null);
  const [selfieB, setSelfieB] = useState<string | null>(null);
  const [partnerCode, setPartnerCode] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  // restore from URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const u = p.get("u");
    if (u) setName(u);
    const loaded: Record<string, Answer> = {};
    for (const q of QUESTIONS) {
      const v = p.get(q.id);
      if (v) loaded[q.id] = Math.min(5, Math.max(1, Number(v))) as Answer;
    }
    if (Object.keys(loaded).length) {
      setAnswers((prev) => ({ ...prev, ...loaded }));
    }
  }, []);

  const allAnswered = useMemo(
    () => QUESTIONS.every((q) => answers[q.id] !== undefined),
    [answers]
  );

  const pillarAverages = useMemo(() => {
    const sums: Record<Q["pillar"], number> = {
      Honesty: 0,
      Stability: 0,
      Empathy: 0,
      Boundaries: 0,
      Growth: 0,
    };
    const counts: Record<Q["pillar"], number> = {
      Honesty: 0,
      Stability: 0,
      Empathy: 0,
      Boundaries: 0,
      Growth: 0,
    };
    for (const q of QUESTIONS) {
      const v = answers[q.id];
      if (v) {
        sums[q.pillar] += v;
        counts[q.pillar] += 1;
      }
    }
    const out: Record<Q["pillar"], number> = {
      Honesty: 0,
      Stability: 0,
      Empathy: 0,
      Boundaries: 0,
      Growth: 0,
    };
    (Object.keys(sums) as Q["pillar"][]).forEach((key) => {
      out[key] = counts[key] ? sums[key] / (counts[key] * 5) : 0;
    });
    return out;
  }, [answers]);

  const trustRatioDemo = useMemo(() => {
    const base = allAnswered ? 0.6 : 0.35;
    const boost = (selfieA ? 0.15 : 0) + (selfieB ? 0.15 : 0);
    return Math.min(0.98, base + boost);
  }, [allAnswered, selfieA, selfieB]);

  function setAnswer(qid: string, v: Answer) {
    setAnswers((prev) => ({ ...prev, [qid]: v }));
  }

  function onShareLink() {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams();
    if (name) p.set("u", name);
    for (const q of QUESTIONS) {
      const v = answers[q.id];
      if (v) p.set(q.id, String(v));
    }
    const url = `${window.location.origin}/?${p.toString()}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setGeneratedLink(url);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>, which: "A" | "B") {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        which === "A" ? setSelfieA(reader.result) : setSelfieB(reader.result);
      }
    };
    reader.readAsDataURL(f);
  }

  return (
    <main className="min-h-screen w-full bg-[#0b0f12] text-white relative overflow-x-hidden">
      {/* glow backdrop */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[42rem] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-fuchsia-500 via-lime-400 to-cyan-500" />
        <div className="absolute -bottom-40 right-1/2 translate-x-1/2 h-96 w-[42rem] rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-cyan-400 via-emerald-400 to-lime-300" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-10 space-y-12">
        {/* header */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-lime-400 flex items-center justify-center font-black text-black">
              ❤
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SoulLink AI</h1>
              <p className="text-xs text-white/60 -mt-0.5">Built by AI. Bound by Love.</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-2 text-sm">
            <a href="#quiz" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15">Psych Quiz</a>
            <a href="#trust" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15">Trust Ratio</a>
            <a href="#couple" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15">Couple Mode</a>
          </nav>
        </header>

        {/* hero */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Find your person. <span className="text-lime-300">Grow</span> together.
            </h2>
            <p className="mt-3 text-white/70 max-w-prose">
              We scan honesty, empathy, and boundaries in 10 quick taps. Then we link two people with a private invite and a trust camera check.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#quiz" className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold hover:translate-y-0.5 transition">
                Start Quiz
              </a>
              <button onClick={onShareLink} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15">
                Get Shareable Link
              </button>
            </div>
            {generatedLink ? (
              <p className="mt-3 text-xs text-white/60 break-all">
                Copied: <span className="text-lime-300">{generatedLink}</span>
              </p>
            ) : null}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/70">Your Display Name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Julmer"
              className="mt-1 w-full rounded-xl bg-black/40 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-lime-400"
            />
            <div className="mt-5 text-sm text-white/70">Quick actions</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <button className="rounded-xl bg-white/10 py-2 hover:bg-white/15">Import from Link</button>
              <button className="rounded-xl bg-white/10 py-2 hover:bg-white/15">Continue as Guest</button>
            </div>
          </div>
        </section>

        {/* quiz */}
        <section id="quiz" className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold">10-Question Psychology Scan</h3>
            <p className="text-white/70 text-sm">Rate 1–5 (1 = strongly disagree, 5 = strongly agree).</p>
          </div>

          <div className="grid gap-4">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className={`inline-block h-2 w-2 rounded-full ${PILLAR_COLORS[q.pillar]}`} />
                  <span className="uppercase tracking-wide text-white/60">{q.pillar}</span>
                </div>
                <div className="mt-1 font-medium">{q.text}</div>
                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAnswer(q.id, v as Answer)}
                      className={`px-3 py-2 rounded-lg border text-sm transition ${
                        answers[q.id] === v
                          ? "bg-lime-400 text-black border-lime-300"
                          : "bg-black/40 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h4 className="font-semibold">Your Pillar Balance</h4>
              <div className="mt-4 grid gap-3">
                {Object.entries(pillarAverages).map(([k, v]) => (
                  <Gauge key={k} value={v} label={k} />
                ))}
              </div>
            </div>

            <div id="trust" className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h4 className="font-semibold">Mutual Photo Check (demo trust ratio)</h4>
              <p className="text-white/70 text-sm mt-1">
                Upload two selfies. In real app we do on-device checks before saving.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-white/60">Your selfie</div>
                  <label className="mt-1 block rounded-xl border border-dashed border-white/20 bg-black/30 p-3 text-center cursor-pointer hover:bg-black/20">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e, "A")} />
                    {selfieA ? (
                      <img src={selfieA} alt="selfie A" className="mx-auto max-h-40 rounded-lg object-cover" />
                    ) : (
                      <span className="text-white/50">Click to upload</span>
                    )}
                  </label>
                </div>
                <div>
                  <div className="text-xs text-white/60">Partner selfie</div>
                  <label className="mt-1 block rounded-xl border border-dashed border-white/20 bg-black/30 p-3 text-center cursor-pointer hover:bg-black/20">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e, "B")} />
                    {selfieB ? (
                      <img src={selfieB} alt="selfie B" className="mx-auto max-h-40 rounded-lg object-cover" />
                    ) : (
                      <span className="text-white/50">Click to upload</span>
                    )}
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <Gauge value={trustRatioDemo} label="Trust Ratio (demo)" />
              </div>
            </div>
          </div>
        </section>

        {/* couple mode */}
        <section id="couple" className="space-y-4">
          <h3 className="text-2xl font-bold">Couple Mode</h3>
          <p className="text-white/70 text-sm">
            Share your quiz link, then paste your partner’s link to link profiles.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-white/70">Partner invite code / URL</div>
              <input
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value)}
                placeholder="Paste URL here"
                className="mt-1 w-full rounded-xl bg-black/40 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-lime-400"
              />
              <div className="mt-3 flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold">Link Profiles</button>
                <button onClick={onShareLink} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15">
                  Generate My Invite Link
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="font-semibold">What happens next?</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-white/70 space-y-1">
                <li>We compare the 5 pillars.</li>
                <li>We flag big mismatches.</li>
                <li>You unlock a couple dashboard.</li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="pt-6 pb-10 text-center text-sm text-white/60 border-t border-white/10 mt-10">
          © {new Date().getFullYear()} SoulLink AI — Built by AI. Bound by Love.
        </footer>
      </div>

      {/* floating shortcut */}
      <a
        href="#quiz"
        className="fixed right-4 bottom-4 rounded-full bg-lime-400 text-black text-sm px-4 py-2 shadow-lg shadow-lime-400/50 hover:scale-[1.02] transition"
      >
        💗 AI Match Assist
      </a>
    </main>
  );
}
