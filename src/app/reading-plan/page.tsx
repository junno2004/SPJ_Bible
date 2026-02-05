"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { calculateOneDayReading, getChapterFromGlobalIndex, getTotalChapters, ReadingRange } from "@/lib/plan";
import { MoveRight, CheckCircle, Calendar, RefreshCcw } from "lucide-react";

interface PlanState {
    startDate: string; // ISO Status
    durationDays: number;
    currentGlobalIndex: number; // 0-based index of the *next* chapter to read
}

export default function ReadingPlanPage() {
    const [plan, setPlan] = useState<PlanState | null>(null);
    const [loading, setLoading] = useState(true);
    const [todayRange, setTodayRange] = useState<ReadingRange | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("bible-reading-plan-v1");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setPlan(parsed);
                calculateToday(parsed);
            } catch (e) {
                console.error("Failed to load plan", e);
            }
        }
        setLoading(false);
    }, []);

    const calculateToday = (currentPlan: PlanState) => {
        if (!currentPlan) return;

        // Calculate days passed since start
        const start = new Date(currentPlan.startDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const daysPassed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Days remaining logic:
        // Originally: Duration - DaysPassed + 1?
        // Let's make it simpler: We want to finish in {Duration}.
        // If we represent strict schedule, we just divide remaining chapters by remaining days.
        // If user is ahead/behind, this dynamic calculation adjusts the load.

        let daysRemaining = currentPlan.durationDays - (daysPassed - 1);
        if (daysRemaining < 1) daysRemaining = 1; // Minimum 1 day to execute

        const range = calculateOneDayReading(currentPlan.currentGlobalIndex, daysRemaining);
        setTodayRange(range);
    };

    const startPlan = (duration: number) => {
        const newPlan: PlanState = {
            startDate: new Date().toISOString(),
            durationDays: duration,
            currentGlobalIndex: 0,
        };
        savePlan(newPlan);
    };

    const savePlan = (newPlan: PlanState) => {
        setPlan(newPlan);
        localStorage.setItem("bible-reading-plan-v1", JSON.stringify(newPlan));
        calculateToday(newPlan);
    };

    const completeToday = () => {
        if (!plan || !todayRange) return;

        const nextIndex = todayRange.end.globalIndex + 1;
        const updatedPlan = {
            ...plan,
            currentGlobalIndex: nextIndex
        };

        savePlan(updatedPlan);

        // Scroll to top or show celebration (could add confetti later)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetPlan = () => {
        if (confirm("정말로 일독 계획을 초기화하시겠습니까? 기록이 모두 사라집니다.")) {
            localStorage.removeItem("bible-reading-plan-v1");
            setPlan(null);
            setTodayRange(null);
        }
    };

    if (!mounted) return null; // Hydration fix

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-500">
                로딩 중...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
            <header className="fixed top-0 w-full bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800 z-10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 transition-colors"
                    >
                        &larr; 홈으로
                    </Link>
                    <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                        성경 1독 도전 🏃
                    </h1>
                </div>

            </header>

            <main className="max-w-2xl mx-auto px-6 pt-28 pb-20">
                {!plan ? (
                    // SETUP VIEW
                    <div className="text-center space-y-12 animate-fade-in-up">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">
                                성경 1독을 시작해보세요
                            </h2>
                            <p className="text-stone-600 dark:text-stone-400 text-lg">
                                목표 기간을 선택하시면 매일 읽을 분량을 알려드립니다.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: "90일 완성", days: 90, desc: "하루 약 13장" },
                                { label: "6개월 완성", days: 180, desc: "하루 약 7장" },
                                { label: "1년 완성", days: 365, desc: "하루 약 3장" },
                            ].map((opt) => (
                                <button
                                    key={opt.days}
                                    onClick={() => startPlan(opt.days)}
                                    className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-100 dark:border-stone-800 hover:border-stone-900 dark:hover:border-stone-100 hover:shadow-lg transition-all group"
                                >
                                    <span className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2 group-hover:scale-110 transition-transform">
                                        {opt.label}
                                    </span>
                                    <span className="text-stone-500 font-medium">
                                        {opt.desc}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    // DASHBOARD VIEW
                    <div className="space-y-8 animate-fade-in">
                        {/* Progress Card */}
                        <div className="bg-stone-900 dark:bg-stone-100 rounded-2xl p-8 text-white dark:text-stone-900 shadow-xl overflow-hidden relative">
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div>
                                    <p className="text-stone-400 dark:text-stone-500 font-medium mb-1">현재 진행률</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold tracking-tight">
                                            {Math.round((plan.currentGlobalIndex / getTotalChapters()) * 100)}%
                                        </span>
                                        <span className="opacity-60">
                                            ({plan.currentGlobalIndex} / {getTotalChapters()} 장)
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-stone-400 dark:text-stone-500 text-sm mb-1">시작일</p>
                                    <p className="font-semibold">{new Date(plan.startDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Simple Progress Bar Background */}
                            <div className="absolute bottom-0 left-0 h-2 bg-stone-800 dark:bg-stone-200 w-full">
                                <div
                                    className="h-full bg-green-500 dark:bg-green-600 transition-all duration-1000 ease-out"
                                    style={{ width: `${(plan.currentGlobalIndex / getTotalChapters()) * 100}%` }}
                                />
                            </div>
                        </div>

                        {plan.currentGlobalIndex >= getTotalChapters() ? (
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-center p-12 rounded-2xl border border-yellow-200 dark:border-yellow-900/50">
                                <p className="text-4xl mb-4">🎉</p>
                                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                                    축하합니다! 성경 1독을 완료하셨습니다!
                                </h3>
                                <p className="text-stone-600 dark:text-stone-300 mb-8">
                                    꾸준한 묵상이 삶의 빛이 되기를 소망합니다.
                                </p>
                                <button
                                    onClick={resetPlan}
                                    className="px-6 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
                                >
                                    새로운 도전 시작하기
                                </button>
                            </div>
                        ) : todayRange ? (
                            <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm">
                                <div className="flex items-center gap-3 mb-6 text-stone-500 dark:text-stone-400">
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-medium tracking-wide uppercase">Today's Reading</span>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2 leading-tight">
                                        {todayRange.start.bookName} {todayRange.start.chapter}장
                                        {todayRange.start.globalIndex !== todayRange.end.globalIndex && (
                                            <>
                                                <span className="text-stone-400 mx-2">~</span>
                                                {todayRange.start.bookName !== todayRange.end.bookName && `${todayRange.end.bookName} `}
                                                {todayRange.end.chapter}장
                                            </>
                                        )}
                                    </h3>
                                    <p className="text-stone-500 dark:text-stone-500">
                                        오늘 읽을 범위입니다.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={`/read/${todayRange.start.bookAbbrev}/${todayRange.start.chapter}`}
                                        className="w-full py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-bold text-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                                    >
                                        말씀 읽으러 가기 <MoveRight className="w-5 h-5" />
                                    </Link>

                                    <button
                                        onClick={completeToday}
                                        className="w-full py-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 rounded-xl font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        오늘 분량 완료 (Mark Done)
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-stone-100 dark:bg-stone-900 rounded-xl">
                                계산 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                            </div>
                        )}

                        <div className="text-center pt-8">
                            <button
                                onClick={resetPlan}
                                className="text-sm text-stone-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1 mx-auto"
                            >
                                <RefreshCcw className="w-3 h-3" />
                                계획 초기화
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
