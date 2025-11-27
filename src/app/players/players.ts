import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PlayerService, Player } from './players.service';
import { ClansService } from '../clan/clan.service';
import { Router } from '@angular/router';
import { getPlayerLevel, playerLevels } from './level';
import { SearchComponent } from '../search/search';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchComponent],
  templateUrl: './players.html',
  styleUrls: ['./players.css']
})
export class Players {
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  playerLevels = playerLevels;

  playerForm = new FormGroup({
    nickname: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  filterForm = new FormGroup({
    levelTitle: new FormControl<string | null>(null)
  });

  searchTerm: string = '';

  constructor(
    private playerService: PlayerService,
    private clansService: ClansService,
    private router: Router
  ) {
    this.refreshPlayers();

    this.filterForm.get('levelTitle')?.valueChanges.subscribe(() => this.applyFilter());
    document.addEventListener('player:changed', () => this.refreshPlayers());
    document.addEventListener('clan:changed', () => this.refreshPlayers());
  }

  getPlayerLevelForPlayer(player: Player) {
    return getPlayerLevel(player.xp ?? 0);
  }

  refreshPlayers() {
    this.players = this.playerService.getAll();
    this.applyFilter();
  }

  // Kombinované filtrovanie podľa levelu a vyhľadávania
  applyFilter() {
    const levelTitle = this.filterForm.get('levelTitle')?.value;
    this.filteredPlayers = this.players.filter(p => {
      const matchesLevel = !levelTitle || this.getPlayerLevelForPlayer(p).level.title === levelTitle;
      const matchesSearch = !this.searchTerm || p.nickname.toLowerCase().startsWith(this.searchTerm.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.applyFilter();
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
