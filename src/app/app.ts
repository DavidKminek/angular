import { Component } from '@angular/core';
import { Quests } from './quests/quests'; // cesta podľa projektu

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Quests],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  showQuests = true; // prepínač zobrazovania

  toggleQuests() {
    this.showQuests = !this.showQuests;
  }
}
