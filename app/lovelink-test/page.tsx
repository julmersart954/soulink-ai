"use client";
import React, { useState, useMemo } from "react";

export default function LoveLinkTest() {
  const [name, setName] = useState("");
  return <div>Hello {name}</div>;
}
