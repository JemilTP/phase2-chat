import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import {HttpClient} from '@angular/common/http'
import {  Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserServiceService } from '../services/user-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService, private user: UserServiceService) {
    
   }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
        username:[''],
        password:['']
    })
  }

  onSubmit(){
    if(!this.loginForm.valid){
      console.log("KK")
      return
    }
    const username = this.loginForm.value.username
    const password = this.loginForm.value.password
    let obs = this.authService.login(username, password)
    
    //let userData: any
     obs.subscribe(res => {
        
        let url = ""
        let userData: any
        
        userData = res
        console.log(userData._id)
        if(userData.length != []){
            
            console.log(userData)
            if (userData.role == "superAdmin"){
                url = "/superAdmin/" + userData._id
            }
            if (userData.role == "groupAdmin"){
              url = "groupAdmin/" + userData._id
            }
            if (userData.role == "groupAssis"){
              url = "groupAssis/" + userData._id
            }
            if (userData.role == "user"){
              url = "user/" + userData._id
            }
            console.log(url) 
           
            this.router.navigateByUrl(url)

            
          }
          
}) 
  }
    
    
    

  

}
