import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Quest } from './quest-interface';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class Quests {
  // signal pre pole questov
  quests = signal<Quest[]>([
    { id: 1, title: 'Find the Lost Sword', description: 'Retrieve the legendary sword from the ancient ruins.', xp: 40, imageUrl: 'assets/sword.png', difficulty: 'medium' },
    { id: 2, title: 'Rescue the Villagers', description: 'Save the villagers captured by goblins.', xp: 120, imageUrl: 'assets/villagers.png', difficulty: 'hard' },
    { id: 3, title: 'Collect Herbs', description: 'Gather 10 healing herbs for the village healer.', xp: 60, imageUrl: 'assets/herbs.png', difficulty: 'easy' }
  ]);

  // pridanie nového questu
  addQuest() {
    const nextId = this.quests().length > 0 ? Math.max(...this.quests().map(q => q.id)) + 1 : 1;
    const newQuest: Quest = {
      id: nextId,
      title: `New Quest ${nextId}`,
      description: 'This is a newly added quest.',
      xp: 10
    };

    this.quests.update(qs => [...qs, newQuest]); // update signalu
  }

  // vymazanie questu
  deleteQuest(id: number) {
    this.quests.update(qs => qs.filter(q => q.id !== id)); // update signalu
  }
}
