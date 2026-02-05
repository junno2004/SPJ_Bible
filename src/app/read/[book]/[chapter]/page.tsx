import Link from "next/link";
import { getBook, getChapter, getBooks } from "@/lib/bible";
import { notFound } from "next/navigation";
import { VerseList } from "@/components/VerseList";

import { ReadingNavigation } from "@/components/ReadingNavigation";

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
    const { book: bookAbbrev, chapter } = await params;
    const book = getBook(bookAbbrev);

    if (!book) {
        notFound();
    }

    const chapterNum = parseInt(chapter, 10);
    const verses = book.chapters[chapterNum - 1]; // 0-indexed

    if (!verses) {
        notFound();
    }

    const prevChapter = chapterNum > 1 ? chapterNum - 1 : null;
    const nextChapter = chapterNum < book.chapters.length ? chapterNum + 1 : null;

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 transition-colors duration-300 pb-20">
            {/* Sticky Navigation Header */}
            <ReadingNavigation
                bookAbbrev={book.abbrev}
                chapter={chapterNum}
                prevChapter={prevChapter}
                nextChapter={nextChapter}
            />

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-stone-900">{book.koName} {chapterNum}장</h1>
                </div>

                <VerseList verses={verses} bookAbbrev={book.abbrev} chapter={chapterNum} />

                {/* Bottom Spacer/Footer for easier scrolling */}
                <div className="h-20" />
            </div>
        </div>
    );
}
