"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Home, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getBooks } from "@/lib/bible";

interface ReadingNavigationProps {
    bookAbbrev: string;
    chapter: number;
    prevChapter: number | null;
    nextChapter: number | null;
}

export function ReadingNavigation({ bookAbbrev, chapter, prevChapter, nextChapter }: ReadingNavigationProps) {
    const router = useRouter();
    const books = getBooks();
    const currentBook = books.find(b => b.abbrev === bookAbbrev);

    // Plan Logic State
    const [planStatus, setPlanStatus] = useState<{
        isActive: boolean;
        isTargetChapter: boolean;
    } | null>(null);

    useEffect(() => {
        // Load plan status
        const saved = localStorage.getItem("bible-reading-plan-v1");
        if (saved && currentBook) {
            try {
                const plan = JSON.parse(saved);

                // Calculate current global index
                let globalIndex = 0;
                for (const b of books) {
                    if (b.abbrev === bookAbbrev) {
                        globalIndex += (chapter - 1);
                        break;
                    }
                    globalIndex += b.chapterCount;
                }

                setPlanStatus({
                    isActive: true,
                    isTargetChapter: globalIndex === plan.currentGlobalIndex
                });
            } catch (e) {
                console.error(e);
            }
        }
    }, [bookAbbrev, chapter]);

    const handleNextWithComplete = () => {
        // Update local storage
        const saved = localStorage.getItem("bible-reading-plan-v1");
        if (saved) {
            try {
                const plan = JSON.parse(saved);
                if (planStatus?.isTargetChapter) {
                    const newPlan = {
                        ...plan,
                        currentGlobalIndex: plan.currentGlobalIndex + 1
                    };
                    localStorage.setItem("bible-reading-plan-v1", JSON.stringify(newPlan));
                }
            } catch (e) {
                console.error(e);
            }
        }
        router.push(`/read/${bookAbbrev}/${nextChapter}`);
    };

    const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBook = e.target.value;
        router.push(`/read/${newBook}/1`);
    };

    const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newChapter = e.target.value;
        router.push(`/read/${bookAbbrev}/${newChapter}`);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm transition-all">
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-2 md:gap-4">
                {/* Left: Home */}
                <Link
                    href="/"
                    className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
                >
                    <Home className="w-5 h-5" />
                </Link>

                {/* Center: Dropdowns */}
                <div className="flex gap-2 flex-1 justify-center max-w-md">
                    <select
                        value={bookAbbrev}
                        onChange={handleBookChange}
                        className="p-2 bg-stone-100 border-none rounded-lg text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-stone-400 cursor-pointer min-w-0 flex-shrink"
                    >
                        {books.map(b => (
                            <option key={b.abbrev} value={b.abbrev}>
                                {b.koName}
                            </option>
                        ))}
                    </select>

                    <select
                        value={chapter}
                        onChange={handleChapterChange}
                        className="p-2 bg-stone-100 border-none rounded-lg text-sm font-semibold text-stone-900 focus:ring-2 focus:ring-stone-400 cursor-pointer w-20"
                    >
                        {currentBook && Array.from({ length: currentBook.chapterCount }, (_, i) => i + 1).map(c => (
                            <option key={c} value={c}>
                                {c}장
                            </option>
                        ))}
                    </select>
                </div>

                {/* Right: Navigation */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => prevChapter && router.push(`/read/${bookAbbrev}/${prevChapter}`)}
                        disabled={!prevChapter}
                        className={`p-2 rounded-lg transition-colors ${prevChapter
                                ? 'text-stone-600 hover:bg-stone-100'
                                : 'text-stone-300 cursor-not-allowed'
                            }`}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {planStatus?.isTargetChapter && nextChapter ? (
                        <button
                            onClick={handleNextWithComplete}
                            className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                            title="읽음 완료 & 다음장"
                        >
                            <CheckCircle className="w-6 h-6" />
                        </button>
                    ) : (
                        <button
                            onClick={() => nextChapter && router.push(`/read/${bookAbbrev}/${nextChapter}`)}
                            disabled={!nextChapter}
                            className={`p-2 rounded-lg transition-colors ${nextChapter
                                    ? 'text-stone-600 hover:bg-stone-100'
                                    : 'text-stone-300 cursor-not-allowed'
                                }`}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
