export interface Player {
  id: number;
  nickname: string;
  level: number;
  clanId?: number;
  profileImage?: string;
  quests?: Quest[];
}

export interface Quest {
  id: number;
  title: string;
  description?: string;
  xp?: number;
}
