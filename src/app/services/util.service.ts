import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Colores } from '../models/colores.model';

const URL_UTIL = AppSettings.API_ENDPOINT + '/util'

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private http:HttpClient) { }

  listaColores(): Observable<Colores[]>{
    return this.http.get<Colores[]>(URL_UTIL + '/colors');
  }
}
