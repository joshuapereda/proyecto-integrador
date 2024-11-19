import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Tareas } from '../models/tareas.model';
import { Observable } from 'rxjs';

const URL_UTIL = AppSettings.API_ENDPOINT + '/tarea'


@Injectable({
  providedIn: 'root'
})
export class TareaService {

  constructor(private http:HttpClient) { }

  registrarTask(data:Tareas):Observable<any>{
    return this.http.post(URL_UTIL, data);
  }

  listarByProject(idProyecto:number):Observable<Tareas[]>{
    return this.http.get<Tareas[]>(`${URL_UTIL}/${idProyecto}`)
  }

  listarTasks():Observable<Tareas[]>{
    return this.http.get<Tareas[]>(URL_UTIL);
  }
}
