import { Component } from '@angular/core';

type Quest = {
  title: string;
  description: string;
  completed: boolean;
};

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class Quests {
  quests: Quest[] = [
    { title: 'Find the Lost Sword', description: 'Retrieve the legendary sword from the ancient ruins.', completed: false },
    { title: 'Rescue the Villagers', description: 'Save the villagers captured by goblins.', completed: true },
    { title: 'Collect Herbs', description: 'Gather 10 healing herbs for the village healer.', completed: false }
  ];
}