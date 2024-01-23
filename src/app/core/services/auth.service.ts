import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionKey = 'auth-credentials';

  cacheCredentials(username: string, password: string): void {
    const encodedCredentials = btoa(`${username}:${password}`);
    sessionStorage.setItem(this.sessionKey, encodedCredentials);
  }

  getCredentials(): string | null {
    return sessionStorage.getItem(this.sessionKey);
  }

  clearCredentials(): void {
    sessionStorage.removeItem(this.sessionKey);
  }
}
