export type AchievementId =
  | "first-steps"
  | "getting-started"
  | "on-a-roll"
  | "perfect-round"
  | "bible-explorer"
  | "quick-thinker"
  | "dedicated-learner"
  | "bible-scholar";

export type Achievement = {
  id: AchievementId;
  name: string;
  description: string;
  icon: "footprints" | "sprout" | "flame" | "crown" | "compass" | "zap" | "calendar" | "scroll";
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-steps", name: "First Steps", description: "Complete your first game.", icon: "footprints" },
  { id: "getting-started", name: "Getting Started", description: "Answer 10 questions correctly.", icon: "sprout" },
  { id: "on-a-roll", name: "On a Roll", description: "Get 5 correct answers in a row.", icon: "flame" },
  { id: "perfect-round", name: "Perfect Round", description: "Answer all 10 questions correctly.", icon: "crown" },
  {
    id: "bible-explorer",
    name: "Bible Explorer",
    description: "Complete a round in three different Bible subcategories.",
    icon: "compass",
  },
  { id: "quick-thinker", name: "Quick Thinker", description: "Complete a Time Challenge round.", icon: "zap" },
  { id: "dedicated-learner", name: "Dedicated Learner", description: "Complete 10 games.", icon: "calendar" },
  { id: "bible-scholar", name: "Bible Scholar", description: "Answer 100 Bible questions correctly.", icon: "scroll" },
];

export const ACHIEVEMENT_IDS = ACHIEVEMENTS.map((a) => a.id);
