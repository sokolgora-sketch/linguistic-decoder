// src/components/WordMatrix.tsx
"use client";

import type { AnalysisResult_DEPRECATED, Candidate } from "@/shared/engineShape";
import type { SymbolicCoreResult } from "@/lib/symbolicCore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { getVoiceMeta } from "@/shared/sevenVoices";
import { Sparkles } from "lucide-react";

const InfoPair = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
    </div>
);

function SevenVoicesSnapshot({ analysis }: { analysis: AnalysisResult_DEPRECATED }) {
    if (!analysis.sevenVoices) return null;

    const { principlesPath, dominant } = analysis.sevenVoices;

    return (
        <Card className="bg-background/50">
            <CardHeader className="p-4">
                <CardTitle className="text-base">Seven-Voices Core</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2 text-sm">
                <InfoPair label="Dominant Principle(s)" value={dominant.join(', ')} />
                <InfoPair label="Principle Path" value={principlesPath.join(' → ')} />
            </CardContent>
        </Card>
    );
}

function SymbolicLayer({ symbolicCore }: { symbolicCore?: SymbolicCoreResult }) {
    if (!symbolicCore) return null;

    const { genderFlow, functionalTriplet, protocolRules } = symbolicCore;
    const notes = protocolRules?.filter(r => r.startsWith("RULE:") || r.startsWith("MUTATION:")) || [];

    return (
        <Card className="bg-background/50">
            <CardHeader className="p-4">
                <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent-foreground" />
                    <span>Symbolic Layer</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3 text-sm">
                {genderFlow && (
                    <InfoPair label="Gender Flow" value={`${genderFlow.direction} (${genderFlow.polarities.join(', ')})`} />
                )}
                {functionalTriplet && (
                    <InfoPair label="Functional Triplet" value={functionalTriplet.statement ?? "No statement."} />
                )}
                 {notes.length > 0 && (
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Protocol Notes</p>
                        <ul className="list-disc pl-4 space-y-0.5 text-xs text-muted-foreground">
                            {notes.map((note, idx) => (
                                <li key={idx}>{note.replace(/RULE: |MUTATION:/g, '')}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function WordMatrix({ analysis }: { analysis: AnalysisResult_DEPRECATED }) {
    if (!analysis?.core) return null;

    const { core, candidates, consonants } = analysis;
    const primary = core.voices;
    const dominantArchetypes = consonants?.summary.dominantArchetypes.join(', ') || 'N/A';

    return (
        <Card className="border-accent/50">
            <CardHeader>
                <CardTitle>Word Matrix (Protocol View)</CardTitle>
                <CardDescription>A summary of the full analysis protocol for '{core.word}'.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* (A) Header Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm p-3 rounded-lg bg-muted/50">
                    <InfoPair label="Word" value={core.word} />
                    <InfoPair label="Alphabet/Mode" value={`${core.input.alphabet} / ${core.input.mode}`} />
                    <InfoPair label="7-vowel path" value={primary.vowelVoices.join(' → ')} />
                    <InfoPair label="Ring Path" value={primary.ringPath.join(' → ')} />
                </div>

                {/* (C) Morphology Table */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Morphology & Candidates</h4>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Language</TableHead>
                                    <TableHead>Morphology</TableHead>
                                    <TableHead>Functional Statement</TableHead>
                                    <TableHead>Consonants</TableHead>
                                    <TableHead>Verdict</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {candidates && candidates.map((c: Candidate) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">
                                            {c.language}
                                            {c.family && c.family !== c.language && ` (${c.family})`}
                                            {core.input.dialectGuess && c.language.toLowerCase() === 'albanian' && <Badge variant="outline" className="ml-2">{core.input.dialectGuess}</Badge>}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            <div className="font-semibold">{c.morphologyMatrix?.pivot}</div>
                                            <div className="text-muted-foreground">{c.decomposition.parts.map(p => p.form).join(' · ')}</div>
                                        </TableCell>
                                        <TableCell className="text-xs max-w-xs">{c.decomposition.functionalStatement}</TableCell>
                                        <TableCell className="text-xs">
                                            {c.consonantProfileOk ? '✅' : '❓'} {c.consonantProfile}
                                            <div className="text-muted-foreground/80 truncate">[{dominantArchetypes}]</div>
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {c.status === 'pass' ? <Badge>Pass</Badge> : <Badge variant="secondary">{c.status}</Badge>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* (B) & (D) Snapshots */}
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <SevenVoicesSnapshot analysis={analysis} />
                    <SymbolicLayer symbolicCore={analysis.symbolicCore} />
                </div>

            </CardContent>
        </Card>
    );
}
