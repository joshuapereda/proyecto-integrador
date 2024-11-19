import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginUsuario } from './login-usuario';
import { Observable } from 'rxjs';
import { JwtDto } from './jwt-dto';
import { AppSettings } from '../app.settings';

const authUrl = AppSettings.API_ENDPOINT + '/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private httpClient: HttpClient) { }



  public login(loginUsuario: LoginUsuario): Observable<JwtDto>{
    return this.httpClient.post<JwtDto>(authUrl + '/login', loginUsuario);
  }
}
