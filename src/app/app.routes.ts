import { Routes } from '@angular/router';
import { Home } from '../home/home';
import { Quests } from './quests/quests';
import { QuestDetail } from './quests/quest-detail';
import { Players } from './players/players';
import { ClanPage } from './clan/clan';
import { PlayerDetail } from './players/players.details';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'quests', component: Quests },
  { path: 'quests/:id', component: QuestDetail },
  { path: 'players', component: Players },
  { path: 'players/:id', component: PlayerDetail },
  { path: 'clan', component: ClanPage}
  

];
