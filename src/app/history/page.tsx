
'use client';

import Link from "next/link";
import { HistoryPanel } from "@/components/HistoryPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function HistoryPage() {
    return (
        <div className="max-w-4xl mx-auto p-4 lg:p-8">
            <header className="mb-6 flex items-center gap-4">
                <Button asChild variant="outline" size="sm">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Decoder
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold text-primary">History</h1>
            </header>
            <main>
                <HistoryPanel />
            </main>
        </div>
    );
}
