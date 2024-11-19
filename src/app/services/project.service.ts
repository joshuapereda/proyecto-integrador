import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';

const URL_UTIL = AppSettings.API_ENDPOINT + '/project'


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http:HttpClient) { }

  registrarProject(data:Project):Observable<any>{
    return this.http.post(URL_UTIL, data);
  }

  listProject():Observable<Project[]>{
    return this.http.get<Project[]>(URL_UTIL+"/projects");
  }

}
