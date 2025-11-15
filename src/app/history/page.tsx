
'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import HistoryPanel from "@/components/HistoryPanel"; // Updated component
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeEnginePayload, type EnginePayload } from "@/shared/engineShape";
import { analyzeClient } from "@/lib/analyzeClient";
import { useToast } from "@/hooks/use-toast";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Candidates } from "@/components/Candidates";
import { Card } from "@/components/ui/card";

export default function HistoryPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<EnginePayload | null>(null);

    async function handleLoadAnalysis(cacheId: string) {
        if (!cacheId) return;
        setLoading(true);
        setAnalysisResult(null);
        try {
            const cacheRef = doc(db, "analyses", cacheId);
            const snap = await getDoc(cacheRef);
            if (snap.exists()) {
                const normalized = normalizeEnginePayload(snap.data());
                setAnalysisResult({ ...normalized, cacheHit: true, recomputed: false });
                toast({ title: "Loaded from Cache", description: `Analysis for '${normalized.word}' loaded.` });
            } else {
                toast({ variant: "destructive", title: "Not Found", description: "Could not find that analysis in the cache." });
            }
        } catch (e: any) {
            toast({ variant: "destructive", title: "Load Error", description: e.message || "Failed to load analysis." });
        } finally {
            setLoading(false);
        }
    }
    
    async function handleRecompute(word: string, mode: 'strict' | 'open', alphabet: string) {
        setLoading(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeClient(word, mode, alphabet as any, { bypass: true });
            setAnalysisResult(result);
            toast({ title: "Recomputed", description: `Fresh analysis for '${result.word}' complete.` });
        } catch (e: any) {
            toast({ variant: "destructive", title: "Recompute Error", description: e.message || "Failed to recompute analysis." });
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
            <header className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Decoder
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold text-primary">History</h1>
            </header>
            
            <main className="space-y-6">
                <HistoryPanel onLoadAnalysis={handleLoadAnalysis} onRecompute={handleRecompute} />

                {loading && (
                    <Card className="p-6 flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <span>Loading analysis...</span>
                    </Card>
                )}

                {analysisResult && (
                    <div className="space-y-4">
                         <h2 className="text-xl font-semibold text-primary/90">Loaded Analysis: <span className="font-bold text-foreground">{analysisResult.word}</span></h2>
                         <ResultsDisplay analysis={analysisResult} />
                         <Candidates items={analysisResult.languageFamilies} />
                    </div>
                )}
            </main>
        </div>
    );
}