import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClansService } from './clan.service';
import { PlayerService, Player } from '../players/players.service';
import { Clan } from './clan.interface';
import { getPlayerLevel } from '../players/level';

@Component({
  selector: 'app-clan-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clan-detail.html',
  styleUrls: ['./clan-detail.css']
})
export class ClanDetailPage implements OnInit {

  clan?: Clan;
  availablePlayers: Player[] = [];

  addPlayerForm = new FormGroup({
    playerId: new FormControl<string | null>(null, Validators.required)
  });

  constructor(
    private route: ActivatedRoute,
    private clansService: ClansService,
    public playerService: PlayerService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.clan = this.clansService.getById(id);
    if (!this.clan) return;

    this.refreshAvailablePlayers();
  }

  refreshAvailablePlayers() {
    if (!this.clan) return;

    const allPlayers = this.playerService.getAll();
    this.availablePlayers = allPlayers.filter(
      p => (p.id != null) && !this.clansService.getAll().some(c => c.memberIds.includes(p.id!))
    );
  }

  addPlayer() {
    if (!this.clan) return;

    const playerId = this.addPlayerForm.value.playerId!;
    if (!playerId) return;

    this.clansService.addPlayerToClan(this.clan.id, playerId).then(success => {
      if (success) {
        this.playerService.setPlayerClan(playerId, this.clan!.id);
        this.addPlayerForm.reset();
        this.refreshAvailablePlayers();
      } else {
        alert('Cannot add player: either clan is full or player already in another clan.');
      }
    });
  }

  removePlayer(playerId: string) {
    if (!this.clan) return;

    this.clansService.removePlayerFromClan(this.clan.id, playerId).then(success => {
      if (success) {
        this.playerService.setPlayerClan(playerId, undefined);
        this.refreshAvailablePlayers();
      }
    });
  }

  goToPlayerDetail(playerId: string) {
    this.router.navigate(['/players', playerId]);
  }

  getPlayerLevelForPlayer(player?: Player | { xp?: number }) {
    return getPlayerLevel(player?.xp ?? 0);
  }
}
