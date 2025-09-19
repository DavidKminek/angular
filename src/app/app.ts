import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { RouterOutlet } from '@angular/router';
import { Quests } from './quests/quests';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, Quests, RouterOutlet], 
  templateUrl: './app.html', 
  styleUrls: ['./app.css']
})
export class AppComponent {}
