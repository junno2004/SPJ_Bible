import { getBooks, getBook } from "./bible";

// Total chapters in the Protestant Bible is 1189
// We map every chapter to a global index from 0 to 1188
// 0 = Genesis 1
// 1188 = Revelation 22

export interface GlobalChapter {
    globalIndex: number;
    bookAbbrev: string;
    bookName: string;
    chapter: number;
}

export interface ReadingRange {
    start: GlobalChapter;
    end: GlobalChapter;
    isFinished: boolean; // true if end index >= 1188
}

// Cache this to avoid recalculating every time
let _chapterMap: GlobalChapter[] | null = null;

function getChapterMap(): GlobalChapter[] {
    if (_chapterMap) return _chapterMap;

    const books = getBooks();
    const map: GlobalChapter[] = [];
    let currentIndex = 0;

    books.forEach(book => {
        for (let c = 1; c <= book.chapterCount; c++) {
            map.push({
                globalIndex: currentIndex,
                bookAbbrev: book.abbrev,
                bookName: book.koName,
                chapter: c
            });
            currentIndex++;
        }
    });

    _chapterMap = map;
    return map;
}

export function getTotalChapters(): number {
    return getChapterMap().length;
}

export function getChapterFromGlobalIndex(index: number): GlobalChapter | null {
    const map = getChapterMap();
    if (index < 0 || index >= map.length) return null;
    return map[index];
}

// Calculate what valid range of chapters to read for a given day
// startGlobalIndex: The index the user is currently at (has NOT read yet)
// daysRemaining: How many days left in the plan (including today)
// targetEndDate: Not strictly needed if we recalculate dynamically based on remaining work
export function calculateOneDayReading(currentGlobalIndex: number, daysRemaining: number): ReadingRange | null {
    const totalChapters = getTotalChapters();
    const chaptersRemaining = totalChapters - currentGlobalIndex;

    if (chaptersRemaining <= 0) return null;
    if (daysRemaining <= 0) return null; // Should not happen if plan is active

    // Simple even distribution: ceil(remaining / days)
    // e.g. 100 chaps / 10 days = 10 day
    // 100 chaps / 9 days = 11.11 -> 12 per day
    const chaptersToday = Math.ceil(chaptersRemaining / daysRemaining);

    const startIndex = currentGlobalIndex;
    let endIndex = startIndex + chaptersToday - 1;

    // Cap at last chapter
    if (endIndex >= totalChapters - 1) {
        endIndex = totalChapters - 1;
    }

    const startInfo = getChapterFromGlobalIndex(startIndex);
    const endInfo = getChapterFromGlobalIndex(endIndex);

    if (!startInfo || !endInfo) return null;

    return {
        start: startInfo,
        end: endInfo,
        isFinished: endIndex >= totalChapters - 1
    };
}
