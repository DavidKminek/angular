import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Clan } from './clan.interface';

@Injectable({ providedIn: 'root' })
export class ClansService {
  private firestore = inject(Firestore);
  private clansCollection = collection(this.firestore, 'clans');

  private _clans = signal<Clan[]>([]);

  constructor() {
    this.loadClans();
  }

  private loadClans() {
    const clans$ = collectionData(this.clansCollection, { idField: 'id' }) as Observable<Clan[]>;

    clans$.pipe(
      map(clans => clans.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')))
    ).subscribe(clans => {
      this._clans.set(clans);
    });
  }

  clans() {
    return this._clans.asReadonly();
  }

  getAll(): Clan[] {
    return this._clans();
  }

  getById(id: string): Clan | undefined {
    return this._clans().find(c => c.id === id);
  }

  async addClan(clan: Clan) {
    const toAdd = { ...clan } as any;
    delete toAdd.id;
    await addDoc(this.clansCollection, toAdd);
  }

  async removeClan(id: string) {
    if (!id) return;
    const clanDoc = doc(this.firestore, 'clans', id);
    await deleteDoc(clanDoc);
  }

  async addPlayerToClan(clanId: string, playerId: string): Promise<boolean> {
    const clan = this.getById(clanId);
    if (!clan) return false;

    if (!clan.memberIds) clan.memberIds = [];
    if (clan.memberIds.includes(playerId)) return false;
    if (clan.memberIds.length >= clan.capacity) return false;

    const updated = [...clan.memberIds, playerId];
    const clanDoc = doc(this.firestore, 'clans', clanId);
    await updateDoc(clanDoc, { memberIds: updated });
    return true;
  }

  async removePlayerFromClan(clanId: string, playerId: string): Promise<boolean> {
    const clan = this.getById(clanId);
    if (!clan) return false;

    const oldLength = (clan.memberIds ?? []).length;
    const updated = (clan.memberIds ?? []).filter(id => id !== playerId);

    if (updated.length === oldLength) return false;

    const clanDoc = doc(this.firestore, 'clans', clanId);
    await updateDoc(clanDoc, { memberIds: updated });
    return true;
  }

  async addDefaultClansIfEmpty() {
    if (this._clans().length === 0) {
      const defaults = [
        { name: 'Warriors', description: 'Strong and proud.', capacity: 5, memberIds: [] },
        { name: 'Rangers', description: 'Stealth and speed.', capacity: 4, memberIds: [] }
      ];

      for (const c of defaults) {
        await addDoc(this.clansCollection, c);
      }
    }
  }
}
