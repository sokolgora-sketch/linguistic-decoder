"use client";
import * as React from "react";

export type DigitalRainProps = {
  className?: string;
  color?: string;
  headColor?: string;
  backgroundTint?: string;
  fontSize?: number;
  trail?: number;
  speedMin?: number;
  speedMax?: number;
  charset?: string;
  fpsCap?: number;
  glow?: boolean;
  paused?: boolean;
};

export default function DigitalRain({
  className,
  color = "#00ff70",
  headColor = "#aaffc8",
  backgroundTint = "rgba(0,0,0,0.22)",
  fontSize = 16,
  trail = 18,
  speedMin = 8,
  speedMax = 22,
  charset = "ｱｶｻﾀﾅﾊﾏﾔﾗﾜｦﾝABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  fpsCap = 45,
  glow = true,
  paused = false,
}: DigitalRainProps) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const raf = React.useRef<number | null>(null);

  React.useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const resize = () => {
      const w = canvas.offsetWidth || 600;
      const h = canvas.offsetHeight || 300;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    type Drop = { y: number; v: number };
    let cols = Math.max(4, Math.floor((canvas.width / dpr) / (fontSize * 0.9)));
    let rows = Math.max(10, Math.floor((canvas.height / dpr) / (fontSize * 1.15)));
    let drops: Drop[] = new Array(cols).fill(0).map(() => ({
      y: -Math.random() * rows,
      v: speedMin + Math.random() * (speedMax - speedMin),
    }));
    const resetCols = () => {
      cols = Math.max(4, Math.floor((canvas.width / dpr) / (fontSize * 0.9)));
      rows = Math.max(10, Math.floor((canvas.height / dpr) / (fontSize * 1.15)));
      drops = new Array(cols).fill(0).map(() => ({
        y: -Math.random() * rows,
        v: speedMin + Math.random() * (speedMax - speedMin),
      }));
    };

    let prevW = canvas.width, prevH = canvas.height;
    const frameInterval = 1000 / fpsCap;
    let last = performance.now();
    let acc = 0;
    const chars = charset.split("");

    const rgba = (hex: string, a: number) => {
      if (!hex.startsWith("#")) return hex;
      const h = hex.slice(1);
      const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
      return `rgba(${r},${g},${b},${a})`;
    };

    const tick = (now: number) => {
      raf.current = requestAnimationFrame(tick);
      const dt = now - last; last = now; acc += dt;
      if (acc < frameInterval) return;
      const step = acc / 1000; acc = 0;

      if (prevW !== canvas.width || prevH !== canvas.height) { prevW = canvas.width; prevH = canvas.height; resetCols(); }

      const W = canvas.width / dpr, H = canvas.height / dpr;
      const colW = fontSize * 0.9, rowH = fontSize * 1.15;

      ctx.fillStyle = backgroundTint; ctx.fillRect(0, 0, W, H);
      ctx.font = `${fontSize}px monospace`; ctx.textBaseline = "top";

      for (let i=0;i<cols;i++){
        const x = i*colW; const d = drops[i];
        if (!paused) d.y += d.v * step;

        const headY = Math.floor(d.y) * rowH;
        if (headY > -rowH && headY < H + rowH) {
          const ch = chars[(Math.random()*chars.length)|0];
          if (glow) { ctx.fillStyle = headColor; ctx.fillText(ch, x, headY); }
          ctx.fillStyle = headColor; ctx.fillText(ch, x, headY);
        }
        for (let k=1;k<=trail;k++){
          const ty = Math.floor(d.y - k) * rowH;
          if (ty < -rowH || ty > H + rowH) continue;
          const ch = chars[(Math.random()*chars.length)|0];
          const a = Math.max(0, 1 - k/(trail+2));
          ctx.fillStyle = rgba(color, a * 0.9);
          ctx.fillText(ch, x, ty);
        }
        if (d.y * rowH > H + rowH && Math.random() > 0.975) {
          d.y = -Math.random()*rows*0.5;
          d.v = speedMin + Math.random()*(speedMax-speedMin);
        }
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); ro.disconnect(); };
  }, [color, headColor, backgroundTint, fontSize, trail, speedMin, speedMax, charset, fpsCap, glow, paused]);

  return <canvas ref={ref} className={className} />;
}
