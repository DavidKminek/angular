import { Injectable, signal } from '@angular/core';
import { Player, Quest } from './player.interface';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private _players = signal<Player[]>([
    { id: 1, nickname: 'Alice', level: 5, quests: [] },
    { id: 2, nickname: 'Bob', level: 3, quests: [] }
  ]);

  getAll(): Player[] {
    return this._players();
  }

  getPlayerById(id: number): Player | undefined {
    return this._players().find(p => p.id === id);
  }

  addPlayer(player: Player) {
    this._players.update(curr => [...curr, player]);
  }

  removePlayer(id: number) {
    this._players.update(curr => curr.filter(p => p.id !== id));
  }

  addQuest(playerId: number, quest: Quest) {
    const player = this.getPlayerById(playerId);
    if (!player) return;
    if (!player.quests) player.quests = [];
    player.quests.push(quest);
    this._players.update(curr => [...curr]);
  }

  removeQuest(playerId: number, questId: number) {
    const player = this.getPlayerById(playerId);
    if (!player || !player.quests) return;
    player.quests = player.quests.filter(q => q.id !== questId);
    this._players.update(curr => [...curr]);
  }
}
