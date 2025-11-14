'use client';
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import p5 from 'p5';

type Vowel = "A"|"E"|"I"|"O"|"U"|"Y"|"Ë";
type ConsonantClass = "Plosive"|"Fricative"|"Affricate"|"Nasal"|"Liquid"|"Glide";

interface EngineConfig {
  word: string;
  voicePath: Vowel[];
  scanningMs: number;
  hopMs: number;
  showRain: boolean;
}

interface EngineResult {
    word: string;
    voicePath: string[];
}

export interface TwoRailsVizHandle {
  triggerAnalysis: (res: EngineResult) => void;
}

interface TwoRailsVizProps {
  initialWord: string;
  initialVoicePath: string[];
}

const TwoRailsViz = forwardRef<TwoRailsVizHandle, TwoRailsVizProps>(({ initialWord, initialVoicePath }, ref) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useImperativeHandle(ref, () => ({
    triggerAnalysis(res: EngineResult) {
      if (p5InstanceRef.current && (p5InstanceRef.current as any).injectEngineResult) {
        (p5InstanceRef.current as any).injectEngineResult(res);
      }
    },
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sketch = (p: p5) => {
      const ENGINE: EngineConfig = {
        word: initialWord || "study",
        voicePath: (initialVoicePath as Vowel[] | undefined) || ["U", "I"],
        scanningMs: 1400,
        hopMs: 900,
        showRain: true,
      };

      const VOICES: Vowel[] = ["A", "E", "I", "O", "U", "Y", "Ë"];
      const VOICE_COLOR: Record<Vowel, string> = { A:"#ef4444", E:"#f59e0b", I:"#eab308", O:"#10b981", U:"#3b82f6", Y:"#6366f1", "Ë":"#8b5cf6" };
      const CCATS: ConsonantClass[] = ["Plosive","Fricative","Affricate","Nasal","Liquid","Glide"];
      const CHAR_CLASS: Record<string, ConsonantClass> = {p:"Plosive",b:"Plosive",t:"Plosive",d:"Plosive",k:"Plosive",g:"Plosive",q:"Plosive",c:"Plosive",f:"Fricative",v:"Fricative",s:"Fricative",z:"Fricative",h:"Fricative",x:"Fricative",j:"Affricate",m:"Nasal",n:"Nasal",l:"Liquid",r:"Liquid",w:"Glide"};
      const VOWELS_SET = new Set(["a","e","i","o","u","y","ë"]);

      let W=880, H=280, leftX: number, rightX: number, topY: number, botY: number, railH: number, stepGap: number, midY: number, bandH: number;
      
      let phase = "idle";
      let scanT0 = 0;
      let hopIdx = 0;
      let token: {x:number, y:number} | null = null;
      let trail: {x:number, y:number}[] = [];
      const TRAIL_MAX = 120;
      let pulses: {klass: ConsonantClass, untilMs: number}[] = [];
      let consBuckets: {ch:string, klass:ConsonantClass}[][] = [];
      let scanBars = {y1:0,y2:0,t:0};
      const rainCols: {x:number, y:number, v:number}[] = [];
      const charset = "ｱｶｻﾀﾅﾊﾏﾔﾗﾜｦﾝABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

      function layout() {
        const container = sketchRef.current;
        if (!container) return;
        W = container.offsetWidth;
        H = Math.max(280, container.offsetHeight);
        p.createCanvas(W, H);
        p.textFont('monospace');
        p.textAlign(p.CENTER, p.CENTER);
        leftX = 160;
        rightX = W - 160;
        topY = 60;
        botY = H - 80;
        railH = botY - topY;
        stepGap = railH / (VOICES.length - 1);
        midY = (topY + botY) / 2;
        bandH = 52;
      }
      function yFor(v: Vowel) { return topY + VOICES.indexOf(v) * stepGap; }
      
      (p as any).injectEngineResult = (res: EngineResult) => {
          ENGINE.word = res.word || ENGINE.word;
          ENGINE.voicePath = (res.voicePath && res.voicePath.length ? res.voicePath : ENGINE.voicePath) as Vowel[];
          startScan();
      };

      function extractConsonants(word: string) {
        const raw = (word || "").normalize("NFC").toLowerCase().replace(/[^a-zë]/g, "");
        const out = [];
        for (let i = 0; i < raw.length; i++) {
          const ch = raw[i];
          if (VOWELS_SET.has(ch)) continue;
          out.push({ ch, klass: (CHAR_CLASS[ch] || "Fricative") });
        }
        return out;
      }

      function buildConsonantBuckets(word: string, hops: number) {
        const seq = extractConsonants(word);
        const buckets = Array.from({ length: hops }, () => []);
        if (seq.length === 0) return buckets;
        for (let i = 0; i < seq.length; i++) {
            if (buckets[i % hops]) {
                buckets[i % hops].push(seq[i]);
            }
        }
        return buckets;
      }

      function startScan() {
        phase = "scan";
        scanT0 = p.millis();
        hopIdx = 0;
        trail = [];
        pulses = [];
        consBuckets = buildConsonantBuckets(ENGINE.word, Math.max(1, ENGINE.voicePath.length - 1));
        if (ENGINE.voicePath.length > 0) token = { x: leftX, y: yFor(ENGINE.voicePath[0]) };
        rainCols.length = 0;
        if (ENGINE.showRain) {
          const colW = 14;
          const rows = Math.ceil(H / 18);
          for (let x = 0; x < W; x += colW) {
            rainCols.push({ x, y: -Math.floor(p.random(rows)), v: p.random(0.25, 0.6) });
          }
        }
      }

      function startHops() {
        phase = "hops";
        hopIdx = 0;
      }

      function drawRail(x: number) {
        p.stroke(31, 41, 55, 90); p.strokeWeight(2);
        p.line(x, topY - 6, x, botY + 6);
        for (const v of VOICES) {
          const y = yFor(v);
          p.noStroke(); p.fill(255); p.circle(x, y, 20);
          p.fill(VOICE_COLOR[v]); p.textSize(12); p.text(v, x + (x === leftX ? -24 : 24), y + 1);
        }
      }

      function drawConsonantStrip() {
        const segW = 96, gap = 10;
        const totalW = CCATS.length * segW + (CCATS.length - 1) * gap;
        const startX = (W - totalW) / 2;
        for (let i = 0; i < CCATS.length; i++) {
          const klass = CCATS[i];
          const x = startX + i * (segW + gap);
          const active = pulses.some(pulse => pulse.klass === klass && pulse.untilMs > p.millis());
          p.stroke(209, 213, 219, active ? 255 : 160); p.strokeWeight(1.5);
          p.fill(active ? p.color('#FFB300') : p.color(243, 244, 246, 210));
          p.rect(x, midY - bandH / 2, segW, bandH, 10, 10, 10, 10);
          p.noStroke(); p.fill(active ? 17 : 107); p.textSize(12);
          p.text(klass, x + segW / 2, midY);
          if (active) {
            p.noFill(); p.stroke('#FFB300'); p.strokeWeight(2);
            p.circle(x + segW / 2, midY, bandH + 10);
          }
        }
      }

      function drawScan() {
        if (ENGINE.showRain) {
          p.noStroke();
          for (const c of rainCols) {
            const headY = c.y * 18;
            const ch = charset.charAt(Math.floor(p.random(charset.length)));
            p.fill(190, 255, 220); p.textSize(14); p.text(ch, c.x, headY);
            for (let k = 1; k <= 10; k++) {
              const yy = headY - k * 18;
              if (yy < -18) continue;
              p.fill(0, 255, 112, 210 * (1 - k / 12)); p.text(ch, c.x, yy);
            }
            c.y += c.v;
            if (c.y * 18 > H + 18 && p.random() > 0.98) { c.y = -p.random() * H / 18; c.v = p.random(0.25, 0.6); }
          }
        }
        const t = (p.millis() - scanT0) / 1000;
        scanBars.y1 = topY + (Math.sin(t * 2.2) * 0.5 + 0.5) * railH;
        scanBars.y2 = topY + (Math.cos(t * 2.8) * 0.5 + 0.5) * railH;
        p.stroke('#FFB300'); p.strokeWeight(4);
        p.line(leftX - 20, scanBars.y1, leftX + 20, scanBars.y1);
        p.line(rightX - 20, scanBars.y2, rightX + 20, scanBars.y2);
        if (Math.abs(scanBars.y1 - scanBars.y2) < 10) {
          p.noFill(); p.stroke('#FFB300'); p.strokeWeight(2);
          p.circle((leftX + rightX) / 2, (scanBars.y1 + scanBars.y2) / 2, 18);
        }
      }

      function bezierStep(sx: number, sy: number, cx: number, cy: number, tx: number, ty: number, t: number) {
        const x12 = p.lerp(sx, cx, t), y12 = p.lerp(sy, cy, t);
        const x23 = p.lerp(cx, tx, t), y23 = p.lerp(cy, ty, t);
        return { x: p.lerp(x12, x23, t), y: p.lerp(y12, y23, t) };
      }

      function drawTrail() {
        if (trail.length < 2) return;
        p.noFill(); p.stroke('#FFB300'); p.strokeWeight(5); p.strokeJoin(p.ROUND); p.strokeCap(p.ROUND);
        p.beginShape(); for (const pt of trail) p.vertex(pt.x, pt.y); p.endShape();
      }
      
      function pulseConsonantsForHop(i: number, t: number) {
        const bucket = (consBuckets[i] || []);
        if (!bucket.length) return;
        for (let k = 0; k < bucket.length; k++) {
          const thresh = (k + 1) / (bucket.length + 1);
          if (Math.abs(t - thresh) < 0.02) {
            pulses.push({ klass: bucket[k].klass, untilMs: p.millis() + 350 });
          }
        }
      }

      p.setup = () => {
        layout();
        startScan(); // start with an initial animation
      };
      
      p.windowResized = () => {
          layout();
      }

      p.draw = () => {
        p.background('#0b0f0e');
        p.noStroke(); p.fill(230); p.textSize(16); p.text(ENGINE.word.toUpperCase(), W / 2, 24);

        drawRail(leftX);
        drawRail(rightX);
        drawConsonantStrip();

        if (phase === "scan") {
          drawScan();
          if (p.millis() - scanT0 >= ENGINE.scanningMs) startHops();
        }

        if (phase === "hops" || phase === "done") {
          drawTrail();
          if (token) {
            p.noStroke();
            const currVowel = ENGINE.voicePath[Math.min(hopIdx, ENGINE.voicePath.length - 1)] || "A";
            p.fill(VOICE_COLOR[currVowel] || '#3F51B5'); p.stroke(255, 180);
            p.circle(token.x, token.y, 18);
          }
        }
        
        if (ENGINE.voicePath && ENGINE.voicePath.length) {
            p.noStroke(); p.fill(178); p.textSize(12);
            p.text(ENGINE.voicePath.join(" → "), W / 2, H - 16);
        }

        if (phase === "hops") {
          if (!ENGINE.voicePath || ENGINE.voicePath.length < 2) { phase = "done"; return; }
          const from = ENGINE.voicePath[hopIdx], to = ENGINE.voicePath[hopIdx + 1];
          if (!from || !to) { phase = "done"; return; }

          const leftToRight = (hopIdx % 2 === 0);
          const sx = leftToRight ? leftX : rightX;
          const tx = leftToRight ? rightX : leftX;
          const sy = yFor(from), ty = yFor(to);
          const cx = (leftX + rightX) / 2;
          const bow = (ty < sy ? -1 : 1) * 50;
          const cy = (sy + ty) / 2 + bow;

          const tLocal = ((p.millis() - scanT0 - ENGINE.scanningMs) - hopIdx * ENGINE.hopMs) / ENGINE.hopMs;
          const t = p.constrain(tLocal, 0, 1);
          
          pulseConsonantsForHop(hopIdx, t);
          
          const pt = bezierStep(sx, sy, cx, cy, tx, ty, t);
          token = pt;
          trail.push({ x: pt.x, y: pt.y });
          if (trail.length > TRAIL_MAX) trail.shift();

          if (t >= 1) {
            hopIdx++;
            if (hopIdx >= ENGINE.voicePath.length - 1) {
              phase = "done";
            }
          }
        }
      };
    };

    if (sketchRef.current) {
      p5InstanceRef.current = new p5(sketch, sketchRef.current);
    }
    return () => {
      p5InstanceRef.current?.remove();
    };
  }, []); // Run only once

  return <div ref={sketchRef} className="w-full h-[280px] rounded-lg bg-[#0b0f0e]" />;
});

TwoRailsViz.displayName = "TwoRailsViz";
export { TwoRailsViz };