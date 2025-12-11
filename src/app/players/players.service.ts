// src/app/players/players.service.ts

import { Injectable, signal } from '@angular/core';
import { ClansService } from '../clan/clan.service';

export interface QuestStub {
  id: string;           // STRING – Firestore ID
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
    { id: 2, nickname: 'Bob',   xp: 0, activeQuests: [], completedQuests: [] },
    { id: 3, nickname: 'Cara',  xp: 0, activeQuests: [], completedQuests: [] }
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
    // Odstráni hráča aj z klanov
    this.clansService.getAll().forEach(clan => {
      if (clan.memberIds?.includes(id)) {
        clan.memberIds = clan.memberIds.filter(pid => pid !== id);
      }
    });
    this._players.update(curr => curr.filter(p => p.id !== id));
  }

  // VŠETKY METÓDY S QUESTMI MAJÚ TERAZ questId: string !!!
  addQuest(playerId: number, quest: QuestStub) {
    this._players.update(players => {
      return players.map(p => {
        if (p.id !== playerId) return p;

        const alreadyHas = (p.activeQuests ?? []).some(q => q.id === quest.id);
        if (alreadyHas) return p;

        return {
          ...p,
          activeQuests: [...(p.activeQuests ?? []), quest]
        };
      });
    });
  }

  removeQuest(playerId: number, questId: string) {
    this._players.update(players => {
      return players.map(p => {
        if (p.id !== playerId) return p;
        return {
          ...p,
          activeQuests: (p.activeQuests ?? []).filter(q => q.id !== questId),
          completedQuests: (p.completedQuests ?? []).filter(q => q.id !== questId)
        };
      });
    });
  }

  completeQuest(playerId: number, questId: string) {
    this._players.update(players => {
      return players.map(p => {
        if (p.id !== playerId) return p;

        const questIndex = (p.activeQuests ?? []).findIndex(q => q.id === questId);
        if (questIndex === -1) return p;

        const quest = p.activeQuests![questIndex];
        const newActive = p.activeQuests!.filter((_, i) => i !== questIndex);
        const newCompleted = [...(p.completedQuests ?? []), quest];

        return { ...p, activeQuests: newActive, completedQuests: newCompleted };
      });
    });
  }

  reopenQuest(playerId: number, questId: string) {
    this._players.update(players => {
      return players.map(p => {
        if (p.id !== playerId) return p;

        const questIndex = (p.completedQuests ?? []).findIndex(q => q.id === questId);
        if (questIndex === -1) return p;

        const quest = p.completedQuests![questIndex];
        const newCompleted = p.completedQuests!.filter((_, i) => i !== questIndex);
        const newActive = [...(p.activeQuests ?? []), quest];

        return { ...p, activeQuests: newActive, completedQuests: newCompleted };
      });
    });
  }

  setPlayerClan(playerId: number, clanId?: number) {
    this._players.update(players => {
      return players.map(p => p.id === playerId ? { ...p, clanId } : p);
    });
  }
}