cd ~/soulink-ai

cat > app/page.tsx <<'TSX'
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
    text: "Would you rather tell a painful truth or keep peace with a lie?",
    pillar: "Honesty",
    hint: "Truth-cost test",
  },
  {
    id: "q2",
    text: "When you feel misunderstood, what do you do first — explain, withdraw, or attack?",
    pillar: "Attachment",
    hint: "Conflict / nervous system pattern",
  },
  {
    id: "q3",
    text: "If someone you like goes quiet for a day, what feeling rises first?",
    pillar: "Attachment",
  },
  {
    id: "q4",
    text: "How comfortable are you saying “no” to people you care about?",
    pillar: "Boundaries",
  },
  {
    id: "q5",
    text: "When you’re proven wrong, how easy is it to admit it?",
    pillar: "Growth",
  },
  {
    id: "q6",
    text: "Have you ever hidden parts of your past because you feared judgment?",
    pillar: "Honesty",
  },
  {
    id: "q7",
    text: "Do you prefer strict 50/50 in money or for one partner to lead when needed?",
    pillar: "Polarity",
  },
  {
    id: "q8",
    text: "Do you ever use intimacy or withdrawal to get your way?",
    pillar: "Boundaries",
  },
  {
    id: "q9",
    text: "If your partner dances with someone else at a party, how secure do you feel?",
    pillar: "Attachment",
  },
  {
    id: "q10",
    text: "Are you the same person after 3 months as you were on day one?",
    pillar: "Growth",
  },
  {
    id: "q11",
    text: "Can you love someone who disagrees with your beliefs?",
    pillar: "Growth",
  },
  {
    id: "q12",
    text: "What did you learn from the last time you hurt someone?",
    pillar: "Growth",
  },
  {
    id: "q13",
    text: "Do you believe relationships should have a shared mission?",
    pillar: "Polarity",
  },
  {
    id: "q14",
    text: "Are you still healing from your last relationship?",
    pillar: "Attachment",
  },
  {
    id: "q15",
    text: "Is love a feeling, a choice, or a frequency to you?",
    pillar: "Honesty",
  },
];

const PILLAR_COLORS: Record<Pillar, string> = {
  Honesty: "bg-emerald-500",
  Attachment: "bg-sky-500",
  Boundaries: "bg-amber-500",
  Growth: "bg-fuchsia-500",
  Polarity: "bg-lime-500",
};

function pct(n: number) {
  return Math.max(0, Math.min(100, Math.round(n * 100)));
}

export default function Page() {
  const [name, setName] = useState("");
  const [energy, setEnergy] = useState<"feminine" | "masculine" | "balanced">("balanced");
  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({});
  const [selfieFront, setSelfieFront] = useState<string | null>(null);
  const [selfieSide, setSelfieSide] = useState<string | null>(null);
  const [selfieQualityMsg, setSelfieQualityMsg] = useState("");

  // load from URL
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const qName = p.get("u");
    if (qName) setName(qName);
    const loaded: Record<string, Answer> = {};
    for (const q of QUESTIONS) {
      const v = p.get(q.id);
      if (v) loaded[q.id] = Math.min(5, Math.max(1, Number(v))) as Answer;
    }
    setAnswers((prev) => ({ ...prev, ...loaded }));
  }, []);

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
        const pill = q.pillar;
        sums[pill] += v;
        counts[pill] += 1;
      }
    }
    const out: Record<Pillar, number> = {
      Honesty: 0,
      Attachment: 0,
      Boundaries: 0,
      Growth: 0,
      Polarity: 0,
    };
    (Object.keys(sums) as Pillar[]).forEach((p) => {
      out[p] = counts[p] ? sums[p] / (counts[p] * 5) : 0;
    });
    return out;
  }, [answers]);

  const trustRatio = useMemo(() => {
    const base = allAnswered ? 0.6 : 0.35;
    const selfieBoost = (selfieFront ? 0.15 : 0) + (selfieSide ? 0.15 : 0);
    return Math.min(0.98, base + selfieBoost);
  }, [allAnswered, selfieFront, selfieSide]);

  function onSelfie(
    e: React.ChangeEvent<HTMLInputElement>,
    which: "front" | "side"
  ) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (which === "front") setSelfieFront(reader.result);
        else setSelfieSide(reader.result);
        if (f.size < 50000) {
          setSelfieQualityMsg("📸 Too small/dark — retake in good light, close to face.");
        } else {
          setSelfieQualityMsg("✅ Good! Face is clear enough.");
        }
      }
    };
    reader.readAsDataURL(f);
  }

  function onShareLink() {
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

  function setAnswer(qid: string, val: Answer) {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  }

  return (
    <main className="min-h-screen w-full bg-[#0b0f12] text-white">
      {/* glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[42rem] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-fuchsia-500 via-lime-400 to-cyan-500" />
        <div className="absolute -bottom-40 right-1/2 translate-x-1/2 h-96 w-[42rem] rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-cyan-400 via-emerald-400 to-lime-300" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 space-y-10">
        {/* header */}
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
          <div className="hidden md:flex gap-2 text-sm">
            <a href="#quiz" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15">
              Cam-B Scan
            </a>
            <a href="#selfie" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15">
              Face / Ratio
            </a>
            <a href="#couple" className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15">
              Couple Mode
            </a>
          </div>
        </header>

        {/* hero */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Find your person. <span className="text-lime-300">Grow</span> together.
            </h2>
            <p className="mt-3 text-white/70">
              15 psychology-powered questions + 2 selfies = fast trust check. Then share
              link to match.
            </p>
            <div className="mt-5 flex gap-3 flex-wrap">
              <a
                href="#quiz"
                className="px-5 py-2 rounded-xl bg-lime-400 text-black font-semibold"
              >
                Start Cam-B Scan
              </a>
              <button
                onClick={onShareLink}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm"
              >
                Get Shareable Link
              </button>
            </div>
          </div>

          {/* settings */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
            <div>
              <label className="text-sm text-white/70">Your display name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Julmer"
                className="mt-1 w-full rounded-xl bg-black/40 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-lime-400"
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Your energy / vibe</label>
              <select
                value={energy}
                onChange={(e) => setEnergy(e.target.value as any)}
                className="mt-1 w-full rounded-xl bg-black/40 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-lime-400 text-sm"
              >
                <option value="balanced">Balanced</option>
                <option value="feminine">Feminine (receive / be led)</option>
                <option value="masculine">Masculine (lead / protect)</option>
              </select>
              <p className="text-xs text-white/40 mt-1">
                Later we add gender-specific tripwire qs here.
              </p>
            </div>
            <p className="text-xs text-white/50">
              {allAnswered
                ? "✅ Scan complete — selfie will boost trust ratio."
                : "⏳ Finish all 15 to unlock best matching."}
            </p>
          </div>
        </section>

        {/* quiz */}
        <section id="quiz" className="space-y-4">
          <h3 className="text-2xl font-bold">15-Question Cam-B Cupid Scan</h3>
          <p className="text-sm text-white/60">
            1–5 (1 = strongly disagree, 5 = strongly agree). We check honesty, attachment,
            boundaries, growth, polarity.
          </p>

          <div className="grid gap-4">
            {QUESTIONS.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/50">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      PILLAR_COLORS[q.pillar]
                    }`}
                  />
                  {q.pillar}
                </div>
                <div className="text-sm md:text-base">{q.text}</div>
                {q.hint ? <div className="text-xs text-white/40">{q.hint}</div> : null}
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAnswer(q.id, v as Answer)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition ${
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

          {/* pillar + selfie */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* pillar */}
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
                    <span className="w-20 text-sm text-white/60">{p}</span>
                    <span className="text-sm tabular-nums text-white/70">
                      {pct(pillarScores[p])}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* selfie */}
            <div
              id="selfie"
              className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3"
            >
              <h4 className="font-semibold">Mutual Photo Check</h4>
              <p className="text-xs text-white/60">
                1) Front, 2) 3/4 angle. Good light, no heavy filters.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="border border-dashed border-white/20 rounded-xl bg-black/20 h-32 flex flex-col items-center justify-center text-xs text-white/50 cursor-pointer hover:bg-black/10">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onSelfie(e, "front")}
                  />
                  {selfieFront ? "✅ Front added" : "Front selfie"}
                </label>
                <label className="border border-dashed border-white/20 rounded-xl bg-black/20 h-32 flex flex-col items-center justify-center text-xs text-white/50 cursor-pointer hover:bg-black/10">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onSelfie(e, "side")}
                  />
                  {selfieSide ? "✅ 3/4 added" : "3/4 / side selfie"}
                </label>
              </div>
              {selfieQualityMsg ? (
                <p className="text-xs mt-1 text-amber-200">{selfieQualityMsg}</p>
              ) : null}
              <div className="mt-2 flex items-center gap-2 text-sm">
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-lime-400 transition-all"
                    style={{ width: `${pct(trustRatio)}%` }}
                  />
                </div>
                <span className="text-xs text-white/60">
                  Trust Ratio: {pct(trustRatio)}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* couple */}
        <section id="couple" className="space-y-3">
          <h3 className="text-2xl font-bold">Couple Mode</h3>
          <p className="text-sm text-white/60">
            Share your link with someone, paste theirs here, we compare the 5 pillars and
            flag mismatches.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
              <label className="text-xs text-white/60">Partner invite code / URL</label>
              <input
                placeholder="paste from text / DM"
                className="w-full rounded-xl bg-black/40 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-lime-400 text-sm"
              />
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-lime-400 text-black text-sm font-semibold">
                  Link Profiles
                </button>
                <button
                  onClick={onShareLink}
                  className="px-4 py-2 rounded-xl bg-white/10 text-sm hover:bg-white/15"
                >
                  Generate My Link
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 space-y-1">
              <p>✔ Compare honesty + attachment</p>
              <p>✔ Flag jealousy / money mismatch</p>
              <p>✔ Suggest convo prompts</p>
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-xs text-white/40">
          © {new Date().getFullYear()} SoulLink AI — Built by AI. Bound by Love.
        </footer>
      </div>
    </main>
  );
}
