import { Routes } from '@angular/router';
import { Home } from '../home/home';
import { Quests } from './quests/quests';
import { QuestDetail } from './quests/quest-detail';
import { PlayersPage } from './players/players';
import { PlayerDetail } from './players/players.details';
import { ClanPage } from './clan/clan';
import { ClanDetailPage } from './clan/clan-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'quests', component: Quests },
  { path: 'quests/:id', component: QuestDetail },
  { path: 'players', component: PlayersPage },
  { path: 'players/:id', component: PlayerDetail },
  { path: 'clan', component: ClanPage },
  { path: 'clan/:id', component: ClanDetailPage } 
];
