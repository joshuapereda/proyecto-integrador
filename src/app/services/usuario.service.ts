import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../app.settings';

const baseUrlPrueba = AppSettings.API_ENDPOINT + '/user';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  registrar(data: Usuario): Observable<any> {
    return this.http.post(baseUrlPrueba + '/register', data, );
  }

  validaUserName(userName: string): Observable<any>{
    console.log('>>> Service >> validaUserNameRegistra [inicio]' + userName);
    return this.http.get<any>(baseUrlPrueba+'/username?username='+userName)

  }

  validaEmail(email: string): Observable<any>{
    console.log('>>> Service >> validaEmailRegistra [inicio]' + email);
    return this.http.get<any>(baseUrlPrueba+'/email?email='+email)

  }

  validaDni(dni: number): Observable<any>{
    console.log('>>> Service >> validaDniRegistra [inicio]' + dni);
    return this.http.get<any>(baseUrlPrueba+'/dni?dni='+dni)

  }


}
