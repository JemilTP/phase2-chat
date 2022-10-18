import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient) { }
  getUser(userId: string){
    console.log(userId)
    let res = this.http.post("http://localhost:3000/getUser", {_id: userId})
    return res
  }

  getGroups(groupNames: []){
    let res = this.http.post("http://localhost:3000/getGroups", groupNames)
    return res
  }
}
