import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { PlayerService, Player } from './players.service';
import { ClansService } from '../clan/clan.service';
import { getPlayerLevel, playerLevels } from './level';
import { SearchComponent } from '../search/search';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [ReactiveFormsModule, SearchComponent],
  templateUrl: './players.html',
  styleUrls: ['./players.css']
})
export class Players {

  // --- DATA SIGNALS ---
  players = signal<Player[]>([]);
  search = signal('');
  playerLevels = playerLevels;

  // --- SIGNAL FORM: Create Player ---
  playerForm = new FormGroup({
    nickname: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)]
    })
  });

  // --- SIGNAL FORM: Filters ---
  filterForm = new FormGroup({
    levelTitle: new FormControl<string | null>(null)
  });

  // --- COMPUTED: filtered players ---
  filteredPlayers = computed(() => {
    const level = this.filterForm.controls['levelTitle'].value;
    const search = this.search().toLowerCase();

    return this.players().filter(p => {
      const levelMatch =
        !level || getPlayerLevel(p.xp ?? 0).level.title === level;

      const searchMatch =
        !search || p.nickname.toLowerCase().startsWith(search);

      return levelMatch && searchMatch;
    });
  });

  constructor(
    private playerService: PlayerService,
    private clansService: ClansService,
    private router: Router
  ) {
    this.refreshPlayers();
  }

  refreshPlayers() {
    this.players.set(this.playerService.getAll());
  }

  onSearchChange(value: string) {
    this.search.set(value);
  }

  getPlayerLevelForPlayer(player: Player) {
    return getPlayerLevel(player.xp ?? 0);
  }

  getClanName(player: Player): string {
    if (!player.clanId) return '-';
    const clan = this.clansService.getById(player.clanId);
    return clan ? clan.name : '-';
  }

  createPlayer() {
    if (this.playerForm.invalid) {
      this.playerForm.markAllAsTouched();
      return;
    }

    const nickname = this.playerForm.controls['nickname'].value!;

    const newPlayer: Player = {
      id: Date.now(),
      nickname,
      xp: 0,
      activeQuests: [],
      completedQuests: []
    };

    this.playerService.addPlayer(newPlayer);
    this.playerForm.reset();

    this.refreshPlayers();
  }

  removePlayer(id: number) {
    this.playerService.removePlayer(id);
    this.refreshPlayers();
  }

  goToDetails(id: number) {
    this.router.navigate(['/players', id]);
  }
}
