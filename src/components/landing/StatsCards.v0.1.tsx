import { LANDING_BASELINES_V0_1 } from "@/shared/landing/landingBaselines.v0.1";

function fmt3(x: number) {
  if (!Number.isFinite(x)) return "NaN";
  return x.toFixed(3);
}

function StatCard(props: {
  title: string;
  subtitle: string;
  lines: Array<{ k: string; v: string }>;
  foot: string;
  tone?: "ok" | "neutral";
}) {
  const toneCls =
    props.tone === "ok"
      ? "border-emerald-700/50"
      : "border-neutral-800";

  return (
    <div className={`rounded-xl border ${toneCls} bg-neutral-950/40 p-4`}>
      <div className="text-sm font-semibold text-neutral-100">{props.title}</div>
      <div className="mt-1 text-xs text-neutral-400">{props.subtitle}</div>
      <div className="mt-3 space-y-1 text-sm">
        {props.lines.map((l) => (
          <div key={l.k} className="flex items-baseline justify-between gap-3">
            <div className="text-neutral-400">{l.k}</div>
            <div className="font-mono text-neutral-100">{l.v}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-neutral-500">{props.foot}</div>
    </div>
  );
}

export function StatsCardsV0_1() {
  const tr = LANDING_BASELINES_V0_1.turkish_step20;
  const pw = LANDING_BASELINES_V0_1.pseudowords_step20;
  const sq = LANDING_BASELINES_V0_1.albanian_gegtosk_step10;

  const trS = tr.slope?.aperturePresenceMean;
  const pwS = pw.slope?.aperturePresenceMean;

  return (
    <section className="grid gap-3 lg:grid-cols-3">
      <StatCard
        title={tr.label}
        subtitle={tr.subtitle}
        tone="ok"
        lines={[
          { k: "Pearson r", v: trS ? fmt3(trS.pearson_r) : "—" },
          { k: "Spearman ρ", v: trS ? fmt3(trS.spearman_rho) : "—" },
          { k: "p_perm", v: trS ? fmt3(trS.p_perm) : "—" },
        ]}
        foot={`N=${tr.nTotal} (nPerBucket=${tr.nPerBucket})`}
      />

      <StatCard
        title={sq.label}
        subtitle={sq.subtitle}
        tone="ok"
        lines={[
          { k: "Bucket means", v: "committed" },
          { k: "Dialect pairing", v: "70 pairs" },
          { k: "Slope stats", v: "add next" },
        ]}
        foot={`N=${sq.nTotal} (paired; baseline-locked)`}
      />

      <StatCard
        title={pw.label}
        subtitle={pw.subtitle}
        tone="neutral"
        lines={[
          { k: "Pearson r", v: pwS ? fmt3(pwS.pearson_r) : "—" },
          { k: "Spearman ρ", v: pwS ? fmt3(pwS.spearman_rho) : "—" },
          { k: "p_perm", v: pwS ? fmt3(pwS.p_perm) : "—" },
        ]}
        foot={`N=${pw.nTotal} (control; should be weak/flat)`}
      />
    </section>
  );
}
