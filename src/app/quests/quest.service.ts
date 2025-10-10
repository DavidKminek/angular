import { Injectable, signal } from '@angular/core';

export interface Quest {
  id: number;
  title: string;
  description: string;
  xp: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuestsService {
  constructor() {
    console.log('Service instance created.');
  }

  private questsSignal = signal<Quest[]>([
    { id: 1, title: 'Find the Lost Sword', description: 'Retrieve the legendary sword from the ancient ruins.', xp: 40 },
    { id: 2, title: 'Rescue the Villagers', description: 'Save the villagers captured by goblins.', xp: 120 },
    { id: 3, title: 'Collect Herbs', description: 'Gather 10 healing herbs for the village healer.', xp: 60 }
  ]);

  getQuests() {
    return this.questsSignal;
  }

  addQuest() {
    const maxId = this.questsSignal().reduce((max, q) => Math.max(max, q.id), 0);
    const newQuest: Quest = {
      id: maxId + 1,
      title: `New Quest #${maxId + 1}`,
      description: 'This is a newly added quest.',
      xp: 75
    };
    this.questsSignal.set([...this.questsSignal(), newQuest]);
  }

  deleteQuest(id: number) {
    this.questsSignal.set(this.questsSignal().filter(q => q.id !== id));
  }
}
