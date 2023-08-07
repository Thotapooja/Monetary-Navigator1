import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Model/user.model';
import { Observable, map } from 'rxjs';
import { Organisation } from '../Model/organisation.model';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {
  apiUrl:string;
  
  constructor(private http: HttpClient) { 
    this.apiUrl = 'https://localhost:7072/api/Organisation'; 

  }
  public organisations:Organisation[]=[];
  organisation:Organisation ={
    organisationId: Guid.create(),
    name:'',
    website:'',
    sector:'',
    subSector:'',
    description:'',
    country:'',
    currency:'',
    foundedYear:0
  }
  getAllOrganisations(): Observable<Organisation[]> {
    return this.http.get<Organisation[]>(this.apiUrl);
  }
  getAllOrganisation(){
    return this.http.get<Organisation[]>(this.apiUrl);
  }
  getOrganisationbyId(id : any):Observable<Organisation>{
    return this.http.get<Organisation>(this.apiUrl+'/'+id);
  }
  getOrganisation(id: any){
    this.http.get(this.apiUrl+'/'+id).subscribe(data => {
      console.log(data);
    })
  }
  deleteUser(id:any):Observable<any>{
    return this.http.delete<any>(this.apiUrl+'/'+id);
  }
  updateOrganisation(org:Organisation):Observable<Organisation>{
    return this.http.put<Organisation>(this.apiUrl,org);
  }
}
