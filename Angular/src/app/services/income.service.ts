import { Injectable } from '@angular/core';
import { Income } from '../Model/income.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  apiUrl = 'https://localhost:7072/api/Income'; 

  constructor(private http: HttpClient) { }

  getIncomeDetails(orgId:any, scenarioId:any): Observable<Income[]> {
    return this.http.get<Income[]>(this.apiUrl+'/'+orgId+'/'+scenarioId);
  }
}
