'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnalyzeResponse } from "@/app/page";

export function Candidates({map}:{map: AnalyzeResponse["languageFamilies"]}){
    const [isOpen, setIsOpen] = useState(true);
    if (!map || Object.keys(map).length===0) return null;
    
    return (
        <Card className="p-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm tracking-wide">Language Candidate Mapping (Gemini 2.5)</h3>
                <Button variant="outline" size="sm" onClick={() => setIsOpen(o => !o)}>
                    {isOpen ? "Minimize" : "Maximize"}
                </Button>
            </div>

            {isOpen && (
                <div className="mt-2">
                    {Object.entries(map).map(([family, arr])=> (
                        <div key={family} className="mb-3">
                        <div className="font-bold text-primary mb-1.5">{family}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {(arr || []).filter(Boolean).map((c, i)=> (
                            <Card key={i} className="p-2.5 border-primary">
                                <div className="font-bold">{c.form}</div>
                                <div className="font-code text-xs mt-1.5">map: {c.map ? c.map.join(" · ") : ''}</div>
                                <div className="text-xs mt-1.5 text-slate-700">{c.functional}</div>
                            </Card>
                            ))}
                        </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
