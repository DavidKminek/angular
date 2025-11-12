import { ActivatedRoute } from '@angular/router';
import { ClansService } from './clan.service';
import { Clan } from './clan.interface';
import { Player } from '../players/player.interface';

export class ClanDetailPage {
  clan?: Clan;

  constructor(private route: ActivatedRoute, private clanService: ClansService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.clan = this.clanService.getById(id);
  }

  removeMember(playerId: number) {
    if (!this.clan) return;
    this.clanService.removePlayer(this.clan.id, playerId);
  }

  addMember(player: Player) {
    if (!this.clan) return;
    this.clanService.addPlayer(this.clan.id, player);
  }
}
