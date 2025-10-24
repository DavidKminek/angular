import { Routes } from '@angular/router';
import { Home } from '../home/home';
import { Quests } from './quests/quests';
import { QuestDetail } from './quests/quest-detail';
import { Players } from './players/players';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'quests', component: Quests },
  { path: 'quests/:id', component: QuestDetail },
  { path: 'players', component: Players },
];
