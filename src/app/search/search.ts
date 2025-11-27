import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <input [formControl]="searchControl" placeholder="Search..." class="search-input"/>
  `
})
export class SearchComponent {
  @Output() searchChange = new EventEmitter<string>();
  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges.subscribe(value => {
      this.searchChange.emit(value ?? '');
    });
  }
}
