import { Service, signal } from '@angular/core';
import { Admin } from '../models/admin';

@Service()
export class AdminServices {
    private _admins = signal <Admin[]>([
        { id: '1', name: 'John Doe', email: 'john.doe@example.com', password: 'password123' },
        { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password456' }
    ]);
    readonly admins = this._admins.asReadonly();

    private _currentAdmin = signal<Admin | null>(null);

    readonly currentAdmin = this._currentAdmin.asReadonly();

    setCurrentAdmin(admin: Admin | null): void {
        this._currentAdmin.set(admin);
    }

    getCurrentAdmin(): Admin | null {
        return this._currentAdmin();
    }
    
    verifyAdmin(email: string, password: string): Admin | undefined {
        const admin = this._admins().find(admin => admin.email === email && admin.password === password);
        return admin;
    }
    
}
