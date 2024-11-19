import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { StartMenuComponent } from './components/start-menu/start-menu.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [


  { path: '', component: StartMenuComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'app', component: MainComponent },
  { path: '**', redirectTo: '' }

];
