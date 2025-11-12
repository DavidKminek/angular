import { Injectable, signal } from '@angular/core';

export interface Player {  
  id: number;
  nickname: string;
  level: number;
  clan?: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  players = signal<Player[]>([
    { id: 1, nickname: 'Arthas', level: 10, clan: 'Iceborn', image: 'https://placehold.co/100x100' },
    { id: 2, nickname: 'Jaina', level: 8, clan: 'Frostwind', image: 'https://placehold.co/100x100' },
    { id: 3, nickname: 'Thrall', level: 12, clan: 'Earthshakers', image: 'https://placehold.co/100x100' }
  ]);

  getPlayerById(id: number): Player | undefined {
    return this.players().find(p => p.id === id);
  }

  addPlayer() {
    const nextId = this.players().length > 0
      ? Math.max(...this.players().map(p => p.id)) + 1
      : 1;
    const newPlayer: Player = {
      id: nextId,
      nickname: `Player ${nextId}`,
      level: 1,
      clan: '',
      image: 'https://placehold.co/100x100'
    };
    this.players.update(players => [...players, newPlayer]);
  }

  deletePlayer(id: number) {
    this.players.update(players => players.filter(p => p.id !== id));
  }
}
