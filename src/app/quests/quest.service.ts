// quest.service.ts
import { Injectable, signal } from '@angular/core';
import { Quest } from './quest-interface';


@Injectable({ providedIn: 'root' })
export class QuestsService {
  private _quests = signal<Quest[]>([
    { id: 1, title: 'Find the Lost Sword', description: 'Retrieve the legendary sword from the ancient ruins.', xp: 40, imageUrl: 'assets/sword.png', difficulty: 'medium' },
    { id: 2, title: 'Rescue the Villagers', description: 'Save the villagers captured by goblins.', xp: 120, imageUrl: 'assets/villagers.png', difficulty: 'hard' },
    { id: 3, title: 'Collect Herbs', description: 'Gather 10 healing herbs for the village healer.', xp: 60, imageUrl: 'assets/herbs.png', difficulty: 'easy' }
  ]);

  quests() {
    return this._quests();
  }

  getQuestById(id: number) {
    return this._quests().find(q => q.id === id);
  }

  addQuest() {
    const nextId = this._quests().length > 0 ? Math.max(...this._quests().map(q => q.id)) + 1 : 1;
    const newQuest: Quest = { id: nextId, title: `New Quest ${nextId}`, description: 'This is a newly added quest.', xp: 10 };
    this._quests.update(qs => [...qs, newQuest]);
  }

  deleteQuest(id: number) {
    this._quests.update(qs => qs.filter(q => q.id !== id));
  }
  addCustomQuest(data: { title: string; description: string; xp: number }) {
  const nextId = this._quests().length > 0
    ? Math.max(...this._quests().map(q => q.id)) + 1
    : 1;

  const newQuest: Quest = {
    id: nextId,
    title: data.title,
    description: data.description,
    xp: data.xp
  };

  this._quests.update(qs => [...qs, newQuest]);
}


}
