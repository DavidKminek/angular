// quests.ts 
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { QuestsService } from './quest.service';
import { SearchComponent } from '../search/search';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, SearchComponent],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class Quests {
  search = signal('');

  questForm = new FormGroup({
    title: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], nonNullable: true }),
    description: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    xp: new FormControl(0, { validators: [Validators.required, Validators.min(1)], nonNullable: true })
  });

  filteredQuests = computed(() => {
    const s = this.search().toLowerCase();
    return this.questsService.quests().filter(q =>
      q.title.toLowerCase().includes(s) 
    );
  });

  constructor(public questsService: QuestsService) {}

  onSearchChange(value: string | null) {
    this.search.set(value ?? '');
  }

  async createQuest() {
    if (this.questForm.invalid) return;

    const { title, description, xp } = this.questForm.getRawValue();

    await this.questsService.addCustomQuest({ title, description, xp });

    this.questForm.reset({ title: '', description: '', xp: 0 });
  }

  async deleteQuest(id: string) {
    await this.questsService.deleteQuest(id);
  }
}