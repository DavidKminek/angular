//players.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { signal, computed } from '@angular/core';

import { PlayerService, Player } from './players.service';
import { ClansService } from '../clan/clan.service';
import { playerLevels, getPlayerLevel } from './level';
import { SearchComponent } from '../search/search';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SearchComponent],
  templateUrl: './players.html',
})
export class PlayersPage {
  players = signal<Player[]>([]);

  playerForm = new FormGroup({
    nickname: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], nonNullable: true })
  });

  filterForm = new FormGroup({
    levelTitle: new FormControl<string | null>(null)
  });

  search = signal('');

  playerLevels = playerLevels;

  filteredPlayers = computed(() => {
    const levelTitle = this.filterForm.get('levelTitle')?.value;
    const s = this.search().toLowerCase();
    return this.players().filter(p => {
      if (levelTitle) {
        const lvl = getPlayerLevel(p.xp ?? 0);
        if (lvl.level.title !== levelTitle) return false;
      }
      if (s && !p.nickname.toLowerCase().includes(s)) return false;
      return true;
    });
  });

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private clansService: ClansService
  ) {
    this.refresh();
  }

  refresh() {
    this.players.set(this.playerService.getAll());
  }

  createPlayer() {
    if (this.playerForm.invalid) {
      this.playerForm.markAllAsTouched();
      return;
    }

    const val = this.playerForm.getRawValue();
    const newPlayer: Player = {
      id: Date.now(),
      nickname: val.nickname!,
      xp: 0,
      activeQuests: [],
      completedQuests: []
    };

    this.playerService.addPlayer(newPlayer);
    this.playerForm.reset();
    this.refresh();
  }

  onSearchChange(value: string) {
    this.search.set(value ?? '');
  }

  goToDetails(id: number) {
    this.router.navigate(['/players', id]);
  }

  removePlayer(id: number) {
    this.playerService.removePlayer(id);
    // Remove from clans
    this.clansService.getAll().forEach(c => {
      if (c.memberIds.includes(id)) this.clansService.removePlayerFromClan(c.id, id);
    });
    this.refresh();
  }

  getPlayerLevelForPlayer(p: Player) {
    return getPlayerLevel(p.xp ?? 0);
  }

  getClanName(player: Player) {
    if (!player.clanId) return '-';
    const clan = this.clansService.getById(player.clanId);
    return clan?.name ?? '-';
  }
}
