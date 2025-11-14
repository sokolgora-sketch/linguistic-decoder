"use client";
import * as React from "react";

type Props = {
  word: string;
  show: boolean;            // mount/animate when true
  onDone?: () => void;      // called when filled
  fontSize?: number;        // mask font (px)
};

export default function WordRevealRain({ word, show, onDone, fontSize = 84 }: Props) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const raf = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!show) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const resize = () => {
      const w = canvas.offsetWidth || 600;
      const h = canvas.offsetHeight || 260;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setupState();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // state for rain + fill grid
    let cols = 0, rows = 0, colW = 14, rowH = 18;
    let drops: { y: number; v: number }[] = [];
    let inside: boolean[][] = [];
    let targets: number[][] = [];  // per col: bottom-up row indexes to fill
    let filled: (string | null)[][] = [];
    let nextIdx: number[] = [];
    const charset = "ｱｶｻﾀﾅﾊﾏﾔﾗﾜｦﾝABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const setupState = () => {
      const W = canvas.width / dpr, H = canvas.height / dpr;
      colW = 14; rowH = 18;
      cols = Math.max(10, Math.floor(W / colW));
      rows = Math.max(10, Math.floor(H / rowH));

      // build text mask
      const m = document.createElement("canvas");
      m.width = Math.floor(W * dpr); m.height = Math.floor(H * dpr);
      const mx = m.getContext("2d")!;
      mx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mx.clearRect(0,0,W,H);
      mx.fillStyle = "#fff";
      mx.textBaseline = "middle";
      mx.textAlign = "center";
      mx.font = `bold ${fontSize}px monospace`;
      mx.fillText(word.toUpperCase(), W/2, H/2);
      const mask = mx.getImageData(0,0,W,H).data;

      const sample = (x:number,y:number) => (x < 0 || y < 0 || x >= W || y >= H) ? 0 : mask[( (y|0)*W*4 + (x|0)*4 ) + 3];

      inside = Array.from({length: cols}, () => Array(rows).fill(false));
      for (let c=0;c<cols;c++){
        for (let r=0;r<rows;r++){
          const cx = c*colW + colW/2;
          const cy = r*rowH + rowH/2;
          inside[c][r] = sample(cx, cy) > 24;
        }
      }

      targets = inside.map(col => {
        const rs:number[] = [];
        for (let r=rows-1;r>=0;r--) if (col[r]) rs.push(r);
        return rs;
      });

      filled = Array.from({length: cols}, ()=> Array<string|null>(rows).fill(null));
      nextIdx = Array.from({length: cols}, ()=> 0);

      drops = Array.from({length: cols}, () => ({
        y: -Math.random()*rows*0.8,
        v: 0.15 + Math.random()*0.22,
      }));
    };

    resize();

    // animate
    let doneCalled = false;
    const background = "#0b0f0e";
    const trail = "rgba(0,255,112,";
    const head = "rgba(190,255,220,1)";
    const textFill = "rgba(235,255,245,1)";

    const tick = () => {
      raf.current = requestAnimationFrame(tick);
      const W = canvas.width / dpr, H = canvas.height / dpr;

      // BG fade for trails
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(0,0,W,H);

      // draw persisted filled glyphs (the word being constructed)
      ctx.font = "16px monospace";
      ctx.textBaseline = "top";
      for (let c=0;c<cols;c++){
        for (let r=0;r<rows;r++){
          const ch = filled[c][r];
          if (!ch) continue;
          const x = c*colW, y = r*rowH;
          ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillText(ch, x+1, y+1);
          ctx.fillStyle = textFill;           ctx.fillText(ch, x, y);
        }
      }

      // draw rain + stick when crossing next target row
      for (let c=0;c<cols;c++){
        const d = drops[c];
        const headY = Math.floor(d.y) * rowH;
        // head
        ctx.fillStyle = head; ctx.fillText(charset[(Math.random()*charset.length)|0], c*colW, headY);
        // trail
        for (let k=1;k<=14;k++){
          const yy = headY - k*rowH;
          if (yy < -rowH || yy > H + rowH) continue;
          ctx.fillStyle = `${trail}${Math.max(0, 0.9*(1 - k/16))})`;
          ctx.fillText(charset[(Math.random()*charset.length)|0], c*colW, yy);
        }

        // stick logic bottom-up
        const ni = nextIdx[c];
        if (ni < targets[c].length) {
          const targetRow = targets[c][ni];
          const targetY = targetRow * rowH;
          if ((d.y - d.v) * rowH < targetY && d.y * rowH >= targetY) {
            if (!filled[c][targetRow]) {
              filled[c][targetRow] = charset[(Math.random()*charset.length)|0];
              nextIdx[c] = ni + 1;
              d.y = targetRow - 3; // jump back a bit to see more drops
            }
          }
        }

        d.y += d.v;
        if (d.y * rowH > H + rowH && Math.random() > 0.98) {
          d.y = -Math.random()*rows*0.6;
          d.v = 0.15 + Math.random()*0.22;
        }
      }

      const totalTargets = targets.reduce((a,b)=>a+b.length,0);
      const filledCount = filled.flat().filter(Boolean).length;
      if (!doneCalled && filledCount >= totalTargets && totalTargets > 0) {
        doneCalled = true;
        onDone?.();
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); ro.disconnect(); };
  }, [show, word, fontSize, onDone]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0"
      style={{ opacity: show ? 1 : 0, transition: "opacity 300ms ease" }}
    />
  );
}
