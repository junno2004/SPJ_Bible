import Link from "next/link";
import { getBooks } from "@/lib/bible";

export default function BookSelection() {
    const books = getBooks();
    const otBooks = books.slice(0, 39);
    const ntBooks = books.slice(39);

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12">
            <header className="mb-8">
                <Link href="/" className="text-stone-500 hover:text-stone-900 transition-colors mb-4 inline-block">
                    &larr; 돌아가기
                </Link>
                <h1 className="text-3xl font-bold text-stone-900">성경 읽기</h1>
                <p className="text-stone-500 mt-2">읽을 성경을 선택하세요</p>
            </header>

            <section>
                <h2 className="text-xl font-semibold text-stone-800 mb-6 border-b border-stone-200 pb-2">구약 성경 (Old Testament)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {otBooks.map((book) => (
                        <Link
                            key={book.abbrev}
                            href={`/read/${book.abbrev}`}
                            className="p-4 bg-white rounded-xl shadow-sm border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all text-center"
                        >
                            <div className="font-medium text-stone-900">{book.koName}</div>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-stone-800 mb-6 border-b border-stone-200 pb-2">신약 성경 (New Testament)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {ntBooks.map((book) => (
                        <Link
                            key={book.abbrev}
                            href={`/read/${book.abbrev}`}
                            className="p-4 bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-md transition-all text-center"
                        >
                            <div className="font-medium text-stone-900 dark:text-stone-100">{book.koName}</div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
