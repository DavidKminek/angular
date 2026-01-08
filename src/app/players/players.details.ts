//players.details.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { PlayerService, Player, QuestStub } from './players.service';
import { ClansService } from '../clan/clan.service';
import { QuestsService } from '../quests/quest.service';
import { Clan } from '../clan/clan.interface';
import { Quest } from '../quests/quest-interface';
import { getPlayerLevel, PlayerLevel } from './level';

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
  selectedQuestId?: string;                    

  levelInfo?: { level: PlayerLevel; nextLevel?: PlayerLevel; progress: number };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private clansService: ClansService,
    private questsService: QuestsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.player = this.playerService.getPlayerById(id);

    if (!this.player) return;

    if (this.player.clanId) {
      this.clan = this.clansService.getById(this.player.clanId);
    }

    this.allQuests = this.questsService.quests();
    this.updateLevel();
  }

  updateLevel(): void {
    if (!this.player) return;

    const totalXP = (this.player.completedQuests ?? [])
      .reduce((sum, q) => sum + (q.xp ?? 0), 0);

    this.player.xp = totalXP;
    this.levelInfo = getPlayerLevel(totalXP);
  }

  async addQuest(): Promise<void> {
    if (!this.player || !this.selectedQuestId) return;

    const quest = this.questsService.getQuestById(this.selectedQuestId);
    if (!quest) return;

    if ((this.player.activeQuests ?? []).some(q => q.id === this.selectedQuestId)) return;

    const stub: QuestStub = {
      id: quest.id!,
      title: quest.title,
      description: quest.description,
      xp: quest.xp
    };

    await this.playerService.addQuest(this.player.id!, stub);
    this.refreshPlayer();
    this.selectedQuestId = undefined;
  }

  async removeQuest(questId: string): Promise<void> {
    if (!this.player) return;
    await this.playerService.removeQuest(this.player.id!, questId);
    this.refreshPlayer();
  }

  async completeQuest(questId: string): Promise<void> {
    if (!this.player) return;
    await this.playerService.completeQuest(this.player.id!, questId);
    this.refreshPlayer();
  }

  async reopenQuest(questId: string): Promise<void> {
    if (!this.player) return;
    await this.playerService.reopenQuest(this.player.id!, questId);
    this.refreshPlayer();
  }

  goToClan(): void {
    if (this.clan) {
      this.router.navigate(['/clan', this.clan.id]);
    }
  }

  private refreshPlayer(): void {
    if (this.player?.id) {
      this.player = this.playerService.getPlayerById(this.player.id);
      this.updateLevel();
    }
  }
}