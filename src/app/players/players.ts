import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from './players.service';
import { Player } from './player.interface';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './players.html',
  styleUrls: ['./players.css']
})
export class Players {
  players: Player[] = [];

  constructor(private playerService: PlayerService) {
    this.refreshPlayers();
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
  }

  removePlayer(id: number) {
    this.playerService.removePlayer(id);
    this.refreshPlayers();
  }

  refreshPlayers() {
    this.players = this.playerService.getAll();
  }
}
