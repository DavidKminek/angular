import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlayerService, Player, QuestStub } from './players.service';
import { ClansService } from '../clan/clan.service';
import { QuestsService } from '../quests/quest.service';
import { Clan } from '../clan/clan.interface';
import { Quest } from '../quests/quest-interface';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './players.details.html',
  styleUrls: ['./players.details.css']
})
export class PlayerDetail implements OnInit {
  player?: Player;
  clan?: Clan;
  allQuests: Quest[] = [];
  selectedQuestId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private clansService: ClansService,
    private questsService: QuestsService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.player = this.playerService.getPlayerById(id);

    if (this.player?.clanId) {
      this.clan = this.clansService.getById(this.player.clanId);
    }

    this.allQuests = this.questsService.quests();
  }

  addQuest() {
    if (!this.player || this.selectedQuestId == null) return;
    if ((this.player.quests ?? []).some(q => q.id === this.selectedQuestId)) return;

    const quest = this.questsService.getQuestById(this.selectedQuestId);
    if (!quest) return;

    const questStub: QuestStub = {
      id: quest.id,
      title: quest.title,
      description: quest.description,
      xp: quest.xp
    };

    this.playerService.addQuest(this.player.id, questStub);
    this.player = this.playerService.getPlayerById(this.player.id);
  }

  removeQuest(questId: number) {
    if (!this.player) return;
    this.playerService.removeQuest(this.player.id, questId);
    this.player = this.playerService.getPlayerById(this.player.id);
  }

  goToClan() {
    if (!this.clan) return;
    this.router.navigate(['/clan', this.clan.id]);
  }
}
