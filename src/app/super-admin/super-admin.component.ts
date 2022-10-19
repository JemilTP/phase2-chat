import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { ActivatedRoute} from '@angular/router';
import * as io from 'socket.io-client'
import { timeout } from 'rxjs';
import { WebSocketService } from '../services/web-socket.service';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {
  user: any = {}
  userName: string = ""
  groups: any = {}
  message = ''
  messageList : {message: string, userName: string, mine: boolean}[] = []
  socket: any
  constructor(private userService: UserServiceService, private route: ActivatedRoute, private webSocket: WebSocketService) { }

  ngOnInit(): void {
        
          
          const userID = String(this.route.snapshot.paramMap.get('userID'))
          console.log(userID, "it worked")
           
          this.userService.getUser(userID).subscribe(res => {
            this.user = res
            this.userName = this.user.name
            console.log(this.user)
           console.log("name: ",this.userName)
          

           this.userService.getGroups(this.user.Groups).subscribe(res => {
              this.groups = res
              console.log(this.groups)
           })  })
           
           this.webSocket.listen('message-sent').subscribe((data: any) => {
            if (data) {
              this.messageList.push({message: data.message, userName: data.userName, mine: false});
            }
          })
          
  }     
  sendMessage(): void{
    this.webSocket.emit('message', {message: this.message, userName: this.user.name})
    console.log(this.message)
    this.messageList.push({message: this.message, userName: this.userName, mine: true})
    this.message = ""
  }
  createGroup(){
    
    console.log("create group")
  }
}
