// quest.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Quest } from './quest-interface';

@Injectable({ providedIn: 'root' })
export class QuestsService {
  private firestore = inject(Firestore);
  private questsCollection = collection(this.firestore, 'quests');

  private _quests = signal<Quest[]>([]);

  
  constructor() {
    this.loadQuests();
  }


  private loadQuests() {
    const quests$ = collectionData(this.questsCollection, { idField: 'id' }) as Observable<Quest[]>;

    quests$.pipe(
      map(quests => quests.sort((a, b) => (b.id ?? '').localeCompare(a.id ?? ''))) 
    ).subscribe(quests => {
      this._quests.set(quests);
    });
  }

 
  quests() {
    return this._quests.asReadonly()();
  }

  getQuestById(id: string): Quest | undefined {
    return this._quests().find(q => q.id === id);
  }


  async addCustomQuest(data: { title: string; description: string; xp: number }) {
    const newQuest: Omit<Quest, 'id'> = {
      title: data.title,
      description: data.description,
      xp: data.xp,
      imageUrl: 'assets/default.png', 
      difficulty: 'medium'
    };

    const docRef = await addDoc(this.questsCollection, newQuest);
    
  }

  async deleteQuest(id: string) {
    if (!id) return;
    const questDoc = doc(this.firestore, 'quests', id);
    await deleteDoc(questDoc);
  }

  async addDefaultQuestsIfEmpty() {
    if (this._quests().length === 0) {
      const defaults = [
        { title: 'Find the Lost Sword', description: 'Retrieve the legendary sword from the ancient ruins.', xp: 40, imageUrl: 'assets/sword.png', difficulty: 'medium' },
        { title: 'Rescue the Villagers', description: 'Save the villagers captured by goblins.', xp: 120, imageUrl: 'assets/villagers.png', difficulty: 'hard' },
        { title: 'Collect Herbs', description: 'Gather 10 healing herbs for the village healer.', xp: 60, imageUrl: 'assets/herbs.png', difficulty: 'easy' }
      ];

      for (const q of defaults) {
        await addDoc(this.questsCollection, q);
      }
    }
  }
}