export interface Quest {
  id: string;
  title: string;
  description?: string; 
  xp: number;
  imageUrl?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}
