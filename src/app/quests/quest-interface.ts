export interface Quest {
  id: number;
  title: string;
  description: string;
  xp: number;
  imageUrl?: string; 
  difficulty?: 'easy' | 'medium' | 'hard'; 
}
