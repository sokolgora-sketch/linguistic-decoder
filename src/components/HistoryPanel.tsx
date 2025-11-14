
'use client';

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useHistory, type HistoryItem } from "@/hooks/useHistory";

export function HistoryPanel() {
    const history = useHistory(50); // Fetch more items for a dedicated page

    return (
        <Card className="p-4">
            <div className="font-semibold text-lg mb-4">Analysis History</div>
            {history.length === 0 ? (
                <div className="text-sm text-slate-500 p-2">
                    No history yet. Run an analysis on the main page to see entries here.
                </div>
            ) : (
                <ul className="space-y-2 text-sm">
                    {history.map((h: HistoryItem) => (
                        <li key={h.id}>
                            <Link
                                href={`/?word=${encodeURIComponent(h.word)}&mode=${h.mode}&alphabet=${h.alphabet}`}
                                className="w-full text-left border rounded px-3 py-2 hover:bg-slate-50 flex items-center justify-between transition-colors"
                            >
                                <div>
                                    <span className="font-medium">{h.word}</span>
                                    <span className="text-slate-500 ml-2">· {h.mode} · {h.alphabet}</span>
                                </div>
                                <span className="text-xs text-slate-400">
                                    {h.createdAt?.toDate ? h.createdAt.toDate().toLocaleDateString() : ''}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}
