import { Injectable, signal } from '@angular/core';
import { Clan } from './clan.interface';

@Injectable({ providedIn: 'root' })
export class ClansService {
  clans = signal<Clan[]>([
    { id: 1, name: 'Iceborn', description: 'Frost warriors', capacity: 10, image: '', memberIds: [1] }
  ]);

  addClan(): Clan {
    const nextId = (this.clans().length ? Math.max(...this.clans().map(c => c.id)) : 0) + 1;
    const newClan: Clan = { id: nextId, name: `Clan ${nextId}`, description: '', capacity: 5, image: '', memberIds: [] };
    this.clans.update(cs => [...cs, newClan]);
    return newClan;
  }

  deleteClan(id: number) {
    this.clans.update(cs => cs.filter(c => c.id !== id));
  }

  getClanById(id: number) {
    return this.clans().find(c => c.id === id);
  }

  addMember(clanId: number, playerId: number): boolean {
    const clan = this.getClanById(clanId);
    if (!clan) return false;
    if (clan.memberIds.length >= clan.capacity) return false;
    this.clans.update(cs => cs.map(c => c.id === clanId ? ({ ...c, memberIds: [...c.memberIds, playerId] }) : c));
    return true;
  }

  removeMember(clanId: number, playerId: number) {
    this.clans.update(cs => cs.map(c => c.id === clanId ? ({ ...c, memberIds: c.memberIds.filter(id => id !== playerId) }) : c));
  }
}
