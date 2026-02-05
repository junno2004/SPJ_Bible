
import { getBooks, getBook } from "./bible";

// Total chapters in the Protestant Bible is 1189
export interface GlobalChapter {
    globalIndex: number;
    bookAbbrev: string;
    bookName: string;
    chapter: number;
}

export interface ReadingRange {
    start: GlobalChapter;
    end: GlobalChapter;
    isFinished: boolean;
}

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

// Fixed Daily Target Calculation
export function calculateDailyTarget(daysPassed: number, durationDays: number): number {
    const totalChapters = getTotalChapters();
    if (daysPassed > durationDays) return totalChapters - 1;

    // Day 1: ceil(13.2 * 1) - 1 = 13.
    // Day 90: ceil(13.2 * 90) - 1 = 1188.
    const chunks = totalChapters / durationDays;
    let targetIndex = Math.ceil(chunks * daysPassed) - 1;

    if (targetIndex >= totalChapters) targetIndex = totalChapters - 1;
    return targetIndex;
}

// Determine range for "Today" based on schedule
export function calculateTodayRange(currentGlobalIndex: number, daysPassed: number, durationDays: number): ReadingRange | null {
    const totalChapters = getTotalChapters();

    // Start is where user is currently
    const startIndex = currentGlobalIndex;

    // End is the fixed target for today
    let endIndex = calculateDailyTarget(daysPassed, durationDays);

    // If user is ahead of schedule (current > target), give at least one chapter?
    // Or stick to schedule? If ahead, target is "already passed".
    // Let's say if current > target, we just show next single chapter as impromptu.
    if (startIndex > endIndex) {
        endIndex = startIndex;
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
