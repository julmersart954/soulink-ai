"use client";

import React, { useState, useMemo } from "react";

export default function LoveLinkTest() {
  const [name, setName] = useState("");
  return (
    <div style={{ padding: 24 }}>
      <h1>LoveLink Test</h1>
      <p>Type your name:</p>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ background: "#111", color: "#fff", padding: "6px 10px", borderRadius: 6 }}
      />
      <p style={{ marginTop: 10 }}>Hello {name || "beautiful soul"} 💞</p>
    </div>
  );
}
