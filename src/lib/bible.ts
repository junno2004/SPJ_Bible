
import bibleData from '@/../data/bible.json';
import { KOREAN_BOOK_NAMES } from './constants';

export interface BibleBook {
  abbrev: string;
  name: string;
  koName: string;
  chapters: string[][];
}

const books: BibleBook[] = (bibleData as any[]).map(b => ({
  ...b,
  koName: KOREAN_BOOK_NAMES[b.name] || b.name
})) as BibleBook[];

export function getBooks(): { name: string; koName: string; abbrev: string; chapterCount: number }[] {
  return books.map((book) => ({
    name: book.name,
    koName: book.koName,
    abbrev: book.abbrev,
    chapterCount: book.chapters.length,
  }));
}

export function getBook(nameOrAbbrev: string): BibleBook | undefined {
  return books.find(
    (b) =>
      b.name === nameOrAbbrev ||
      b.abbrev === nameOrAbbrev ||
      b.koName === nameOrAbbrev ||
      decodeURIComponent(nameOrAbbrev) === b.name ||
      decodeURIComponent(nameOrAbbrev) === b.koName
  );
}

export function cleanText(text: string): string {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function getChapter(bookName: string, chapterIndex: number): string[] | undefined {
  const book = getBook(bookName);
  if (!book) return undefined;
  // chapterIndex is 1-based usually in UI, but 0-based in array
  return book.chapters[chapterIndex - 1]?.map(cleanText);
}

export function searchBible(query: string): { book: string; chapter: number; verse: number; text: string }[] {
  const results: { book: string; chapter: number; verse: number; text: string }[] = [];
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return results;

  books.forEach((book) => {
    book.chapters.forEach((chapter, chapterIdx) => {
      chapter.forEach((verseText, verseIdx) => {
        const cleanedText = cleanText(verseText);
        if (cleanedText.includes(normalizedQuery)) {
          results.push({
            book: book.koName, // Return Korean name for display
            chapter: chapterIdx + 1,
            verse: verseIdx + 1,
            text: cleanedText,
          });
        }
      });
    });
  });

  return results;
}

export function getRandomVerse(): { book: string; chapter: number; verse: number; text: string } {
  const randomBook = books[Math.floor(Math.random() * books.length)];
  const randomChapterIndex = Math.floor(Math.random() * randomBook.chapters.length);
  const randomChapter = randomBook.chapters[randomChapterIndex];
  const randomVerseIndex = Math.floor(Math.random() * randomChapter.length);

  return {
    book: randomBook.koName,
    chapter: randomChapterIndex + 1,
    verse: randomVerseIndex + 1,
    text: cleanText(randomChapter[randomVerseIndex]),
  };
}
