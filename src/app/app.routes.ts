import { Routes } from '@angular/router';
import { Home } from '../home/home';
import { Quests } from './quests/quests';
import { QuestDetail } from './quests/quest-detail';
import { PlayersPage } from './players/players';
import { PlayerDetail } from './players/players.details';
import { ClanPage } from './clan/clan';
import { ClanDetailPage } from './clan/clan-detail';
import { LoginPage } from './login/login';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'quests', component: Quests, canActivate: [AuthGuard] },
  { path: 'quests/:id', component: QuestDetail, canActivate: [AuthGuard] },
  { path: 'players', component: PlayersPage, canActivate: [AuthGuard] },
  { path: 'players/:id', component: PlayerDetail, canActivate: [AuthGuard] },
  { path: 'clan', component: ClanPage, canActivate: [AuthGuard] },
  { path: 'clan/:id', component: ClanDetailPage, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPage }
];
