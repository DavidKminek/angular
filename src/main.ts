import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { App } from './app/app';
import { Home } from './home/home';
import { Quests } from './app/quests/quests';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'quests', component: Quests }
];

bootstrapApplication(App, {
  providers: [provideRouter(routes)]
}).catch(err => console.error(err));
