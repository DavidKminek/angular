import { Injectable, signal } from '@angular/core';
import { Clan } from './clan.interface';
import { Player } from '../players/player.interface';

@Injectable({ providedIn: 'root' })
export class ClansService {
  private clans = signal<Clan[]>([]);

  getAll() {
    return this.clans;
  }

  getById(id: number) {
    return this.clans().find(c => c.id === id);
  }

  addClan(clan: Clan) {
    this.clans.update(curr => [...curr, clan]);
  }

  removeClan(id: number) {
    this.clans.update(curr => curr.filter(c => c.id !== id));
  }

  addPlayer(clanId: number, player: Player) {
    const clan = this.getById(clanId);
    if (!clan) return;
    if (!clan.members) clan.members = [];
    if (clan.members.length >= clan.capacity) return;
    clan.members.push(player);
    this.clans.update(curr => [...curr]);
  }

  removePlayer(clanId: number, playerId: number) {
    const clan = this.getById(clanId);
    if (!clan || !clan.members) return;
    clan.members = clan.members.filter(p => p.id !== playerId);
    this.clans.update(curr => [...curr]);
  }
}
  