import { Service, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Admin } from '../models/admin';

const AdminUrl = 'http://localhost:3000/admins';

const ADMIN_KEY = 'currentAdmin';

const loadAdmin = (): Admin | null => {
  try {
    return JSON.parse(sessionStorage.getItem(ADMIN_KEY) ?? 'null');
  } catch {
    return null; 
  }
};

@Service()
export class AdminServices {
  private readonly _http = inject(HttpClient);
  private _currentAdmin = signal<Admin | null>(loadAdmin());

  readonly currentAdmin = this._currentAdmin.asReadonly();

  setCurrentAdmin(admin: Admin | null): void {
    if (admin) {
      sessionStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    } else {
      sessionStorage.removeItem(ADMIN_KEY);
    }
    this._currentAdmin.set(admin);
  }

  getCurrentAdmin(): Admin | null {
    return this._currentAdmin();
  }

  verifyAdmin(email: string, password: string): Observable<Admin | null> {
    return this._http.post<Admin>(`${AdminUrl}/login`, { email, password }).pipe(
      map((admin) => {
        this.setCurrentAdmin(admin);
        return admin;
      }),
      catchError(() => of(null)),
    );
  }

  changePassword(adminId: string, newPassword: string): Observable<boolean> {
    return this._http.patch<void>(`${AdminUrl}/${adminId}/password`, { newPassword }).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
