export interface Quest {
  id: number;
  title: string;
  description: string;
  xp: number;
  imageUrl?: string; // voliteľný obrázok
  difficulty?: 'easy' | 'medium' | 'hard'; // voliteľný atribút
}
