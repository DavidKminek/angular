import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, NonNullableFormBuilder } from '@angular/forms';
import { QuestsService } from './quest.service';
import { Quest } from './quest-interface';
import { SearchComponent } from '../search/search'; 

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, SearchComponent],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class Quests implements OnInit {

  questForm = this.fb.group({
    title: this.fb.control('', { validators: [Validators.required, Validators.minLength(8)] }),
    description: this.fb.control('', { validators: [Validators.required] }),
    xp: this.fb.control(0, { validators: [Validators.required] })
  });

  filteredQuests: Quest[] = [];

  constructor(
    public questsService: QuestsService,
    private fb: NonNullableFormBuilder
  ) {}

  ngOnInit() {
    this.filteredQuests = this.questsService.quests();
  }

  onSearchChange(value: string | null) {
    const search = (value ?? '').toLowerCase();
    
    this.filteredQuests = this.questsService
      .quests()
      .filter(q => q.title.toLowerCase().startsWith(search));
  }

  createQuest() {
    if (this.questForm.invalid) return;

    const { title, description, xp } = this.questForm.getRawValue();

    this.questsService.addCustomQuest({
      title,
      description,
      xp
    });

    this.questForm.reset({
      title: '',
      description: '',
      xp: 0
    });

    this.filteredQuests = this.questsService.quests();
  }

  deleteQuest(id: number) {
    this.questsService.deleteQuest(id);
    this.filteredQuests = this.questsService.quests();
  }
}
