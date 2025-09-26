import { Component } from '@angular/core';
import { QuestItem } from './quests-item';

export interface Quest {
  id: number;
  title: string;
  description: string;
  xp: number;
}

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [QuestItem],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class Quests {
  quests: Quest[] = [
    { id: 1, title: 'Find the Lost Sword', description: 'Retrieve the legendary sword from the ancient ruins.', xp: 40 },
    { id: 2, title: 'Rescue the Villagers', description: 'Save the villagers captured by goblins.', xp: 120 },
    { id: 3, title: 'Collect Herbs', description: 'Gather 10 healing herbs for the village healer.', xp: 60 }
  ];

  addQuest() {
    const maxId = this.quests.reduce((max, q) => Math.max(max, q.id), 0);
    const newQuest: Quest = {
      id: maxId + 1,
      title: `New Quest #${maxId + 1}`,
      description: 'This is a newly added quest.',
      xp: 75
    };
    this.quests = [...this.quests, newQuest];
  }
}
