"use client";

import React, { useState } from "react";

export default function SoulLinkTestPage() {
  const [mood, setMood] = useState("open");

  return (
    <div style={{ padding: 24 }}>
      <h1>SoulLink AI — Test Screen</h1>
      <p>Current mood: {mood}</p>
      <button onClick={() => setMood("aligned")}>
        Align
      </button>
    </div>
  );
}
