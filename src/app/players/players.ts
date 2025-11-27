import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PlayerService, Player } from './players.service';
import { ClansService } from '../clan/clan.service';
import { Router } from '@angular/router';
import { getPlayerLevel } from './level';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './players.html',
  styleUrls: ['./players.css']
})
export class Players {
  players: Player[] = [];

  playerForm = new FormGroup({
    nickname: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])
  });

  constructor(
    private playerService: PlayerService,
    private clansService: ClansService,
    private router: Router
  ) {
    this.refreshPlayers();

    document.addEventListener('player:changed', () => this.refreshPlayers());
    document.addEventListener('clan:changed', () => this.refreshPlayers());
  }

  getPlayerLevelForPlayer(player: Player) {
    // vždy vracia platný objekt
    return getPlayerLevel(player.xp ?? 0);
  }

  refreshPlayers() {
    this.players = this.playerService.getAll();
  }

  getClanName(player: Player): string {
    if (!player.clanId) return '-';
    const clan = this.clansService.getById(player.clanId);
    return clan ? clan.name : '-';
  }

  createPlayer() {
    if (this.playerForm.invalid) return;

    const newPlayer: Player = {
      id: Date.now(),
      nickname: this.playerForm.value.nickname!,
      xp: 0,
      activeQuests: [],
      completedQuests: []
    };

    this.playerService.addPlayer(newPlayer);
    this.playerForm.reset();
    document.dispatchEvent(new CustomEvent('player:changed'));
  }

  removePlayer(id: number) {
    this.playerService.removePlayer(id);
    document.dispatchEvent(new CustomEvent('player:changed'));
  }

  goToDetails(playerId: number) {
    this.router.navigate(['/players', playerId]);
  }
}
