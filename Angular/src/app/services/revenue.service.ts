import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Scenario } from '../Model/scenario.model';
import { ProductDetails, Revenue } from '../Model/revenue.model';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  apiUrl = 'https://localhost:7072/api/Revenue'; 

  constructor(private http: HttpClient) { }

  getAllScenarios(scenarioId:any): Observable<Revenue[]> {
    return this.http.get<Revenue[]>(this.apiUrl+'/'+scenarioId);
  }
  /*getScenarios():Observable<Revenue[]> {
    var url = 'https://localhost:7072/api/AllScenario'
    return this.http.get<Revenue[]>(url);
  }*/
  createProduct(revenue:Revenue):Observable<any>{
    return this.http.post(this.apiUrl,revenue);
  }
  getProductDetails(orgId:any, scenarioId:any): Observable<ProductDetails[]> {
    return this.http.get<ProductDetails[]>(this.apiUrl+'/'+orgId+'/'+scenarioId);
  }
}
