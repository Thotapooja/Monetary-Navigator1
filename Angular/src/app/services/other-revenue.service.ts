import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Revenue, ProductDetails } from '../Model/revenue.model';
import { OtherRevenue, OtherRevenueDetails } from '../Model/otherRevenue.model';

@Injectable({
  providedIn: 'root'
})
export class OtherRevenueService {

  apiUrl = 'https://localhost:7072/api/OtherRevenue'; 

  constructor(private http: HttpClient) { }

  getAllScenarios(scenarioId:any): Observable<OtherRevenue[]> {
    return this.http.get<OtherRevenue[]>(this.apiUrl+'/'+scenarioId);
  }
  /*getScenarios():Observable<Revenue[]> {
    var url = 'https://localhost:7072/api/AllScenario'
    return this.http.get<Revenue[]>(url);
  }*/
  createOtherRevenue(revenue:OtherRevenue):Observable<any>{
    return this.http.post(this.apiUrl,revenue);
  }
  getProductDetails(orgId:any, scenarioId:any): Observable<OtherRevenueDetails[]> {
    return this.http.get<OtherRevenueDetails[]>(this.apiUrl+'/'+orgId+'/'+scenarioId);
  }
}
