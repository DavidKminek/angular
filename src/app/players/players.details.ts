import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayersService } from './players.service';
import { Player } from './players.service';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './players.details.html',
  styleUrls: ['./players.details.css']
})
export class PlayerDetail {
  player: Player | undefined;

  constructor(private route: ActivatedRoute, private playersService: PlayersService) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.player = this.playersService.getPlayerById(id);
  }
}
