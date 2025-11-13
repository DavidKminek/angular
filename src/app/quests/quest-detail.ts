import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quest } from './quest-interface';
import { QuestsService } from './quest.service';

@Component({
  selector: 'app-quest-detail',
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
    // Načíta ID z URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.quest = this.questsService.getQuestById(id);
  }
}
