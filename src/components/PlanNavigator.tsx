"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBooks, getBook } from "@/lib/bible";
import { useRouter } from "next/navigation";
import { ChartBar, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";

interface PlanNavigatorProps {
    prevChapter: number | null;
    nextChapter: number | null;
    bookAbbrev: string;
    chapter: number;
}

export function PlanNavigator({ prevChapter, nextChapter, bookAbbrev, chapter }: PlanNavigatorProps) {
    const router = useRouter();
    const [planStatus, setPlanStatus] = useState<{
        isActive: boolean;
        isTargetChapter: boolean;
        progressPercent: number;
    } | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("bible-reading-plan-v1");
        if (saved) {
            try {
                const plan = JSON.parse(saved);
                const books = getBooks();

                // Calculate current global index for this chapter
                let globalIndex = 0;
                for (const b of books) {
                    if (b.abbrev === bookAbbrev) {
                        globalIndex += (chapter - 1);
                        break;
                    }
                    globalIndex += b.chapterCount;
                }

                const totalChapters = 1189;
                const percent = Math.round((plan.currentGlobalIndex / totalChapters) * 100);

                setPlanStatus({
                    isActive: true,
                    isTargetChapter: globalIndex === plan.currentGlobalIndex,
                    progressPercent: percent
                });
            } catch (e) {
                console.error(e);
            }
        }
    }, [bookAbbrev, chapter]);

    const handleNextWithComplete = (e: React.MouseEvent) => {
        e.preventDefault();

        // Update local storage
        const saved = localStorage.getItem("bible-reading-plan-v1");
        if (saved) {
            try {
                const plan = JSON.parse(saved);
                // Only update if we are reading the target chapter (or re-reading it)
                // Actually, simply advancing the index is safer. 
                // Let's assume hitting "Complete & Next" means they finished this specific chapter.
                // If they are ahead or behind, we just increment index? 
                // Better logic: If isTargetChapter, increment index.

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

        // Navigate
        router.push(`/read/${bookAbbrev}/${nextChapter}`);
    };

    return (
        <div className="space-y-6">
            {/* Plan Info Bar (if active) */}
            {planStatus?.isActive && (
                <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ChartBar className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                                성경 1독 도전 중 ({planStatus.progressPercent}%)
                            </p>
                            {planStatus.isTargetChapter && (
                                <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">
                                    현재 읽어야 할 구간입니다 ✅
                                </p>
                            )}
                        </div>
                    </div>
                    <Link
                        href="/reading-plan"
                        className="text-xs font-medium px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md hover:border-stone-400 transition-colors"
                    >
                        현황 보기
                    </Link>
                </div>
            )}

            {/* Navigation Buttons */}
            <nav className="flex justify-between items-center border-t border-stone-200 dark:border-stone-800 pt-8">
                {prevChapter ? (
                    <Link
                        href={`/read/${bookAbbrev}/${prevChapter}`}
                        className="px-4 py-3 sm:px-6 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        {prevChapter}장
                    </Link>
                ) : (
                    <div />
                )}

                {nextChapter ? (
                    planStatus?.isActive && planStatus.isTargetChapter ? (
                        <button
                            onClick={handleNextWithComplete}
                            className="px-4 py-3 sm:px-6 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-lg flex items-center gap-2 font-semibold"
                        >
                            <CheckCircle className="w-4 h-4" />
                            읽음 완료 & {nextChapter}장
                        </button>
                    ) : (
                        <Link
                            href={`/read/${bookAbbrev}/${nextChapter}`}
                            className="px-4 py-3 sm:px-6 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-lg flex items-center gap-2"
                        >
                            {nextChapter}장
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    )
                ) : (
                    // Finish Book logic (could point to next book)
                    <div />
                )}
            </nav>
        </div>
    );
}
