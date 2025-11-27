import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlayerService, Player, QuestStub } from './players.service';
import { ClansService } from '../clan/clan.service';
import { QuestsService } from '../quests/quest.service';
import { Clan } from '../clan/clan.interface';
import { Quest } from '../quests/quest-interface';
import { getPlayerLevel } from './level';

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
  levelInfo?: { level: any; nextLevel?: any; progress: number };

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

    if (!this.player) return;
    if (this.player.clanId) this.clan = this.clansService.getById(this.player.clanId);

    this.allQuests = this.questsService.quests();
    this.updateLevel();
  }

  updateLevel() {
    if (!this.player) return;
    const totalXP = (this.player.completedQuests ?? []).reduce((sum, q) => sum + (q.xp ?? 0), 0);
    this.player.xp = totalXP;
    this.levelInfo = getPlayerLevel(totalXP);
  }

  addQuest() {
    if (!this.player || this.selectedQuestId == null) return;
    if ((this.player.activeQuests ?? []).some(q => q.id === this.selectedQuestId)) return;

    const quest = this.questsService.getQuestById(this.selectedQuestId);
    if (!quest) return;

    const questStub: QuestStub = { id: quest.id, title: quest.title, description: quest.description, xp: quest.xp };
    this.playerService.addQuest(this.player.id, questStub);
    this.player = this.playerService.getPlayerById(this.player.id);
    this.updateLevel();
  }

  removeQuest(questId: number) {
    if (!this.player) return;
    this.playerService.removeQuest(this.player.id, questId);
    this.player = this.playerService.getPlayerById(this.player.id);
    this.updateLevel();
  }

  completeQuest(questId: number) {
    if (!this.player) return;
    this.playerService.completeQuest(this.player.id, questId);
    this.player = this.playerService.getPlayerById(this.player.id);
    this.updateLevel();
  }

  reopenQuest(questId: number) {
    if (!this.player) return;
    this.playerService.reopenQuest(this.player.id, questId);
    this.player = this.playerService.getPlayerById(this.player.id);
    this.updateLevel();
  }

  goToClan() {
    if (!this.clan) return;
    this.router.navigate(['/clan', this.clan.id]);
  }
}
