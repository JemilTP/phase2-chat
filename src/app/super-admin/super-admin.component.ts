import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { ActivatedRoute } from '@angular/router';

import { WebSocketService } from '../services/web-socket.service';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { ReadPropExpr } from '@angular/compiler';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {
  user: any = {}
  groups: any
  message = ''
  rooms: any = {}
  currentRoom: any = {}
  currentGroup: any = {}
  newRoomName: any = ''
  newGroupName = ''
  userAddedToRoom: any = ''
  roomToAddUser: any = ''
  userAddedToGroup = ''
  groupBeingManaged: any = {}
  messageList: { message: string, userName: string }[] = []
  socket: any
  err: any
  err2: any
  err3: any
  roomExistsErr: any
  userInGroupErr: any

  allUsers: any
  newUsername: any
  newEmail: any
  newRole: any 
  newPassword: any
  constructor(private userService: UserServiceService, private route: ActivatedRoute, private webSocket: WebSocketService) { }

  ngOnInit(): void {

    this.err = document.getElementById('didNotFindUser')
    this.err2 = document.getElementById('userAlreadyInRoom')
    this.err3 = document.getElementById('roomDoesNotExist')
    this.roomExistsErr = document.getElementById('roomExists')
    this.userInGroupErr = document.getElementById('userAlreadyInGroup')
    const userID = String(this.route.snapshot.paramMap.get('userID'))
    console.log(userID, "it worked")

    this.userService.getUser(userID).subscribe(res => {
      this.user = res

      console.log(this.user)
      console.log("name: ", this.user.name)


      this.userService.getGroup({ groups: "" }).subscribe((res: any) => {

        this.groups = res
        this.currentGroup = this.groups[0]
        this.currentRoom = this.currentGroup.rooms[0]

        this.messageList = this.currentRoom.chat

      })
    })

    this.webSocket.emit('getAllUsers','')
    this.webSocket.listen('returnAllUsers').subscribe((res: any) => {
      this.allUsers = res.allUsers
    })

    this.webSocket.listen('message-sent').subscribe((data: any) => {

      if (data) {
        console.log(this.groups)
        console.log(data)
        if (data.room.name == this.currentRoom.name) {
          console.log("message recieved: ", data)
          this.messageList.push({ message: data.message.message, userName: data.userName })
        } else {
          for (let i in this.groups) {
            for (let f in this.groups[i].rooms) {

              if (this.groups[i].rooms[f].name == data.room.name) {
                this.groups[i].rooms[f].chat.push({ message: data.message.message, userName: data.message.userName })
                console.log(this.groups[i].rooms[f])
                break
              }
            }
          }
        }

      }

    })

    this.webSocket.listen('roomChange').subscribe((res: any) => {
      console.log("RETURN ", res.group)
      this.currentGroup = res.group
      for (let i in this.currentGroup.rooms) {
        console.log(this.currentGroup.rooms[i], res.roomName)
        if (this.currentGroup.rooms[i].name == res.roomName) {

          this.currentRoom = this.currentGroup.rooms[i]
          this.messageList = this.currentRoom.chat
        }
      }


    })
    this.webSocket.listen('newGroup').subscribe((res: any) => {
      this.groups.push(res)
      console.log(res)
    })

  }
  sendMessage(): void {
    let message = { message: this.message, userName: this.user.name }
    this.messageList.push(message)
    console.log(this.currentGroup)



    this.webSocket.emit('message', { group: this.currentGroup, rooms: this.currentGroup, message: message, userName: this.user.name, room: this.currentRoom })


    this.message = ""
  }


  changeRoom(room: any, group: any) {
    console.log("room changed to: ", room.name)
    let groupIndex = this.groups.indexOf(group)
    let roomIndex = this.groups[groupIndex].rooms.indexOf(room)
    this.currentGroup = this.groups[groupIndex]
    this.currentRoom = this.currentGroup.rooms[roomIndex]
    console.log(this.currentGroup, this.currentRoom)
    this.messageList = this.currentRoom.chat
    // this.webSocket.emit('getGroup', { groupName: groupName, roomName: roomName, user: userName})


  }


  createGroup() {
    this.webSocket.emit("createGroup", { groupName: this.newGroupName })
    console.log("groupCreated", this.newGroupName)

    this.newGroupName = ''



  }
  removeUserFromGroup(user: string) {
    let index = this.groupBeingManaged.members.indexOf(user)
    this.groupBeingManaged.members.splice(index, 1)

    for (let i in this.groupBeingManaged.rooms) {
      let userIndex = this.groupBeingManaged.rooms[i].members.indexOf(user)
      console.log(userIndex, this.groupBeingManaged.rooms[i])
      if (userIndex != -1) {
        this.groupBeingManaged.rooms[i].members.splice(userIndex, 1)
      }
    }
  }
  deleteGroup() {
    this.webSocket.emit('deleteGroup', { groupName: this.groupBeingManaged.name })
    this.groups = this.groups.filter((group: any) => group.name != this.groupBeingManaged.name)
    this.groupBeingManaged = {}
    this.closeForm('manageGroup')
  } 
  deleteRoom(roomName: string) {
    console.log(this.groups)
    let groupName = this.groupBeingManaged.name;
    let index = this.groups.indexOf(this.groupBeingManaged)
    this.groups[index].rooms = this.groups[index].rooms.filter((rooms: any) => rooms.name != roomName)
    this.groupBeingManaged.rooms = this.groupBeingManaged.rooms.filter((room: any) => room.name != roomName)
    this.webSocket.emit('updateGroup', this.groupBeingManaged)
  }
  createRoom() {
    let index = this.groups.indexOf(this.groupBeingManaged)
    console.log(index, this.groups, this.groupBeingManaged)
    let roomExists = false
    if (this.newRoomName != '') {
      for (let i in this.groups[index].rooms) {
        if (this.groups[index].rooms[i].name == this.newRoomName) {
          roomExists = true
        }
      }


      if (roomExists == false) {
        this.groups[index].rooms.push({ name: this.newRoomName, members: [], chat: [] })
        this.newRoomName = ''
        this.roomExistsErr.style.display = 'none'
      } else {
        this.roomExistsErr.style.display = 'block'
        this.newRoomName = ''

      }
    }

  }
  manageGroup(group: any) {
    this.groupBeingManaged = group
    this.openForm('manageGroup')
    this.err.style.display = 'none'
    this.err2.style.display = 'none'
    this.err3.style.display = 'none'
  }
  removeUserFromRoom(userName: string, room: string) {
    let index = this.groups.indexOf(this.groupBeingManaged)
    let roomIndex = this.groups[index].rooms.indexOf(room)
    this.groups[index].rooms[roomIndex].members = this.groups[index].rooms[roomIndex].members.filter((user: any) => user != userName)
    this.webSocket.emit('updateGroup', this.groupBeingManaged)
    console.log(this.groups[index].rooms)
    console.log(this.groupBeingManaged.rooms)
  }
  addUserToGroup(){
    let userIndex = this.groupBeingManaged.members.indexOf(this.userAddedToGroup)
   
    if(userIndex != -1){
      console.log(this.userAddedToGroup)
      this.userInGroupErr.style.display = 'block'
    }else{
      this.userInGroupErr.style.display = 'none'
      this.webSocket.emit('checkUser', {userName: this.userAddedToGroup})
      this.webSocket.listen('userChecked').subscribe((res: any) => {
          if(res.userExists && this.userAddedToGroup != ''){
              this.groupBeingManaged.members.push(this.userAddedToGroup)
              this.userAddedToGroup = ''
              this.userInGroupErr.style.display = 'none'
          }else{

          }
      })
    }
  }
  userIsUser(userName: string) : boolean{
    for(let i in this.allUsers){
      if(this.allUsers[i].name == userName && this.allUsers[i].role == 'user'){
        return true
      }
    }
    return false
  }
  addUserToRoom() {

    if (this.userAddedToRoom != '' && this.roomToAddUser != '') {
      let roomIndex: any = -1
      console.log(this.userAddedToRoom, this.roomToAddUser)

      this.webSocket.emit("checkUser", { userName: this.userAddedToRoom })
      this.webSocket.listen("userChecked").subscribe((res: any) => {
          console.log(res)
        let userExists = res.userExists
        let roomExists = false
        let userAlreadyInRoom = true
        if (userExists == false) {

          this.err.style.display = 'block'


        } else {
          this.err.style.display = 'none'
        }



        for (let i in this.groupBeingManaged.rooms) {
          if (this.groupBeingManaged.rooms[i].name == this.roomToAddUser) {
            roomIndex = i
            roomExists = true
            this.err3.style.display = 'none'
            if (this.groupBeingManaged.rooms[i].members.indexOf(this.userAddedToRoom) != -1) {


              this.err.style.display = 'none'
              this.err2.style.display = 'block' //user already in room

            } else {
              userAlreadyInRoom = false
              this.err2.style.display = 'none'
            }
          }
        }
        console.log(userExists, roomExists, userAlreadyInRoom, this.userAddedToRoom, this.roomToAddUser)
        console.log()
        if (roomExists && userExists && userAlreadyInRoom == false && this.userAddedToRoom != '') {
          console.log(userExists, roomExists, userAlreadyInRoom)
          this.groupBeingManaged.rooms[roomIndex].members.push(this.userAddedToRoom)
          if(this.groupBeingManaged.members.indexOf(this.userAddedToRoom) == -1 ){
                this.groupBeingManaged.members.push(this.userAddedToRoom)
                this.user.Groups.push(this.groupBeingManaged.name)
          }
          this.userAddedToRoom = ''
          this.roomToAddUser = ''
          this.err.style.display = 'none'
          this.err2.style.display = 'none'
          this.err3.style.display = 'none'
          return
        }
        if (roomExists == false  && this.userAddedToRoom != '') {
          this.err3.style.display = 'block'
          this.err2.style = 'none'
        }

      })
    } else {
      this.err.style.display = 'none'
      this.err2.style.display = 'none'
      this.err3.style.display = 'none'
    }
  }
  closeMng() {
    this.userAddedToRoom = ''
    this.newRoomName = ''
    this.roomToAddUser = ''
    let err: any = document.getElementById('didNotFindUser')
    let err2: any = document.getElementById('userAlreadyInRoom')
    err.style.display = 'none'
    err2.style.display = 'none'
  }
  openForm(formID: string) {
    let form: any = document.getElementById(formID)
    let page: any = document.getElementById('Page')
    let chatTitle: any = document.getElementById('chat-title')
    let messageBar: any = document.getElementById('form')
    chatTitle.style.display = 'none'
    messageBar.style.display = 'none'
    page.style.display = 'none'
    form.style.display = 'block'

  }
  closeForm(formID: string) {
    let form: any = document.getElementById(formID)
    let page: any = document.getElementById('Page')
    let chatTitle: any = document.getElementById('chat-title')
    let messageBar: any = document.getElementById('form')
    chatTitle.style.display = 'block'
    messageBar.style.display = 'block'
    page.style.display = 'block'
    form.style.display = 'none'

  }

  deleteUser(user: any){
    this.webSocket.emit('deleteUser', {userName: user.name})
    let userIndex = this.allUsers.indexOf(user)
    if (userIndex != -1){
      this.allUsers.splice(userIndex, 1)
    }
  }
  changeUserRole(user: any, role: any){
    this.webSocket.emit('changeUserRole', {userName: user.name, role: role})
    let userIndex = this.allUsers.indexOf(user)
    this.allUsers[userIndex].role = role
  }
  addUser(){
      let newUser = {name: this.newUsername, password: this.newPassword, role: this.newRole, email: this.newEmail, Groups: []}

      this.allUsers.push(newUser)
      this.webSocket.emit('newUser',newUser)
      this.newUsername = ''
      this.newPassword = ''
      this.newEmail = ''
      this.newRole = ''
  }
  closeUserPopup(){
    this.newUsername = ''
    this.newPassword = ''
    this.newEmail = ''
    this.newRole = ''
    window.location.reload()
  }
}
