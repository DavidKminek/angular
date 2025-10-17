import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestsService } from './quest.service';
import { Quest } from './quest-interface';

@Component({
  selector: 'app-quest-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quest-detail.html',
  styleUrls: ['./quest-detail.css']
})
export class QuestDetail {
  quest?: Quest;

  constructor(private route: ActivatedRoute, private questsService: QuestsService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.quest = this.questsService.getQuestById(id);
  }
}
