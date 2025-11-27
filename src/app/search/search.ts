import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <input type="text" [formControl]="searchControl" placeholder="Search..." />
  `
})
export class SearchComponent {
  searchControl = new FormControl('');

  @Output() searchChange = new EventEmitter<string>();

  constructor() {
    this.searchControl.valueChanges.subscribe(value => {
      this.searchChange.emit(value ?? '');
    });
  }
}
