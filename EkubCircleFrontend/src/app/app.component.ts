import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from './auth.service';

@Component({ selector: 'app-root', standalone: true, imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf], template: `
<div class="app-shell">
  <header class="topbar" *ngIf="auth.isLoggedIn()">
    <a routerLink="/dashboard" class="brand"><span class="brand-mark">E</span><span>Ekub<span>Circle</span></span></a>
    <nav>
      <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="/circles/new" routerLinkActive="active">Create Circle</a>
      <a routerLink="/profile" routerLinkActive="active">Profile</a>
      <button class="nav-user" (click)="logout()">{{ auth.user()?.fullName }} · Logout</button>
    </nav>
  </header>
  <main [class.with-nav]="auth.isLoggedIn()"><router-outlet></router-outlet></main>
</div>` })
export class AppComponent {
  auth = inject(AuthService); router = inject(Router);
  logout() { this.auth.logout(); this.router.navigateByUrl('/login'); }
}
