// clan.service.ts
import { Injectable, signal } from '@angular/core';
import { Clan } from './clan.interface';

@Injectable({ providedIn: 'root' })
export class ClansService {
  private _clans = signal<Clan[]>([
    { id: 1, name: 'Warriors', description: 'Strong and proud.', capacity: 5, memberIds: [] },
    { id: 2, name: 'Rangers', description: 'Stealth and speed.', capacity: 4, memberIds: [] }
  ]);

  getAll(): Clan[] {
    return this._clans();
  }

  getById(id: number): Clan | undefined {
    return this._clans().find(c => c.id === id);
  }

  addClan(clan: Clan) {
    if (!clan.memberIds) clan.memberIds = [];
    this._clans.update(curr => [...curr, clan]);
  }

  removeClan(id: number) {
    this._clans.update(curr => curr.filter(c => c.id !== id));
  }

  addPlayerToClan(clanId: number, playerId: number): boolean {
    const clan = this.getById(clanId);
    if (!clan) return false;
    if (!clan.memberIds) clan.memberIds = [];
    if (clan.memberIds.includes(playerId)) return false;
    if (clan.memberIds.length >= clan.capacity) return false;
    clan.memberIds.push(playerId);
    this._clans.update(c => [...c]);
    return true;
  }

  removePlayerFromClan(clanId: number, playerId: number): boolean {
    const clan = this.getById(clanId);
    if (!clan || !clan.memberIds) return false;
    const prevLen = clan.memberIds.length;
    clan.memberIds = clan.memberIds.filter(id => id !== playerId);
    if (clan.memberIds.length === prevLen) return false;
    this._clans.update(c => [...c]);
    return true;
  }
}
