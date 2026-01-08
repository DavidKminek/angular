//level.ts
export interface PlayerLevel {
  level: number;
  xpRequired: number;
  title: string;
}

export const playerLevels: PlayerLevel[] = [
  { level: 1, xpRequired: 0, title: 'Novice' },
  { level: 2, xpRequired: 100, title: 'Apprentice' },
  { level: 3, xpRequired: 300, title: 'Adept' },
  { level: 4, xpRequired: 600, title: 'Expert' },
  { level: 5, xpRequired: 1000, title: 'Master' },
  { level: 6, xpRequired: 2000, title: 'Grandmaster' },
  { level: 7, xpRequired: 3500, title: 'Legend' },
  { level: 8, xpRequired: 5500, title: 'Mythic' },
  { level: 9, xpRequired: 8000, title: 'Immortal' },
  { level: 10, xpRequired: 12000, title: 'Eternal' }
];

export function getPlayerLevel(xp: number): { level: PlayerLevel; nextLevel?: PlayerLevel; progress: number } {
  let currentLevel = playerLevels[0];
  let nextLevel: PlayerLevel | undefined;

  for (let i = 0; i < playerLevels.length; i++) {
    if (xp >= playerLevels[i].xpRequired) {
      currentLevel = playerLevels[i];
      nextLevel = playerLevels[i + 1];
    }
  }

  let progress = 0;
  if (nextLevel) {
    const xpForCurrent = currentLevel.xpRequired;
    const xpForNext = nextLevel.xpRequired;
    progress = ((xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100;
  } else {
    progress = 100;
  }

  return { level: currentLevel, nextLevel, progress };
}
