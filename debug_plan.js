
// Mocking the logic from ReadingNavigation and plan.ts
const durationDays = 90;
const startDate = new Date(); // Today
const currentGlobalIndex = 12; // Assume we are at chapter 13 (index 12)
const totalChapters = 1189;

// Calculate days passed (Day 1)
const start = startDate;
const now = new Date();
const diffTime = Math.abs(now.getTime() - start.getTime());
const daysPassed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
let daysRemaining = durationDays - (daysPassed - 1);
if (daysRemaining < 1) daysRemaining = 1;

console.log(`Days Passed: ${daysPassed}, Days Remaining: ${daysRemaining}`);

// Calculate One Day Reading
const chaptersRemaining = totalChapters - currentGlobalIndex;
const chaptersToday = Math.ceil(chaptersRemaining / daysRemaining);

const startIndex = currentGlobalIndex;
let endIndex = startIndex + chaptersToday - 1;
if (endIndex >= totalChapters - 1) endIndex = totalChapters - 1;

console.log(`Current Index: ${currentGlobalIndex}`);
console.log(`Calculated Range: ${startIndex} to ${endIndex}`);
console.log(`Is Last Chapter? ${currentGlobalIndex === endIndex}`);

// Scenario: I am at the last chapter
const myCurrentIndex = endIndex;
const myRangeStart = myCurrentIndex; // Wait, calculateOneDayReading takes CURRENT index.
// If I am at 'endIndex', my 'currentGlobalIndex' in plan IS 'endIndex'.
// So calculateOneDayReading(endIndex, ...) -> Range [endIndex, endIndex + newGoal - 1] ?

// NO! The logic in ReadingNavigation says:
// const range = calculateOneDayReading(plan.currentGlobalIndex, daysRemaining);
// const isLastChapterOfDay = range?.end.globalIndex === plan.currentGlobalIndex;

// Let's trace:
// Day 1. Goal: 13 chapters. Indices 0 to 12.
// I read 0. Plan index becomes 1.
// ...
// I read 11. Plan index becomes 12.
// Now I am at chapter 13 (index 12).
// Plan index is 12.
// calculateOneDayReading(12, 90) -> ?
// Total Remaining: 1189 - 12 = 1177.
// Days Remaining: 90.
// Pace: ceil(1177 / 90) = ceil(13.07) = 14.
// Range: 12 to 12 + 14 - 1 = 12 + 13 = 25.
// So range.end is 25.
// isLastChapterOfDay = (25 === 12) -> FALSE.

// WAIT. The calculation re-evaluates every time!!
// This means "Today's Goal" is MOVING TARGET if we re-calculate based on remaining chapters every chapter.
// If I want a FIXED goal for the day, I must not recalculate 'chaptersToday' based on 'chaptersRemaining' dynamically within the same day?
// Or I must compare against a Target that computed at DAY START?

// But we don't store "Today's Target" in local storage. We only store "currentGlobalIndex".
// If we want "End at goal", we need to know what the goal WAS.

// If I use the logic "Total Chapters / Total DURATION" = Daily Pace (Constant)?
// 1189 / 90 = 13.2. So 14 chapters a day roughly.
// If I am at index 12.
// How do I know if I finished "Today's" allocation?

// Alternative Logic:
// We want to finish index 12 today?
// Initial Calculation:
// Day 1: 0 to 12 (13 chapters).
// Day 2: 13 to 25.
// ...

// If we strictly follow the schedule:
// Target Index for Day N = Math.ceil((Total / Duration) * DayN) - 1.
// Let's test this formula.
// Day 1: ceil((1189/90)*1) - 1 = ceil(13.2) - 1 = 14 - 1 = 13. (Index 13? So 14 chapters? 0..13)
// My dynamic logic gave 13 chapters (0..12).

// Let's look at dynamic logic again.
// Day 1 Start. Index 0. Rem: 1189. Days: 90. Pace: ceil(1189/90)=14. Range: 0..13. (Index 13 is end).
// I read. Index becomes 13.
// Day 1. Index 13. Rem: 1176. Days: 90. Pace: ceil(1176/90)=14. Range: 13..26.
// It keeps moving! You can never finish "Today"!

// CONCLUSION: The dynamic calculation is suitable for "How much needs to be read from NOW", but NOT for "Did I finish TODAY's chunk".
// To check "Did I finish Today", I need a reference to where Today SHOULD end.
// That Reference should depend on Day Number, not Current Index.

// Correct Logic for isLastChapterOfDay:
// targetIndexForToday = Math.ceil( (TotalChapters / plan.durationDays) * daysPassed ) - 1;
// If plan.currentGlobalIndex === targetIndexForToday -> Then we are at the last chapter!

console.log("FIXED LOGIC TEST:");
const pace = totalChapters / durationDays;
const targetIndex = Math.ceil(pace * daysPassed) - 1;
console.log(`Pace: ${pace}`);
console.log(`Target Index for Day ${daysPassed}: ${targetIndex}`);
console.log(`My Current Index: ${currentGlobalIndex}`);
console.log(`Is Last? ${currentGlobalIndex === targetIndex}`);
