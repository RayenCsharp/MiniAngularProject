import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-user-layout',
  styleUrl: './user-layout.css',
  templateUrl: './user-layout.html',
})
export class UserLayout {}
