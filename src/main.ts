// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideProtractorTestingSupport } from '@angular/platform-browser';
import { AppComponent } from './app/app'; // Corrected

bootstrapApplication(AppComponent, {
  providers: [provideProtractorTestingSupport()],
}).catch((err) => console.error(err));
