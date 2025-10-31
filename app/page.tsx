"use client";

import React, { useEffect, useMemo, useState } from "react";

type Answer = 1 | 2 | 3 | 4 | 5;
type Pillar = "Honesty" | "Attachment" | "Boundaries" | "Growth" | "Polarity";

type Q = {
  id: string;
  text: string;
  pillar: Pillar;
  hint?: string;
};

const QUESTIONS: Q[] = [
  {
    id: "q1",
    text: "If telling the truth might upset someone, I still prefer to tell it.",
    pillar: "Honesty",
    hint: "Truth over harmony",
  },
  {
    id: "q2",
    text: "When I feel ignored, I don’t chase — I let people come back to me.",
    pillar: "Attachment",
    hint: "Secure vs anxious",
  },
  {
    id: "q3",
    text: "I can say “no” without feeling guilty.",
    pillar: "Boundaries",
  },
  {
    id: "q4",
    text: "I work on myself (health, money, mindset, spirit) every month.",
    pillar: "Growth",
  },
  {
    id: "q5",
    text: "I like some masculine/feminine polarity in a relationship.",
    pillar: "Polarity",
    hint: "Chemistry preference",
  },
  {
    id: "q6",
    text: "I don’t keep secret convos or DMs from someone I’m dating.",
    pillar: "Honesty",
  },
  {
    id: "q7",
    text: "If there’s conflict, I’d rather talk it out than disappear.",
    pillar: "Attachment",
  },
  {
    id: "q8",
    text: "I can respect a partner’s time, work, and friendships.",
    pillar: "Boundaries",
  },
  {
    id: "q9",
    text: "I believe two people should grow together, not compete.",
    pillar: "Growth",
  },
  {
    id: "q10",
    text: "I’m attracted to a partner who leads OR lets me lead (not both confused).",
    pillar: "Polarity",
  },
  {
    id: "q11",
    text: "I don’t lie about kids, exes, money, or living situation.",
    pillar: "Honesty",
  },
  {
    id: "q12",
    text: "I don’t panic if someone takes a little longer to reply.",
    pillar: "Attachment",
  },
  {
    id: "q13",
    text: "I don’t let family or friends disrespect my relationship.",
    pillar: "Boundaries",
  },
  {
    id: "q14",
    text: "I study, pray, or learn things that make me a better partner.",
    pillar: "Growth",
  },
  {
    id: "q15",
    text: "I like when energy is clearly masculine/feminine, not roommate energy.",
    pillar: "Polarity",
  },
];

const PILLAR_COLORS: Record<Pillar, string> = {
  Honesty: "bg-emerald-500",
  Attachment: "bg-cyan-500",
  Boundaries: "bg-amber-500",
  Growth: "bg-lime-500",
  Polarity: "bg-pink-500",
};

function pct(n: number) {
  return Math.max(0, Math.min(100, Math.round(n * 100)));
}

export default function Page() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({});
  const [selfieFront, setSelfieFront] = useState<string | null>(null);
  const [selfieSide, setSelfieSide] = useState<string | null>(null);
  const [selfieQualityMsg, setSelfieQualityMsg] = useState("");

  const allAnswered = useMemo(
    () => QUESTIONS.every((q) => answers[q.id] !== undefined),
    [answers]
  );

  const pillarScores = useMemo(() => {
    const sums: Record<Pillar, number> = {
      Honesty: 0,
      Attachment: 0,
      Boundaries: 0,
      Growth: 0,
      Polarity: 0,
    };
    const counts: Record<Pillar, number> = {
      Honesty: 0,
      Attachment: 0,
      Boundaries: 0,
      Growth: 0,
      Polarity: 0,
    };
    for (const q of QUESTIONS) {
      const v = answers[q.id];
      if (v) {
        sums[q.pillar] += v;
        counts[q.pillar] += 1;
      }
    }
    const out: Record<Pillar, number> = { ...sums };
    (Object.keys(out) as Pillar[]).forEach((p) => {
      out[p] = counts[p] ? out[p] / (counts[p] * 5) : 0;
    });
    return out;
  }, [answers]);

  const trustRatio = useMemo(() => {
    let base = allAnswered ? 0.5 : 0.3;
    if (selfieFront) base += 0.2;
    if (selfieSide) base += 0.2;
    return Math.min(0.98, base);
  }, [allAnswered, selfieFront, selfieSide]);

  function setAnswer(qid: string, v: Answer) {
    setAnswers((prev) => ({ ...prev, [qid]: v }));
  }

  function onSelfie(e: React.ChangeEvent<HTMLInputElement>, which: "front" | "side") {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (which === "front") setSelfieFront(reader.result);
        else setSelfieSide(reader.result);
        if (f.size < 60_000) {
          setSelfieQualityMsg("📸 Too small / dark. Try again closer to your face with good light.");
        } else {
          setSelfieQualityMsg("✅ Good! Face looks clear enough for ratio scan.");
        }
      }
    };
    reader.readAsDataURL(f);
  }

  function copyShareLink() {
    const p = new URLSearchParams();
    if (name) p.set("u", name);
    for (const q of QUESTIONS) {
      const v = answers[q.id];
      if (v) p.set(q.id, String(v));
    }
    const url = `${window.location.origin}/?${p.toString()}`;
    navigator.clipboard.writeText(url).catch(() => {});
    alert("Share link copied.");
  }

  return (
    <main className="min-h-screen w-full bg-[#0b0f12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[42rem] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-fuchsia-500 via-lime-400 to-cyan-500" />
        <div className="absolute -bottom-40 right-1/2 translate-x-1/2 h-96 w-[42rem] rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-cyan-400 via-emerald-400 to-lime-300" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-10 space-y-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-lime-400 flex items-center justify-center font-black text-black">
              ❤
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SoulLink AI</h1>
              <p className="text-xs text-white/60 -mt-0.5">Built by AI. Bound by Love.</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a href="#quiz" className="px-3 py-2 text-sm rounded-xl bg-white/10 hover:bg-white/15">
              Psych Scan
            </a>
            <a href="#selfie" className="px-3 py-2 text-sm rounded-xl bg-white/10 hover:bg-white/15">
              Face Check
            </a>
            <a href="#couple" className="px-3 py-2 text-sm rounded-xl bg-white/10 hover:bg-white/15">
              Couple Mode
            </a>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Find your person. <span className="text-lime-300">Grow</span> together.
            </h2>
            <p className="mt-3 text-white/70 max-w-prose">
              We scan honesty, attachment, and polarity in 15 taps. Then we link two people with a private invite and a trust camera check.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#quiz" className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold hover:translate-y-0.5 transition">
                Start Scan
              </a>
              <button onClick={copyShareLink} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15">
                Get Shareable Link
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/70">Your Display Name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Julmer"
              className="mt-1 w-full rounded-xl bg-black/40 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-lime-400"
            />
            <p className="mt-3 text-xs text-white/50">
              Your name gets baked into the share link so your match can open the exact same scan.
            </p>
          </div>
        </section>

        <section id="quiz" className="space-y-5">
          <h3 className="text-2xl font-bold">Cam-B Cupid Scan (15)</h3>
          <p className="text-white/70 text-sm">Rate 1–5 (1 = strongly disagree, 5 = strongly agree).</p>
          <div className="grid gap-4">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className={`inline-block h-2 w-2 rounded-full ${PILLAR_COLORS[q.pillar]}`} />
                  <span className="uppercase tracking-wide text-white/60">{q.pillar}</span>
                  {q.hint ? <span className="text-xs text-white/40">• {q.hint}</span> : null}
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
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h4 className="font-semibold">Your Pillar Balance</h4>
            <div className="mt-4 space-y-3">
              {(Object.keys(pillarScores) as Pillar[]).map((p) => (
                <div key={p} className="flex items-center gap-3">
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${PILLAR_COLORS[p]}`}
                      style={{ width: `${pct(pillarScores[p])}%` }}
                    />
                  </div>
                  <span className="text-sm text-white/60 w-28">{p}</span>
                  <span className="text-sm text-white/80 tabular-nums">{pct(pillarScores[p])}%</span>
                </div>
              ))}
            </div>
          </div>
          <div id="selfie" className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h4 className="font-semibold">Mutual Photo Check</h4>
            <p className="text-white/70 text-sm mt-1">
              Upload one front selfie and one side/¾ selfie. We’ll use this later for ratio vibes.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <label className="block rounded-xl border border-dashed border-white/20 bg-black/20 p-3 text-center cursor-pointer hover:bg-black/10">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onSelfie(e, "front")} />
                {selfieFront ? (
                  <img src={selfieFront} alt="front" className="mx-auto max-h-32 rounded-lg object-cover" />
                ) : (
                  <span className="text-white/50 text-sm">Front selfie</span>
                )}
              </label>
              <label className="block rounded-xl border border-dashed border-white/20 bg-black/20 p-3 text-center cursor-pointer hover:bg-black/10">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onSelfie(e, "side")} />
                {selfieSide ? (
                  <img src={selfieSide} alt="side" className="mx-auto max-h-32 rounded-lg object-cover" />
                ) : (
                  <span className="text-white/50 text-sm">Side / ¾ selfie</span>
                )}
              </label>
            </div>
            {selfieQualityMsg && <p className="mt-3 text-xs text-amber-200">{selfieQualityMsg}</p>}
            <div className="mt-4">
              <p className="text-sm text-white/70 mb-1">Trust Ratio (demo)</p>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-lime-400"
                  style={{ width: `${pct(trustRatio)}%` }}
                />
              </div>
              <p className="text-xs text-white/50 mt-1">{pct(trustRatio)}% linked confidence</p>
            </div>
          </div>
        </section>

        <section id="couple" className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-xl font-semibold">Couple Mode (coming)</h3>
          <p className="text-sm text-white/60 mt-1">
            Share your scan with someone; when they open it, we compare your pillars and flag dealbreakers.
          </p>
        </section>

        <footer className="text-center text-xs text-white/30 py-4">
          © {new Date().getFullYear()} SoulLink AI — Built by AI. Bound by Love.
        </footer>
      </div>
    </main>
  );
}