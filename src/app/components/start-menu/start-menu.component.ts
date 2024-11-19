import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app-material.module';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-menu',
  standalone: true,
  imports: [AppMaterialModule, AppComponent],
  templateUrl: './start-menu.component.html',
  styleUrl: './start-menu.component.css'
})
export class StartMenuComponent {

  constructor(private router: Router) {}
  navigateToLogin() {
    this.router.navigate(['/login']);
  }


  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
