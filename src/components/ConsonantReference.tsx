
'use client';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Vowel } from "@/lib/solver/types";

const VOICE_COLOR: Record<Vowel, string> = {
    A: "var(--voice-A)", E: "var(--voice-E)", I: "var(--voice-I)",
    O: "var(--voice-O)", U: "var(--voice-U)", Y: "var(--voice-Y)", "Ë": "var(--voice-EH)"
};

type ConsonantClassInfo = {
    class: string;
    examples: string;
    preferredDeltaRing: string;
    voiceAlign: Vowel;
};

const referenceData: ConsonantClassInfo[] = [
    { class: "Plosive", examples: "p, b, t, d, k, g, q, c", preferredDeltaRing: "2–3", voiceAlign: "A" },
    { class: "Affricate", examples: "ch, j, dz, ts, dʒ, tʃ", preferredDeltaRing: "1–2", voiceAlign: "I" },
    { class: "Sibilant Fricative", examples: "s, z, sh, zh, x", preferredDeltaRing: "1–2", voiceAlign: "Y" },
    { class: "Non-sibilant Fricative", examples: "f, v, h, th, ph", preferredDeltaRing: "1", voiceAlign: "E" },
    { class: "Nasal", examples: "m, n", preferredDeltaRing: "0–1", voiceAlign: "Ë" },
    { class: "Liquid", examples: "l, r", preferredDeltaRing: "0–1", voiceAlign: "O" },
    { class: "Glide", examples: "w, y", preferredDeltaRing: "0–1", voiceAlign: "U" },
];

export function ConsonantReference() {
    return (
        <Card className="p-4">
            <p className="text-sm text-slate-600 mb-4">
                The consonant(s) between vowels influence the consonant checksum (<span className="font-code">C</span>). Hops that align with the consonant’s preferred ring distance change (<code className="font-code">|Δring|</code>) have a lower cost.
            </p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Class</TableHead>
                        <TableHead>Examples</TableHead>
                        <TableHead>Preferred |Δring|</TableHead>
                        <TableHead>Voice Align</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {referenceData.map((row) => (
                        <TableRow key={row.class}>
                            <TableCell className="font-medium">{row.class}</TableCell>
                            <TableCell className="font-code text-slate-500">{row.examples}</TableCell>
                            <TableCell className="font-code">{row.preferredDeltaRing}</TableCell>
                            <TableCell>
                                <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full border bg-white">
                                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: VOICE_COLOR[row.voiceAlign] }} />
                                    <span className="font-bold">{row.voiceAlign}</span>
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
