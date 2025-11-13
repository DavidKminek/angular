import { Component } from '@angular/core';
import { Quest } from './quest-interface';
import { QuestsService } from './quest.service';

@Component({
  selector: 'app-quest-detail',
  templateUrl: './quest-detail.html',
})
export class QuestDetail {
  quest?: Quest;

  constructor(private questsService: QuestsService) {}

  loadQuest(id: number) {
    this.quest = this.questsService.getQuestById(id)!; 
  }
}
