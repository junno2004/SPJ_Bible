import Link from "next/link";
import { getBook, getChapter, getBooks } from "@/lib/bible";
import { notFound } from "next/navigation";
import { VerseList } from "@/components/VerseList";
import { ThemeToggle } from "@/components/ThemeToggle";

export async function generateStaticParams() {
    const books = getBooks();
    return books.flatMap((book) =>
        Array.from({ length: book.chapterCount }, (_, i) => ({
            book: book.abbrev,
            chapter: String(i + 1),
        }))
    );
}

export default async function ChapterView({
    params,
}: {
    params: Promise<{ book: string; chapter: string }>;
}) {
    const { book: bookAbbrev, chapter: chapterStr } = await params;
    const chapterNum = parseInt(chapterStr, 10);

    if (isNaN(chapterNum)) notFound();

    const book = getBook(decodeURIComponent(bookAbbrev));
    if (!book) notFound();

    const verses = getChapter(book.name, chapterNum);
    if (!verses) notFound();

    const prevChapter = chapterNum > 1 ? chapterNum - 1 : null;
    const nextChapter = chapterNum < book.chapters.length ? chapterNum + 1 : null;

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-12 mb-20">
            <header className="mb-8 flex items-center justify-between sticky top-0 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-sm py-4 border-b border-stone-200 dark:border-stone-800 z-10 transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/read/${bookAbbrev}`}
                        className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 transition-colors"
                    >
                        &larr; 목록
                    </Link>
                    <h1 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-100">
                        {book.koName} {chapterNum}장
                    </h1>
                </div>
                <ThemeToggle />
            </header>

            <VerseList verses={verses} bookAbbrev={book.abbrev} chapter={chapterNum} />

            <nav className="mt-12 flex justify-between items-center border-t border-stone-200 dark:border-stone-800 pt-8">
                {prevChapter ? (
                    <Link
                        href={`/read/${bookAbbrev}/${prevChapter}`}
                        className="px-6 py-3 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                    >
                        &larr; {prevChapter}장
                    </Link>
                ) : (
                    <div /> // Spacer
                )}

                {nextChapter ? (
                    <Link
                        href={`/read/${bookAbbrev}/${nextChapter}`}
                        className="px-6 py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-lg"
                    >
                        {nextChapter}장 &rarr;
                    </Link>
                ) : (
                    <div />
                )}
            </nav>
        </div>
    );
}
