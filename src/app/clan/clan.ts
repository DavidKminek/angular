//clan.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { signal, computed } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ClansService } from './clan.service';
import { PlayerService } from '../players/players.service';
import { Clan } from './clan.interface';

import { SearchComponent } from '../search/search';

@Component({
  selector: 'app-clans',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchComponent],
  templateUrl: './clan.html',
  styleUrls: ['./clan.css']
})
export class ClanPage {

  // --- SIGNALS ---
  clans = this.clansService.clans();
  search = signal('');

  filteredClans = computed(() => {
    const s = this.search().toLowerCase();
    return this.clans().filter(c =>
      c.name.toLowerCase().startsWith(s)
    );
  });

  // --- SIGNAL FORM ---
  clanForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(8)]
    }),
    description: new FormControl(''),
    capacity: new FormControl(5, {
      validators: [Validators.required, Validators.min(1)]
    })
  });

  constructor(
    private clansService: ClansService,
    private playerService: PlayerService,
    private router: Router
  ) {}

  // reactive clans signal comes from ClansService

  createClan() {
    if (this.clanForm.invalid) {
      this.clanForm.markAllAsTouched();
      return;
    }

    const value = this.clanForm.getRawValue();

    const newClan: Clan = {
      id: String(Date.now()),
      name: value.name!,
      description: value.description!,
      capacity: value.capacity!,
      memberIds: []
    };

    this.clansService.addClan(newClan).then(() => {
      this.clanForm.reset({ capacity: 5 });
    });
  }

  deleteClan(clanId: string) {
    const clan = this.clansService.getById(clanId);
    if (!clan) return;
    if (!confirm(`Delete clan "${clan.name}"?`)) return;

    this.clansService.removeClan(clanId).then(() => {
      this.playerService.getAll().forEach(p => {
        if (p.clanId === clanId && p.id) this.playerService.setPlayerClan(p.id, undefined);
      });
    });
  }

  openDetail(clanId: string) {
    this.router.navigate(['/clan', clanId]);
  }

  onSearchChange(value: string) {
    this.search.set(value);
  }
}
