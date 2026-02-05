"use client";

import { useEffect, useState } from "react";

interface VerseListProps {
    verses: string[];
    bookAbbrev: string;
    chapter: number;
}

export function VerseList({ verses, bookAbbrev, chapter }: VerseListProps) {
    const [highlights, setHighlights] = useState<Set<number>>(new Set());

    // Load highlights from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem(`highlights-${bookAbbrev}-${chapter}`);
        if (saved) {
            setHighlights(new Set(JSON.parse(saved)));
        }
    }, [bookAbbrev, chapter]);

    const toggleHighlight = (index: number) => {
        const newHighlights = new Set(highlights);
        if (newHighlights.has(index)) {
            newHighlights.delete(index);
        } else {
            newHighlights.add(index);
        }
        setHighlights(newHighlights);
        localStorage.setItem(
            `highlights-${bookAbbrev}-${chapter}`,
            JSON.stringify(Array.from(newHighlights))
        );
    };

    return (
        <div className="space-y-4">
            {verses.map((text, index) => {
                const isHighlighted = highlights.has(index);
                return (
                    <div
                        key={index}
                        onClick={() => toggleHighlight(index)}
                        className={`flex gap-4 group cursor-pointer p-2 rounded-lg transition-colors ${isHighlighted
                                ? "bg-yellow-100/50 dark:bg-yellow-900/30"
                                : "hover:bg-stone-100 dark:hover:bg-stone-900"
                            }`}
                    >
                        <span className="text-stone-400 dark:text-stone-500 text-sm w-8 pt-1.5 font-mono text-right select-none transition-colors">
                            {index + 1}
                        </span>
                        <p
                            className={`bible-text text-lg md:text-xl leading-8 text-stone-800 dark:text-stone-200 flex-1 ${isHighlighted ? "underline decoration-yellow-400/50 decoration-2" : ""
                                }`}
                        >
                            {text}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
