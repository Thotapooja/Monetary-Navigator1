import { Injectable } from '@angular/core';
import { Cogs, CogsDetails } from '../Model/cogs.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CogsService {

  apiUrl = 'https://localhost:7072/api/Cogs'; 

  constructor(private http: HttpClient) { }

  getAllCogs(scenarioId:any): Observable<Cogs[]> {
    return this.http.get<Cogs[]>(this.apiUrl+'/'+scenarioId);
  }
  /*getScenarios():Observable<Revenue[]> {
    var url = 'https://localhost:7072/api/AllScenario'
    return this.http.get<Revenue[]>(url);
  }*/
  createCogs(revenue:Cogs):Observable<any>{
    return this.http.post(this.apiUrl,revenue);
  }
  getCogsDetails(orgId:any, scenarioId:any): Observable<CogsDetails[]> {
    return this.http.get<CogsDetails[]>(this.apiUrl+'/'+orgId+'/'+scenarioId);
  }
}
