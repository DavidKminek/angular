// main.ts
import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { App } from './app/app';

// FIREBASE IMPORTS
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

// Nahraď svojím skutočným configom z Firebase konzoly!
const firebaseConfig = {
  apiKey: "AIzaSyBjdYRHO0xPvlBDBu9USu986ENcquO_Z4s",
  authDomain: "angular-b02e9.firebaseapp.com",
  projectId: "angular-b02e9",
  storageBucket: "angular-b02e9.firebasestorage.app",
  messagingSenderId: "411151949286",
  appId: "1:411151949286:web:103eb2a6522f85ddd3ca27",
  measurementId: "G-7P0XHYK2TY"
};

bootstrapApplication(App, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // FIREBASE
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ]
});