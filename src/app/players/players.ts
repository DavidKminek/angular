import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService, Player } from './players.service';
import { ClansService } from '../clan/clan.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './players.html',
  styleUrls: ['./players.css']
})
export class Players {
  players: Player[] = [];

  constructor(private playerService: PlayerService, private clansService: ClansService) {
    this.refreshPlayers();

    // automatický refresh pri udalostiach
    document.addEventListener('player:changed', () => this.refreshPlayers());
    document.addEventListener('clan:changed', () => this.refreshPlayers());
  }

  refreshPlayers() {
    this.players = this.playerService.getAll();
  }

  getClanName(player: Player): string {
    if (!player.clanId) return '-';
    const clan = this.clansService.getById(player.clanId);
    return clan ? clan.name : '-';
  }

  addPlayer() {
    const newPlayer: Player = {
      id: Date.now(),
      nickname: 'New Player',
      level: 1,
      quests: []
    };
    this.playerService.addPlayer(newPlayer);
    this.refreshPlayers();
    document.dispatchEvent(new CustomEvent('player:changed'));
  }

  removePlayer(id: number) {
    this.playerService.removePlayer(id);
    this.refreshPlayers();
    document.dispatchEvent(new CustomEvent('player:changed'));
  }
}
