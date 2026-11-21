import { Component, inject, signal } from '@angular/core';
import { AdminServices } from '../../../services/admin-services';
import { form, FormRoot, FormField, required, minLength, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-change-password',
  styleUrl: './change-password.css',
  templateUrl: './change-password.html',
})
export class ChangePassword {
  readonly router = inject(Router);
  readonly adminServices = inject(AdminServices);
  errorServerMessage = signal<boolean>(false);
  errorConfirmMessage = signal<boolean>(false);

  currentAdmin = this.adminServices.currentAdmin();

  readonly passwordModel = signal({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  readonly passwordForm = form(this.passwordModel, (path) => {
    validate(path.currentPassword, ({ value }) => {
      if (this.currentAdmin && value() !== this.currentAdmin.password) {
        return { kind: 'incorrect', message: 'Current password is incorrect' };
      }
      return null;
    });
    required(path.newPassword, { message: 'New password is required' });
    minLength(path.newPassword, 6, { message: 'New password must be at least 6 characters' });
    validate(path.confirmPassword, ({ value }) => {
      if (value() !== this.passwordModel().newPassword) {
        return { kind: 'mismatch', message: 'Passwords do not match' };
      }
      return null;
    });
  });

  onSubmit() {
    if (this.passwordForm().invalid()) return;
    if (!this.currentAdmin) return;

    this.adminServices
      .changePassword(this.currentAdmin.id, this.passwordModel().newPassword)
      .subscribe((success) => {
        if (success) {
          this.adminServices.setCurrentAdmin(null);
          this.router.navigate(['/login']);
        } else {
          this.errorServerMessage.set(true);
          setTimeout(() => this.errorServerMessage.set(false), 3000);
        }
      });
  }
}
