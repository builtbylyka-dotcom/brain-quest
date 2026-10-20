import { BIBLE_SUBCATEGORIES } from "./categories";
import { BIBLE_QUESTIONS } from "./bibleQuestions";
import { DIFFICULTIES } from "@/types/questions";

const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
  "Esther", "Job", "Psalm", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah",
  "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah",
  "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
  "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation",
];

const REF = /^(.+) (\d+):(\d+)(?:-(\d+))?$/;

describe("Bible question bank integrity", () => {
  it("has 210 questions with unique ids", () => {
    expect(BIBLE_QUESTIONS).toHaveLength(210);
    expect(new Set(BIBLE_QUESTIONS.map((q) => q.id)).size).toBe(BIBLE_QUESTIONS.length);
  });

  it("has exactly 10 questions for every subcategory × difficulty", () => {
    const stored = BIBLE_SUBCATEGORIES.filter((s) => s.id !== "mixed");
    for (const sub of stored) {
      for (const d of DIFFICULTIES) {
        const n = BIBLE_QUESTIONS.filter((q) => q.subcategory === sub.id && q.difficulty === d).length;
        expect(n, `${sub.id}/${d}`).toBe(10);
      }
    }
  });

  it("has an even 70 / 70 / 70 difficulty split", () => {
    for (const d of DIFFICULTIES) expect(BIBLE_QUESTIONS.filter((q) => q.difficulty === d)).toHaveLength(70);
  });

  it.each(BIBLE_QUESTIONS.map((q) => [q.id, q] as const))("%s is well-formed", (_, q) => {
    expect(q.category).toBe("bible");
    expect(q.question.trim().length).toBeGreaterThan(5);
    expect(q.options).toHaveLength(4);
    expect(q.options.every((o) => o.trim().length > 0)).toBe(true);
    expect(new Set(q.options.map((o) => o.toLowerCase())).size).toBe(4);
    expect([0, 1, 2, 3]).toContain(q.correctAnswerIndex);
    expect(q.explanation.trim().length).toBeGreaterThan(20);

    const m = REF.exec(q.reference);
    expect(m, `reference "${q.reference}"`).not.toBeNull();
    const [, book, chapter, verse, end] = m!;
    expect(BOOKS).toContain(book);
    expect(Number(chapter)).toBeGreaterThan(0);
    expect(Number(verse)).toBeGreaterThan(0);
    if (end) expect(Number(end)).toBeGreaterThan(Number(verse));
  });

  it("Finish the Verse questions all contain a blank", () => {
    for (const q of BIBLE_QUESTIONS.filter((q) => q.subcategory === "finish-the-verse")) {
      expect(q.question).toContain("____");
    }
  });

  it("no question text is repeated", () => {
    const texts = BIBLE_QUESTIONS.map((q) => q.question.toLowerCase());
    expect(new Set(texts).size).toBe(texts.length);
  });
});
