import { Component, input, output } from '@angular/core';

export interface Quest {
  id: number;
  title: string;
  description: string;
  xp: number;
}

@Component({
  selector: 'app-quest-item',
  standalone: true,
  templateUrl: './quest-item.html',
  styleUrls: ['./quest-item.css']
})
export class QuestItem {
  quest = input.required<Quest>();
  index = input.required<number>();

  delete = output<number>(); // správne použitie

  onDelete() {
    this.delete.emit(this.quest().id);
  }
}
