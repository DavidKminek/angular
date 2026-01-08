//players.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { getPlayerLevel } from './level';

export interface QuestStub {
  id: string;
  title: string;
  description?: string;
  xp?: number;
}

export interface Player {
  id?: string;
  nickname: string;
  xp: number;
  level?: number;
  clanId?: string;
  profileImage?: string;
  activeQuests?: QuestStub[];
  completedQuests?: QuestStub[];
}

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private firestore = inject(Firestore);
  private playersCollection = collection(this.firestore, 'players');

  private _players = signal<Player[]>([]);

  constructor() {
    this.loadPlayers();
  }

  private loadPlayers() {
    const players$ = collectionData(this.playersCollection, { idField: 'id' }) as Observable<Player[]>;

    players$.pipe(
      map(players => players.sort((a, b) => (b.nickname ?? '').localeCompare(a.nickname ?? '')))
    ).subscribe(players => {
      console.log('[PlayerService] loadPlayers - received', players.length, 'players');
      this._players.set(players);
    });
  }

  players() {
    return this._players.asReadonly();
  }

  getAll(): Player[] {
    return this._players();
  }

  getPlayerById(id: string): Player | undefined {
    return this._players().find(p => p.id === id);
  }

  async addPlayer(nickname: string): Promise<string | undefined> {
    const newPlayer: Player = {
      nickname,
      xp: 0,
      level: 1,
      activeQuests: [],
      completedQuests: []
    };

    try {
      const docRef = await addDoc(this.playersCollection, newPlayer);
      console.log('[PlayerService] addPlayer - created', docRef.id);
      return docRef.id;
    } catch (err) {
      console.error('[PlayerService] addPlayer - error', err);
      return undefined;
    }
  }

  async removePlayer(id: string) {
    if (!id) return;
    const playerDoc = doc(this.firestore, 'players', id);
    await deleteDoc(playerDoc);
  }

  async addQuest(playerId: string, quest: QuestStub) {
    const player = this.getPlayerById(playerId);
    if (!player) return;

    if ((player.activeQuests ?? []).some(q => q.id === quest.id)) return;

    const updatedQuests = [...(player.activeQuests ?? []), quest];
    const playerDoc = doc(this.firestore, 'players', playerId);
    await updateDoc(playerDoc, { activeQuests: updatedQuests });
  }

  async removeQuest(playerId: string, questId: string) {
    const player = this.getPlayerById(playerId);
    if (!player) return;

    const newActive = (player.activeQuests ?? []).filter(q => q.id !== questId);
    const newCompleted = (player.completedQuests ?? []).filter(q => q.id !== questId);

    const totalXP = newCompleted.reduce((sum, q) => sum + (q.xp ?? 0), 0);
    const levelInfo = getPlayerLevel(totalXP);

    const playerDoc = doc(this.firestore, 'players', playerId);
    await updateDoc(playerDoc, {
      activeQuests: newActive,
      completedQuests: newCompleted,
      xp: totalXP,
      level: levelInfo.level.level
    });
  }

  async completeQuest(playerId: string, questId: string) {
    const player = this.getPlayerById(playerId);
    if (!player) return;

    const questIndex = (player.activeQuests ?? []).findIndex(q => q.id === questId);
    if (questIndex === -1) return;

    const quest = player.activeQuests![questIndex];
    const newActive = player.activeQuests!.filter((_, i) => i !== questIndex);
    const newCompleted = [...(player.completedQuests ?? []), quest];

    const totalXP = newCompleted.reduce((sum, q) => sum + (q.xp ?? 0), 0);
    const levelInfo = getPlayerLevel(totalXP);

    const playerDoc = doc(this.firestore, 'players', playerId);
    await updateDoc(playerDoc, { activeQuests: newActive, completedQuests: newCompleted, xp: totalXP, level: levelInfo.level.level });
  }

  async reopenQuest(playerId: string, questId: string) {
    const player = this.getPlayerById(playerId);
    if (!player) return;

    const compIndex = (player.completedQuests ?? []).findIndex(q => q.id === questId);
    if (compIndex === -1) return;

    const quest = player.completedQuests![compIndex];
    const newCompleted = player.completedQuests!.filter((_, i) => i !== compIndex);
    const newActive = [...(player.activeQuests ?? []), quest];

    const totalXP = newCompleted.reduce((sum, q) => sum + (q.xp ?? 0), 0);
    const levelInfo = getPlayerLevel(totalXP);

    const playerDoc = doc(this.firestore, 'players', playerId);
    await updateDoc(playerDoc, { activeQuests: newActive, completedQuests: newCompleted, xp: totalXP, level: levelInfo.level.level });
  }

  async setPlayerClan(playerId: string, clanId?: string) {
    const playerDoc = doc(this.firestore, 'players', playerId);
    await updateDoc(playerDoc, { clanId });
  }

  async addDefaultPlayersIfEmpty() {
    if (this._players().length === 0) {
      const defaults = [
        { nickname: 'Alice', xp: 150, level: 2, activeQuests: [], completedQuests: [] },
        { nickname: 'Bob', xp: 80, level: 1, activeQuests: [], completedQuests: [] },
        { nickname: 'Cara', xp: 250, level: 3, activeQuests: [], completedQuests: [] }
      ];

      for (const p of defaults) {
        await addDoc(this.playersCollection, p);
      }
    }
  }
}
