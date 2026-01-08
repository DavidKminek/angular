

import { ApplicationConfig } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBjdYRHO0xPvlBDBu9USu986ENcquO_Z4s",
  authDomain: "angular-b02e9.firebaseapp.com",
  projectId: "angular-b02e9",
  storageBucket: "angular-b02e9.firebasestorage.app",
  messagingSenderId: "411151949286",
  appId: "1:411151949286:web:103eb2a6522f85ddd3ca27",
  measurementId: "G-7P0XHYK2TY"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
};

