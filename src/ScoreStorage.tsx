const SCORES_KEY = "suika_best_scores";

export type ScoreEntry = { pseudo: string; score: number };

export function getBestScores(): ScoreEntry[] {
  const scores = localStorage.getItem(SCORES_KEY);
  return scores ? JSON.parse(scores) : [];
}

export function saveBestScores(scores: ScoreEntry[]) {
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

export function addScore(newEntry: ScoreEntry): ScoreEntry[] {
  let scores = getBestScores();
  scores.push(newEntry);
  scores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
  saveBestScores(scores);
  return scores;
}
