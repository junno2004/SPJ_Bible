"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBook, getBooks, cleanText } from "@/lib/bible";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HighlightedVerse {
    bookAbbrev: string;
    bookName: string;
    chapter: number;
    verse: number;
    text: string;
}

export default function HighlightsPage() {
    const [highlights, setHighlights] = useState<HighlightedVerse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadedHighlights: HighlightedVerse[] = [];
        const books = getBooks();
        const bookOrder = new Map(books.map((b, i) => [b.abbrev, i]));

        // Iterate through localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("highlights-")) {
                // key format: highlights-{bookAbbrev}-{chapter}
                // but wait, bookAbbrev can contain hyphens? Usually not in this dataset.
                // Let's rely on the structure.
                // Actually, a safer way is: key.replace('highlights-', '') then split by last dash?
                // The format from VerseList.tsx: `highlights-${bookAbbrev}-${chapter}`
                // bookAbbrev is usually 'gn', 'ex', '1sm'. No hyphens.

                const parts = key.split("-");
                if (parts.length === 3) {
                    const bookAbbrev = parts[1];
                    const chapter = parseInt(parts[2], 10);

                    try {
                        const saved = localStorage.getItem(key);
                        if (saved) {
                            const indices: number[] = JSON.parse(saved); // 0-based verse indices
                            const book = getBook(bookAbbrev);

                            if (book) {
                                const chapterVerses = book.chapters[chapter - 1]; // 0-based array of verses
                                if (chapterVerses) {
                                    indices.forEach(verseIndex => {
                                        if (chapterVerses[verseIndex]) {
                                            loadedHighlights.push({
                                                bookAbbrev,
                                                bookName: book.koName,
                                                chapter,
                                                verse: verseIndex + 1, // 1-based for display
                                                text: cleanText(chapterVerses[verseIndex])
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    } catch (e) {
                        console.error("Failed to parse highlight", key, e);
                    }
                }
            }
        }

        // Sort highlights
        loadedHighlights.sort((a, b) => {
            const orderA = bookOrder.get(a.bookAbbrev) ?? 999;
            const orderB = bookOrder.get(b.bookAbbrev) ?? 999;

            if (orderA !== orderB) return orderA - orderB;
            if (a.chapter !== b.chapter) return a.chapter - b.chapter;
            return a.verse - b.verse;
        });

        setHighlights(loadedHighlights);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-stone-50 dark:bg-stone-950">
                <p className="text-stone-500">로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12 min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
            <header className="mb-8 flex items-center justify-between sticky top-0 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-sm py-4 border-b border-stone-200 dark:border-stone-800 z-10 transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 transition-colors"
                    >
                        &larr; 홈으로
                    </Link>
                    <h1 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-100">
                        내 형광펜 구절
                    </h1>
                </div>
                <ThemeToggle />
            </header>

            {highlights.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800">
                    <p className="text-stone-500 dark:text-stone-400 text-lg mb-4">저장된 형광펜 구절이 없습니다.</p>
                    <Link href="/read" className="text-stone-900 dark:text-stone-100 font-semibold hover:underline">
                        성경 읽으러 가기 &rarr;
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {highlights.map((item, index) => (
                        <Link
                            key={`${item.bookAbbrev}-${item.chapter}-${item.verse}`}
                            href={`/read/${item.bookAbbrev}/${item.chapter}`}
                            className="block bg-white dark:bg-stone-900 p-6 rounded-xl shadow-sm border border-stone-100 dark:border-stone-800 hover:shadow-md hover:border-stone-300 dark:hover:border-stone-600 transition-all group"
                        >
                            <div className="flex justify-between items-baseline mb-3">
                                <span className="font-semibold text-stone-900 dark:text-stone-100 text-lg">
                                    {item.bookName} {item.chapter}:{item.verse}
                                </span>
                            </div>
                            <p className="bible-text text-xl leading-relaxed text-stone-800 dark:text-stone-200 group-hover:text-stone-900 dark:group-hover:text-stone-100 bg-yellow-100/50 dark:bg-yellow-900/30 p-1 -mx-1 rounded">
                                {item.text}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
