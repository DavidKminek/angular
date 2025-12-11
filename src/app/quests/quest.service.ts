// quest.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Quest } from './quest-interface';

@Injectable({ providedIn: 'root' })
export class QuestsService {
  private firestore = inject(Firestore);
  private questsCollection = collection(this.firestore, 'quests');

  // Signál, ktorý bude držať aktuálne questy
  private _quests = signal<Quest[]>([]);

  // Automaticky sa naplní pri štarte appky
  constructor() {
    this.loadQuests();
  }

  // Načíta všetky questy z Firestore a uloží do signálu
  private loadQuests() {
    const quests$ = collectionData(this.questsCollection, { idField: 'id' }) as Observable<Quest[]>;

    quests$.pipe(
      map(quests => quests.sort((a, b) => (b.id ?? '').localeCompare(a.id ?? ''))) // voliteľné triedenie
    ).subscribe(quests => {
      this._quests.set(quests);
    });
  }

  // Verejná metóda – rovnaká ako predtým
  quests() {
    return this._quests.asReadonly()();
  }

  getQuestById(id: string): Quest | undefined {
    return this._quests().find(q => q.id === id);
  }

  // Pridanie nového questu do Firestore
  async addCustomQuest(data: { title: string; description: string; xp: number }) {
    const newQuest: Omit<Quest, 'id'> = {
      title: data.title,
      description: data.description,
      xp: data.xp,
      imageUrl: 'assets/default.png', // alebo môžeš nechať prázdne
      difficulty: 'medium'
    };

    const docRef = await addDoc(this.questsCollection, newQuest);
    // Signál sa aktualizuje automaticky cez subscription v loadQuests()
  }

  // Mazanie
  async deleteQuest(id: string) {
    if (!id) return;
    const questDoc = doc(this.firestore, 'quests', id);
    await deleteDoc(questDoc);
    // opäť sa signál aktualizuje automaticky
  }

  // Voliteľné – ak chceš manuálne pridať nejaký default quest (napr. pri prvom spustení)
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