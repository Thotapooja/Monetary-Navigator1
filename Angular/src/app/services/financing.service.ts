import { Injectable } from '@angular/core';
import { Financing, FinancingDetails } from '../Model/financing.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancingService {

  apiUrl = 'https://localhost:7072/api/Financing'; 

  constructor(private http: HttpClient) { }

  getAllFinancing(scenarioId:any): Observable<Financing[]> {
    return this.http.get<Financing[]>(this.apiUrl+'/'+scenarioId);
  }
  createFinancing(revenue:Financing):Observable<any>{
    return this.http.post(this.apiUrl,revenue);
  }
  getFinancingDetails(orgId:any, scenarioId:any): Observable<FinancingDetails[]> {
    return this.http.get<FinancingDetails[]>(this.apiUrl+'/'+orgId+'/'+scenarioId);
  }
}
