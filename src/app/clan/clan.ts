import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClansService } from './clan.service';
import { PlayerService } from '../players/players.service';
import { Clan } from './clan.interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { SearchComponent } from '../search/search';

@Component({
  selector: 'app-clans',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchComponent],
  templateUrl: './clan.html',
  styleUrls: ['./clan.css']
})
export class ClanPage {
  clans: Clan[] = [];
  filteredClans: Clan[] = [];
  clanForm: FormGroup;

  constructor(
    private clansService: ClansService,
    private playerService: PlayerService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.clanForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(8)]],
      description: [''],
      capacity: [5, [Validators.required, Validators.min(1)]]
    });

    this.refreshClans();
  }

  refreshClans() {
    this.clans = this.clansService.getAll();
    this.filteredClans = [...this.clans];
  }

  createClan() {
    if (this.clanForm.invalid) {
      this.clanForm.markAllAsTouched();
      return;
    }

    const newClan: Clan = {
      id: Date.now(),
      name: this.clanForm.value.name,
      description: this.clanForm.value.description,
      capacity: this.clanForm.value.capacity,
      memberIds: []
    };

    this.clansService.addClan(newClan);
    this.clanForm.reset();
    this.clanForm.patchValue({ capacity: 5 });
    this.refreshClans();
  }

  deleteClan(clanId: number) {
    const clan = this.clansService.getById(clanId);
    if (!clan) return;
    if (!confirm(`Delete clan "${clan.name}"?`)) return;

    this.clansService.removeClan(clanId);
    this.playerService.getAll().forEach(p => {
      if (p.clanId === clanId) this.playerService.setPlayerClan(p.id, undefined);
    });
    this.refreshClans();
  }

  openDetail(clanId: number) {
    this.router.navigate(['/clan', clanId]);
  }

  // ------------------ NOVÉ: vyhľadávanie ------------------
  onSearchChange(value: string) {
    const search = value.toLowerCase();
    this.filteredClans = this.clans.filter(c =>
      c.name.toLowerCase().startsWith(search)
    );
  }
}
