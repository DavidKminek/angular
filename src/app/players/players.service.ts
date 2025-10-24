import { Injectable, signal } from '@angular/core';
import { Player } from './player.interface';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  players = signal<Player[]>([
    { id: 1, nickname: 'Arthas', level: 10, clan: 'Frostwolves'},
    { id: 2, nickname: 'Sylvanas', level: 12, clan: 'Dark Rangers' },
    { id: 3, nickname: 'Thrall', level: 15, clan: 'Frostwolves' }
  ]);

  addPlayer() {
    const newPlayer: Player = {
      id: Date.now(),
      nickname: `Player${Math.floor(Math.random() * 100)}`,
      level: 1
    };
    this.players.update(p => [...p, newPlayer]);
  }

  deletePlayer(id: number) {
    this.players.update(p => p.filter(player => player.id !== id));
  }

  getPlayerById(id: number): Player | undefined {
    return this.players().find(p => p.id === id);
  }
}
