import Link from "next/link";
import { ENGINE_VERSION } from "../../lib/runAnalysis";

const ENGINE_PROFILE = "dev";
const ENGINE_COMMIT = "local";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-12 md:py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">About the Linguistic Decoder</h1>
          <p className="text-sm text-muted-foreground">
            Quick snapshot of the current Seven-Voices engine used in this preview build.
          </p>
        </header>

        <section className="rounded-2xl border border-border/60 bg-card/40 p-4 text-sm space-y-2">
          <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
            Engine snapshot
          </div>
          <div>
            <span className="font-semibold">Version:</span>{" "}
            <span className="font-mono">{ENGINE_VERSION}</span>
          </div>
          <div>
            <span className="font-semibold">Profile:</span>{" "}
            <span className="font-mono">{ENGINE_PROFILE}</span>{" "}
            <span className="text-muted-foreground">·</span>{" "}
            <span className="font-semibold">Commit:</span>{" "}
            <span className="font-mono">{ENGINE_COMMIT}</span>
          </div>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <p>
            This app is a language-first experimental interface for the Seven-Voices
            phonetic model. Results are deterministic for this engine version, but the
            math and interpretation layers are still evolving. Treat it as a research
            tool, not as a final etymology authority.
          </p>
        </section>

        <footer className="flex flex-wrap gap-4 text-sm">
          <Link href="/" className="underline underline-offset-2">
            ← Back to analyzer
          </Link>
          <Link
            href="https://github.com/sokolgora-sketch/linguistic-decoder"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            View GitHub repo
          </Link>
        </footer>
      </div>
    </main>
  );
}
