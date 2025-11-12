// src/app/clan/clan.ts
import { Component } from '@angular/core';
import { ClansService } from './clan.service';
import { Router } from '@angular/router';
import { Clan } from './clan.interface';

@Component({
  standalone: true,
  selector: 'app-clan',
  templateUrl: './clan.html',
  styleUrls: ['./clan.css']
})
export class ClanPage {
  clans = this.clansService.getAll();

  constructor(private clansService: ClansService, private router: Router) {}

  addClan() {
    const defaultClan: Clan = {
      id: Date.now(),
      name: 'New Clan',
      description: 'Default description',
      capacity: 5,
      members: []
    };
    this.clansService.addClan(defaultClan);
  }

  removeClan(id: number) {
    this.clansService.removeClan(id);
  }

  goToDetail(id: number) {
    this.router.navigate(['/clan', id]);
  }
}
