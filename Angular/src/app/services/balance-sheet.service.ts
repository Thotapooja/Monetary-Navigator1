import { Injectable } from '@angular/core';
import { Assets } from '../Model/assets.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Income } from '../Model/income.model';

@Injectable({
  providedIn: 'root'
})
export class BalanceSheetService {

  apiUrl = 'https://localhost:7072/api/Balancesheet'; 

  constructor(private http: HttpClient) { }

  getBalanceSheetDetails(orgId:any, scenarioId:any): Observable<Income[]> {
    return this.http.get<Income[]>(this.apiUrl+'/'+orgId+'/'+scenarioId);
  }
}
