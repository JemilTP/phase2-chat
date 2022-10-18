import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Router } from '@angular/router';


  
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }
  

     login(username: string, password: string){
       console.log(username, password)
       let res = this.http.post("http://localhost:3000/login", {name: username, password: password})

       return res
  }


    
}
   
  
   
  

