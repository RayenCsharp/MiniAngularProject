import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminServices } from '../../../services/admin-services';
import { Admin } from '../../../models/admin';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-admin-layout',
  styleUrl: './admin-layout.css',
  templateUrl: './admin-layout.html',
})
export class AdminLayout implements OnInit {
  readonly adminServices = inject(AdminServices);

  currentAdmin = signal<Admin | undefined>(undefined);

  ngOnInit(): void {
    this.currentAdmin.set(this.adminServices.getCurrentAdmin() ?? undefined);
  }

  logout() {
    this.adminServices.setCurrentAdmin(null);
    this.currentAdmin.set(undefined);
  }
}
