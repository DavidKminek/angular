import { Injectable } from '@angular/core';
import { Quest } from './quest-interface';

@Injectable({ providedIn: 'root' })
export class QuestsService {
  private quests: Quest[] = [
    { id: 1, title: 'Find the Lost Sword', description: 'Retrieve the legendary sword from the ancient ruins.', xp: 40 },
    { id: 2, title: 'Rescue the Villagers', description: 'Save the villagers captured by goblins.', xp: 120 },
    { id: 3, title: 'Collect Herbs', description: 'Gather 10 healing herbs for the village healer.', xp: 60 }
  ];

  // Vráti zoznam questov
  getQuests(): Quest[] {
    return this.quests;
  }

  // Vráti quest podľa ID
  getQuestById(id: number): Quest | undefined {
    return this.quests.find(q => q.id === id);
  }

  // Pridá nový quest
  addQuest(): void {
    const nextId = this.quests.length > 0 ? Math.max(...this.quests.map(q => q.id)) + 1 : 1;
    const newQuest: Quest = {
      id: nextId,
      title: `New Quest ${nextId}`,
      description: 'This is a newly added quest.',
      xp: 10
    };
    this.quests.push(newQuest);
  }

  // Vymaže quest podľa ID
  deleteQuest(id: number): void {
    this.quests = this.quests.filter(q => q.id !== id);
  }
}
