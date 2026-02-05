import Link from "next/link";
import { getBook, getBooks } from "@/lib/bible";
import { redirect, notFound } from "next/navigation";


export async function generateStaticParams() {
    const books = getBooks();
    return books.map((book) => ({
        book: book.abbrev,
    }));
}

export default async function ChapterSelection({ params }: { params: Promise<{ book: string }> }) {
    const { book: bookAbbrev } = await params;
    // Decode in case of URL encoding, though params are usually decoded
    const book = getBook(decodeURIComponent(bookAbbrev));

    if (!book) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <Link href="/read" className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 transition-colors mb-4 inline-block">
                        &larr; 성경 목록
                    </Link>
                    <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">{book.koName}</h1>
                    <p className="text-stone-500 mt-2">장을 선택하세요</p>
                </div>

            </header>

            <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {Array.from({ length: book.chapters.length }, (_, i) => i + 1).map((chapterNum) => (
                    <Link
                        key={chapterNum}
                        href={`/read/${bookAbbrev}/${chapterNum}`}
                        className="aspect-square flex items-center justify-center bg-white dark:bg-stone-900 rounded-lg shadow-sm border border-stone-200 dark:border-stone-800 hover:border-stone-900 dark:hover:border-stone-500 hover:bg-stone-900 dark:hover:bg-stone-800 hover:text-white transition-all font-medium text-lg dark:text-stone-200"
                    >
                        {chapterNum}
                    </Link>
                ))}
            </div>
        </div>
    );
}
