import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayersService } from './players.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './players.html',
  styleUrls: ['./players.css']
})
export class Players {  
  constructor(public playersService: PlayersService) {}

  addPlayer() {
    this.playersService.addPlayer();
  }

  deletePlayer(id: number) {
    this.playersService.deletePlayer(id);
  }
}
