import { Component, signal, inject } from '@angular/core';
import { AdminServices } from '../../../services/admin-services';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, FormRoot, required, email, minLength } from '@angular/forms/signals';
@Component({
  imports: [FormRoot, FormField],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private adminServices = inject(AdminServices);
  private router = inject(Router);
  errorDisplay = signal(false);

  readonly loginModel = signal({
    email: '',
    password: '',
  });

  readonly loginForm = form(this.loginModel, (path) => {
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Invalid email format' });
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 6, { message: 'Password must be at least 6 characters long' });
  });

  onSubmit() {
    this.errorDisplay.set(false);
    console.log('Form submitted with values:', this.loginModel());
    const exists = this.adminServices.verifyAdmin(
      this.loginModel().email,
      this.loginModel().password,
    );
    if (exists) {
      console.log('Admin exists, navigating to admin dashboard...');
      this.adminServices.setCurrentAdmin(exists);
      this.router.navigate(['/admin']);
    } else {
      this.errorDisplay.set(true);
      setTimeout(() => {
        this.errorDisplay.set(false);
      }, 3000);
    }
    this.resetForm();
  }

  resetForm() {
    this.loginModel.set({
      email: '',
      password: '',
    });
    this.loginForm().reset();
  }
}
