"use client";

import Link from "next/link";
import { searchBible } from "@/lib/bible";
import { Suspense, useState, useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const q = searchParams.get("q");
    const [query, setQuery] = useState(q || "");
    const [results, setResults] = useState<ReturnType<typeof searchBible>>([]);

    useEffect(() => {
        if (q) {
            setQuery(q);
            setResults(searchBible(q));
        } else {
            setResults([]);
        }
    }, [q]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newQuery = formData.get("q") as string;
        if (newQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(newQuery.trim())}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12 min-h-screen">
            <header className="mb-8 flex justify-between items-start">
                <div className="flex-1">
                    <Link href="/" className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 transition-colors mb-4 inline-block">
                        &larr; 홈으로
                    </Link>
                    <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-6">성경 검색</h1>

                    <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
                        <input
                            type="text"
                            name="q"
                            defaultValue={query}
                            placeholder="단어를 입력하세요 (예: 사랑, 믿음)"
                            className="flex-1 px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm text-lg"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium rounded-xl hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-sm"
                        >
                            검색
                        </button>
                    </form>
                </div>
                <div className="ml-4">

                </div>
            </header>

            <section className="space-y-6">
                {query && (
                    <p className="text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 pb-2">
                        "{query}" 검색 결과: <span className="font-semibold text-stone-900 dark:text-stone-100">{results.length}</span> 건
                    </p>
                )}

                {query && results.length === 0 && (
                    <div className="text-center py-12 text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 rounded-xl">
                        검색 결과가 없습니다.
                    </div>
                )}

                <div className="space-y-4">
                    {results.slice(0, 100).map((result, i) => ( // Limit to 100 for render perf
                        <Link
                            key={i}
                            href={`/read/${result.book}/${result.chapter}`}
                            className="block p-6 bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-stone-100 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-600 hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="font-semibold text-stone-900 dark:text-stone-100 text-lg">
                                    {result.book} {result.chapter}:{result.verse}
                                </span>
                            </div>
                            <p className="bible-text text-stone-600 dark:text-stone-400 leading-relaxed group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors">
                                {result.text.split(query).map((part, index, arr) => (
                                    <span key={index}>
                                        {part}
                                        {index < arr.length - 1 && (
                                            <span className="bg-yellow-100 dark:bg-yellow-900/50 text-stone-900 dark:text-stone-100 font-semibold rounded px-0.5">
                                                {query}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </p>
                        </Link>
                    ))}
                    {results.length > 100 && (
                        <p className="text-center text-stone-500 dark:text-stone-400 pt-4">
                            결과가 너무 많습니다. ({results.length - 100} 건 생략됨)
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
