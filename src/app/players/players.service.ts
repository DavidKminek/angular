// players.service.ts
import { Injectable, signal } from '@angular/core';
import { ClansService } from '../clan/clan.service';

export interface QuestStub {
  id: number;
  title: string;
  description?: string;
  xp?: number;
}

export interface Player {
  id: number;
  nickname: string;
  level: number;
  clanId?: number;
  profileImage?: string;
  quests?: QuestStub[];
}

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private _players = signal<Player[]>([
    { id: 1, nickname: 'Alice', level: 5, quests: [] },
    { id: 2, nickname: 'Bob', level: 3, quests: [] },
    { id: 3, nickname: 'Cara', level: 2, quests: [] }
  ]);

  constructor(private clansService: ClansService) {}

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
    // odstráni hráča zo všetkých clanov
    this.clansService.getAll().forEach(clan => {
      if (clan.memberIds?.includes(id)) {
        clan.memberIds = clan.memberIds.filter(pid => pid !== id);
      }
    });
    this.clansService['_clans'].update(c => [...c]); // refresh signálu

    // odstráni hráča zo zoznamu
    this._players.update(curr => curr.filter(p => p.id !== id));
  }

  addQuest(playerId: number, quest: QuestStub) {
    const players = this._players();
    const idx = players.findIndex(p => p.id === playerId);
    if (idx === -1) return;
    const p = players[idx];
    const newQuests = (p.quests ?? []).concat([quest]);
    const newPlayers = players.slice();
    newPlayers[idx] = { ...p, quests: newQuests };
    this._players.set(newPlayers);
  }

  removeQuest(playerId: number, questId: number) {
    const players = this._players();
    const idx = players.findIndex(p => p.id === playerId);
    if (idx === -1) return;
    const p = players[idx];
    const newQuests = (p.quests ?? []).filter(q => q.id !== questId);
    const newPlayers = players.slice();
    newPlayers[idx] = { ...p, quests: newQuests };
    this._players.set(newPlayers);
  }

  setPlayerClan(playerId: number, clanId?: number) {
    const players = this._players();
    const idx = players.findIndex(p => p.id === playerId);
    if (idx === -1) return;
    const p = players[idx];
    const newPlayers = players.slice();
    newPlayers[idx] = { ...p, clanId };
    this._players.set(newPlayers);
  }
}
