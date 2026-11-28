"use client";
import { useEffect, useState } from "react";

export default function CountUp({ value, duration = 900 }) {
  const [n, setN] = useState(value);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf, start;
    setN(0);
    const step = (t) => {
      start = start ?? t;
      const p = Math.min((t - start) / duration, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const done = setTimeout(() => setN(value), duration + 300);
    return () => { cancelAnimationFrame(raf); clearTimeout(done); };
  }, [value, duration]);

  return <>{n.toLocaleString("en-US")}</>;
}
