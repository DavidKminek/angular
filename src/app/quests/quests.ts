import { Component } from '@angular/core';
import { QuestItem } from './quests-item';
import { QuestsService, Quest } from './quest.service';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [QuestItem],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class Quests {

  constructor(private questsService: QuestsService) {}

  quests = this.questsService.getQuests();

  addQuest() {
    this.questsService.addQuest();
  }

  deleteQuest(id: number) {
    this.questsService.deleteQuest(id);
  }
}
