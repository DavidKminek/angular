import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClansService } from './clan.service';
import { PlayerService, Player } from '../players/players.service';
import { Clan } from './clan.interface';

@Component({
  selector: 'app-clan-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clan-detail.html',
  styleUrls: ['./clan-detail.css']
})
export class ClanDetailPage implements OnInit {
  clan?: Clan;
  availablePlayers: Player[] = [];
  selectedPlayerId?: number;

  constructor(
    private route: ActivatedRoute,
    private clansService: ClansService,
    public playerService: PlayerService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.clan = this.clansService.getById(id);
    if (!this.clan) return;

    this.refreshAvailablePlayers();
  }

  refreshAvailablePlayers() {
    if (!this.clan) return;
    const allPlayers = this.playerService.getAll();
    // Hráči, ktorí ešte nie sú v žiadnom clane
    this.availablePlayers = allPlayers.filter(p => !this.clansService.getAll().some(c => c.memberIds?.includes(p.id)));
  }

  addPlayer() {
    if (!this.clan || this.selectedPlayerId == null) return;

    const success = this.clansService.addPlayerToClan(this.clan.id, this.selectedPlayerId);
    if (success) {
      this.playerService.setPlayerClan(this.selectedPlayerId, this.clan.id);
      this.selectedPlayerId = undefined;
      this.refreshAvailablePlayers();
    } else {
      alert('Cannot add player: either clan is full or player already in another clan.');
    }
  }

  removePlayer(playerId: number) {
    if (!this.clan) return;

    const success = this.clansService.removePlayerFromClan(this.clan.id, playerId);
    if (success) {
      this.playerService.setPlayerClan(playerId, undefined);
      this.refreshAvailablePlayers();
    }
  }

  goToPlayerDetail(playerId: number) {
    this.router.navigate(['/players', playerId]);
  }
}
