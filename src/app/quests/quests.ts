import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { QuestsService } from './quest.service';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class Quests {

  questForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(8)]),
    description: new FormControl('', Validators.required),
    xp: new FormControl(0, Validators.required)
  });

  constructor(public questsService: QuestsService) {}

  createQuest() {
    if (this.questForm.invalid) return;

    const { title, description, xp } = this.questForm.value;

    this.questsService.addCustomQuest({
      title: title!,
      description: description!,
      xp: xp!
    });

    this.questForm.reset();
  }

  deleteQuest(id: number) {
    this.questsService.deleteQuest(id);
  }
}
