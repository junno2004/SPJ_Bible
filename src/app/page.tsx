import Link from "next/link";
import { getRandomVerse } from "@/lib/bible";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const verse = getRandomVerse();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-2xl w-full space-y-12 text-center">
        {/* Header / Logo */}
        <header className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            준노의 Bible
          </h1>
          <p className="text-stone-500 text-lg">매일의 말씀과 함께 시작하세요</p>
        </header>

        {/* Verse of the Day Card */}
        <section className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-2xl shadow-xl shadow-stone-200 dark:shadow-stone-900 border border-stone-100 dark:border-stone-800 transition-colors">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-6">
            오늘의 말씀
          </h2>
          <blockquote className="bible-text text-2xl md:text-3xl font-medium leading-relaxed text-stone-800 dark:text-stone-200 mb-6">
            "{verse.text}"
          </blockquote>
          <cite className="not-italic text-stone-600 dark:text-stone-400 font-semibold text-lg">
            {verse.book} {verse.chapter}:{verse.verse}
          </cite>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 justify-center w-full max-w-md mx-auto">
          <div className="flex gap-4 w-full">
            <Link
              href="/read"
              className="px-8 py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-medium text-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-all shadow-lg hover:shadow-xl active:scale-95 flex-1 flex items-center justify-center"
            >
              성경 읽기
            </Link>
            <Link
              href="/search"
              className="px-8 py-4 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-xl font-medium text-lg hover:bg-stone-50 dark:hover:bg-stone-800 hover:border-stone-300 transition-all shadow-sm hover:shadow-md active:scale-95 flex-1 flex items-center justify-center"
            >
              검색
            </Link>
          </div>
          <Link
            href="/highlights"
            className="px-8 py-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-200 dark:border-yellow-900/50 rounded-xl font-medium text-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-all shadow-sm hover:shadow-md active:scale-95 w-full flex items-center justify-center"
          >
            마음에 새긴 말씀
          </Link>
        </div>
      </div>
    </main>
  );
}
