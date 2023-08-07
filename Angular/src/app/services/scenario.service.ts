import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Model/user.model';
import { Observable } from 'rxjs';
import { Scenario } from '../Model/scenario.model';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  apiUrl = 'https://localhost:7072/api/Scenario'; 

  constructor(private http: HttpClient) { }

  getAllScenarios(orgId:any): Observable<Scenario[]> {
    return this.http.get<Scenario[]>(this.apiUrl+'/'+orgId);
  }
  getScenarios():Observable<Scenario[]> {
    var url = 'https://localhost:7072/api/AllScenario'
    return this.http.get<Scenario[]>(url);
  }
  createScenario(scenario:Scenario):Observable<any>{
    return this.http.post(this.apiUrl,scenario);
  }
}
