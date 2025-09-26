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
}
