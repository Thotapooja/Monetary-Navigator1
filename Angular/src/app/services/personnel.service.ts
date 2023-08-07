import { Injectable } from '@angular/core';
import { Personnel, PersonnelDetails } from '../Model/personnel.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {

  apiUrl = 'https://localhost:7072/api/Personnel'; 

  constructor(private http: HttpClient) { }

  getAllPersonnel(scenarioId:any): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(this.apiUrl+'/'+scenarioId);
  }
  /*getScenarios():Observable<Revenue[]> {
    var url = 'https://localhost:7072/api/AllScenario'
    return this.http.get<Revenue[]>(url);
  }*/
  createCogs(revenue:Personnel):Observable<any>{
    return this.http.post(this.apiUrl,revenue);
  }
  getPersonnelDetails(orgId:any, scenarioId:any): Observable<PersonnelDetails[]> {
    return this.http.get<PersonnelDetails[]>(this.apiUrl+'/'+orgId+'/'+scenarioId);
  }
}
