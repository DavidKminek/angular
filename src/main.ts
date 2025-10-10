
import { bootstrapApplication } from '@angular/platform-browser';
import { provideProtractorTestingSupport } from '@angular/platform-browser';
import { App } from './app/app'; 

bootstrapApplication(App, {
  providers: [provideProtractorTestingSupport()],
}).catch((err) => console.error(err));
