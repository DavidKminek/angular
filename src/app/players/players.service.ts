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
  xp: number;
  clanId?: number;
  profileImage?: string;
  activeQuests?: QuestStub[];
  completedQuests?: QuestStub[];
}

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private _players = signal<Player[]>([
    { id: 1, nickname: 'Alice', xp: 0, activeQuests: [], completedQuests: [] },
    { id: 2, nickname: 'Bob', xp: 0, activeQuests: [], completedQuests: [] },
    { id: 3, nickname: 'Cara', xp: 0, activeQuests: [], completedQuests: [] }
  ]);

  constructor(private clansService: ClansService) {}

  getAll(): Player[] { return this._players(); }
  getPlayerById(id: number): Player | undefined { return this._players().find(p => p.id === id); }
  addPlayer(player: Player) { this._players.update(curr => [...curr, player]); }

  removePlayer(id: number) {
    this.clansService.getAll().forEach(clan => {
      if (clan.memberIds?.includes(id)) clan.memberIds = clan.memberIds.filter(pid => pid !== id);
    });
    this.clansService['_clans'].update(c => [...c]);
    this._players.update(curr => curr.filter(p => p.id !== id));
  }

  addQuest(playerId: number, quest: QuestStub) {
    const players = this._players();
    const idx = players.findIndex(p => p.id === playerId);
    if (idx === -1) return;
    const p = players[idx];
    const newActive = (p.activeQuests ?? []).concat([quest]);
    const newPlayers = players.slice();
    newPlayers[idx] = { ...p, activeQuests: newActive };
    this._players.set(newPlayers);
  }

  removeQuest(playerId: number, questId: number) {
    const players = this._players();
    const idx = players.findIndex(p => p.id === playerId);
    if (idx === -1) return;
    const p = players[idx];
    const newActive = (p.activeQuests ?? []).filter(q => q.id !== questId);
    const newCompleted = (p.completedQuests ?? []).filter(q => q.id !== questId);
    const newPlayers = players.slice();
    newPlayers[idx] = { ...p, activeQuests: newActive, completedQuests: newCompleted };
    this._players.set(newPlayers);
  }

  completeQuest(playerId: number, questId: number) {
    const players = this._players();
    const idx = players.findIndex(p => p.id === playerId);
    if (idx === -1) return;
    const player = players[idx];
    const quest = (player.activeQuests ?? []).find(q => q.id === questId);
    if (!quest) return;
    const newActive = (player.activeQuests ?? []).filter(q => q.id !== questId);
    const newCompleted = (player.completedQuests ?? []).concat([quest]);
    const newPlayers = players.slice();
    newPlayers[idx] = { ...player, activeQuests: newActive, completedQuests: newCompleted };
    this._players.set(newPlayers);
  }

  reopenQuest(playerId: number, questId: number) {
    const players = this._players();
    const idx = players.findIndex(p => p.id === playerId);
    if (idx === -1) return;
    const player = players[idx];
    const quest = (player.completedQuests ?? []).find(q => q.id === questId);
    if (!quest) return;
    const newCompleted = (player.completedQuests ?? []).filter(q => q.id !== questId);
    const newActive = (player.activeQuests ?? []).concat([quest]);
    const newPlayers = players.slice();
    newPlayers[idx] = { ...player, activeQuests: newActive, completedQuests: newCompleted };
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
