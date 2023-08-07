import { Injectable } from '@angular/core';
import { Assets, AssetsDetails } from '../Model/assets.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  apiUrl = 'https://localhost:7072/api/Assets'; 

  constructor(private http: HttpClient) { }

  getAllAssets(scenarioId:any): Observable<Assets[]> {
    return this.http.get<Assets[]>(this.apiUrl+'/'+scenarioId);
  }
  createAssets(revenue:Assets):Observable<any>{
    return this.http.post(this.apiUrl,revenue);
  }
  getAssetDetails(orgId:any, scenarioId:any): Observable<AssetsDetails[]> {
    return this.http.get<AssetsDetails[]>(this.apiUrl+'/'+orgId+'/'+scenarioId);
  }
}
