import { Injectable, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  isLoggedIn = signal<boolean>(false);

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (u) => {
      this._user.set(u);
      this.isLoggedIn.set(!!u);
    });
  }

  get user() {
    return this._user();
  }

  async logout() {
    await signOut(this.auth);
  }
}
