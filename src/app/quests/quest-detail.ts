// quest-detail.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quest } from './quest-interface';
import { QuestsService } from './quest.service';

@Component({
  selector: 'app-quest-detail',
  standalone: true,
  templateUrl: './quest-detail.html',
  styleUrls: ['./quest-detail.css']
})
export class QuestDetail implements OnInit {
  quest?: Quest;

  constructor(
    private route: ActivatedRoute,
    private questsService: QuestsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); 
    this.quest = this.questsService.getQuestById(id ?? '');
  }
}