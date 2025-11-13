import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService, Player, QuestStub } from './players.service';
import { ClansService } from '../clan/clan.service';
import { QuestsService } from '../quests/quest.service';
import { Clan } from '../clan/clan.interface';
import { Quest } from './player.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private playerService: PlayerService,
    private clansService: ClansService,
    private questsService: QuestsService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.player = this.playerService.getPlayerById(id);
    if (this.player?.clanId) {
      this.clan = this.clansService.getById(this.player.clanId);
    }
    this.allQuests = this.questsService.quests(); // get all quests
  }

addQuest() {
  if (!this.player || !this.selectedQuestId) return;

  const questId = Number(this.selectedQuestId);
  const quest = this.questsService.getQuestById(questId);
  if (!quest) return;

  // skontroluj, či už hráč tento quest nemá
  if ((this.player.quests ?? []).some(q => q.id === quest.id)) {
    alert('Hráč už má tento quest!');
    return;
  }

  const questStub: QuestStub = {
    id: quest.id,
    title: quest.title,
    description: quest.description,
    xp: quest.xp
  };

  this.playerService.addQuest(this.player.id, questStub);

  // refresh player
  this.player = this.playerService.getPlayerById(this.player.id);

  // reset select
  this.selectedQuestId = undefined;
}

// odstránenie questu
removeQuest(questId: number) {
  if (!this.player) return;
  this.playerService.removeQuest(this.player.id, questId);

  // refresh player
  this.player = this.playerService.getPlayerById(this.player.id);
}



  goToClan() {
    if (!this.clan) return;
    this.router.navigate(['/clan', this.clan.id]);
  }
}
