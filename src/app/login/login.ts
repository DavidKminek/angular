import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginPage {
  error = signal<string | null>(null);
  isRegister = signal<boolean>(false);

  loginForm = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true })
  });

  constructor(private auth: Auth, private router: Router) {}

  async submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    try {
      if (this.isRegister()) {
        await createUserWithEmailAndPassword(this.auth, email, password);
      } else {
        await signInWithEmailAndPassword(this.auth, email, password);
      }
      this.error.set(null);
      await this.router.navigate(['/']);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Sign in failed');
    }
  }

  toggleMode() {
    this.isRegister.update(v => !v);
    this.error.set(null);
  }
}
