import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, Users } from '../Model/user.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl = 'https://localhost:7072/api/Login'; 

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  getUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.apiUrl);
  }
  getUserbyId(id : any):Observable<User>{
    return this.http.get<User>(this.apiUrl+'/'+id);
  }
  getUserbyCredentials(email:string, password:string){
    const url = `${this.apiUrl}/${email}/${password}`;
    return this.http.get<User>(url);
  }
  updateUser(user:any):Observable<User>{
    var url = 'https://localhost:7072/api/Signup'; 
    return this.http.put<User>(url,user);
  }
  createUser(user:any):Observable<any>{
    var url = 'https://localhost:7072/api/Signup'; 
    return this.http.post<any>(url,user);
  }
}
