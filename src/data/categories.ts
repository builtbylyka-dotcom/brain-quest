import type { BibleSubcategory, CategoryId } from "@/types/questions";

export type Fabric = "periwinkle" | "sage" | "gold" | "coral" | "emerald" | "muslin" | "navy";

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  /** Key into the icon map in components/categories. */
  icon: "book" | "flask" | "landmark" | "globe" | "lightbulb" | "clapperboard" | "leaf";
  available: boolean;
  fabrics: [Fabric, Fabric];
};

export const CATEGORIES: Category[] = [
  {
    id: "bible",
    name: "Bible Trivia",
    description: "Explore the stories, people, and teachings of the Bible.",
    icon: "book",
    available: true,
    fabrics: ["periwinkle", "sage"],
  },
  {
    id: "science",
    name: "Science",
    description: "Atoms, planets, and the curious rules that run the universe.",
    icon: "flask",
    available: false,
    fabrics: ["sage", "periwinkle"],
  },
  {
    id: "history",
    name: "History",
    description: "Empires, inventions, and the people who changed the world.",
    icon: "landmark",
    available: false,
    fabrics: ["gold", "coral"],
  },
  {
    id: "geography",
    name: "Geography",
    description: "Capitals, rivers, mountains, and places worth knowing.",
    icon: "globe",
    available: false,
    fabrics: ["emerald", "periwinkle"],
  },
  {
    id: "general",
    name: "General Knowledge",
    description: "A little bit of everything for the endlessly curious.",
    icon: "lightbulb",
    available: false,
    fabrics: ["gold", "sage"],
  },
  {
    id: "movies",
    name: "Movies & Entertainment",
    description: "Films, music, and the stories we love to watch.",
    icon: "clapperboard",
    available: false,
    fabrics: ["coral", "periwinkle"],
  },
  {
    id: "animals",
    name: "Animals & Nature",
    description: "Creatures great and small, and the wild places they live.",
    icon: "leaf",
    available: false,
    fabrics: ["sage", "emerald"],
  },
];

export type Subcategory = {
  id: BibleSubcategory;
  name: string;
  description: string;
  /** A real traditional quilt block whose name nods to the subject. */
  pattern: string;
  fabrics: [Fabric, Fabric];
};

export const BIBLE_SUBCATEGORIES: Subcategory[] = [
  {
    id: "old-testament",
    name: "Old Testament",
    description: "Creation, the patriarchs, the Exodus, kings, and prophets.",
    pattern: "Jacob's Ladder",
    fabrics: ["sage", "navy"],
  },
  {
    id: "new-testament",
    name: "New Testament",
    description: "The Gospels, the early church, and the letters of the apostles.",
    pattern: "Star of Bethlehem",
    fabrics: ["periwinkle", "gold"],
  },
  {
    id: "characters",
    name: "Bible Characters",
    description: "The people whose faith, courage, and failures fill the pages.",
    pattern: "Joseph's Coat",
    fabrics: ["coral", "gold"],
  },
  {
    id: "life-of-jesus",
    name: "Life of Jesus",
    description: "From Bethlehem to Galilee, the cross, and the empty tomb.",
    pattern: "Carpenter's Wheel",
    fabrics: ["periwinkle", "sage"],
  },
  {
    id: "miracles",
    name: "Miracles & Wonders",
    description: "Parted seas, healed hearts, loaves, fishes, and more.",
    pattern: "Wonder of the World",
    fabrics: ["emerald", "gold"],
  },
  {
    id: "who-said-it",
    name: "Who Said It?",
    description: "Match famous words to the person who spoke them.",
    pattern: "Solomon's Puzzle",
    fabrics: ["navy", "coral"],
  },
  {
    id: "finish-the-verse",
    name: "Finish the Verse",
    description: "Complete well-known verses from the King James Version.",
    pattern: "Tree of Life",
    fabrics: ["sage", "emerald"],
  },
  {
    id: "mixed",
    name: "Mixed Bible Challenge",
    description: "A little of everything, drawn from every Bible subcategory.",
    pattern: "Crazy Quilt",
    fabrics: ["periwinkle", "coral"],
  },
];

export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);
export const getSubcategory = (id: string) => BIBLE_SUBCATEGORIES.find((s) => s.id === id);

/** Translation used for every Finish the Verse question. */
export const VERSE_TRANSLATION = "KJV";
