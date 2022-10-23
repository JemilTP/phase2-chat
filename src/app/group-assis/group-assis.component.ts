import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { ActivatedRoute } from '@angular/router';

import { WebSocketService } from '../services/web-socket.service';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';

@Component({
  selector: 'app-group-admin',
  templateUrl: './group-assis.component.html',
  styleUrls: ['./group-assis.component.css']
})
export class GroupAssisComponent implements OnInit {

  
  user: any = {}
  groups: any 
  constructor(private userService: UserServiceService, private route: ActivatedRoute, private webSocket: WebSocketService) { }
  message = ''
  currentRoom: any = {}
  currentGroup: any = {}
  messageList : {message: string, userName: string}[] = []
  socket: any
  
  ngOnInit(): void {
        
          const userID = String(this.route.snapshot.paramMap.get('userID'))
          console.log(userID, "it worked")
          
          this.userService.getUser(userID).subscribe(res => {
            this.user = res
            console.log(this.user)
           

           this.userService.getGroup({groups: this.user.Groups}).subscribe(res => {
              this.groups = res
              console.log(this.groups)

              this.currentGroup = this.groups[0]
              this.currentRoom = this.currentGroup.rooms[0]

              this.messageList = this.currentRoom.chat
           })
          })
          this.webSocket.listen('message-sent').subscribe((data: any) => {
             
            if (data) {
              console.log(this.groups)
              console.log(data)
              if(data.room.name == this.currentRoom.name){
                console.log("message recieved: ",data)
                this.messageList.push({message: data.message.message, userName: data.userName})
              }else{
                for(let i in this.groups){
                  for(let f in this.groups[i].rooms){
                    
                    if(this.groups[i].rooms[f].name == data.room.name){
                      this.groups[i].rooms[f].chat.push({message: data.message.message, userName: data.message.userName})
                      console.log(this.groups[i].rooms[f])
                      break
                    }
                  }
                }
              }
    
                }
    
          })

          this.webSocket.listen('roomChange').subscribe((res:any)=> {
            console.log("RETURN ", res.group)
            this.currentGroup = res.group
            for(let i in this.currentGroup.rooms){
              console.log(this.currentGroup.rooms[i], res.roomName)
              if(this.currentGroup.rooms[i].name == res.roomName){
                  console.log('equal')
                this.currentRoom = this.currentGroup.rooms[i]
                this.messageList = this.currentRoom.chat
              }
            }
        
          
        })
  }     
  sendMessage(): void{
    let message = {message: this.message, userName: this.user.name}
    this.messageList.push(message)
    console.log(this.currentGroup)
 
   
    
    const element: any = document.getElementById('message-area')
    element.scrollTop = element.scrollHeight
    this.webSocket.emit('message', {group: this.currentGroup, rooms: this.currentGroup, message: message, userName: this.user.name, room: this.currentRoom})
    
   
    this.message = ""
  }



  changeRoom(room: any, group: any){
    console.log("room changed to: ", room.name)
    let groupIndex = this.groups.indexOf(group)
    let roomIndex = this.groups[groupIndex].rooms.indexOf(room)
    this.currentGroup = this.groups[groupIndex] 
    this.currentRoom = this.currentGroup.rooms[roomIndex]
    console.log(this.currentGroup, this.currentRoom)
    this.messageList = this.currentRoom.chat
   // this.webSocket.emit('getGroup', { groupName: groupName, roomName: roomName, user: userName})
    

  }
  changeGroup(groupName: String){
    
  }
  createGroup(){
    const element: any = document.getElementById('message-area')
    
  }
}
