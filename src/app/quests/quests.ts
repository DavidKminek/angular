import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuestItem } from './quests-item';
import { QuestsService } from './quest.service';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [QuestItem],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class Quests implements OnInit, OnDestroy {
  constructor(private questsService: QuestsService) {}

  quests = this.questsService.getQuests();

  addQuest() {
    this.questsService.addQuest();
  }

  deleteQuest(id: number) {
    this.questsService.deleteQuest(id);
  }

  ngOnInit() {
    console.log('Quests component initialized.');
  }

  ngOnDestroy() {
    console.log('Quests component destroyed.');
  }
}
