Documentation:

Git repo

Git repos were used to save changes during development. This was done by committing changes to a dev branches when new features were added or bugs were fixed. Then the dev branch was merged into origin branch. This was useful as I needed to go back to previous commits throughout development. The repos are composed to all the angular components, modules, routers and as well as the back-end js files. The components are located in src/app file. They are in their own subgroups. Also in src/app are html files from phase1 and the app components, module, and other app component files.

Data Structures:

Each component ts file had an object var that held: its user information, a global array of all groups (as objects), and a global list of all users. As well as other variables to hold user inputs. Channels were stored in their respective groups. Each group had a list/array of their channels. Chat history are stored in channel objects. The structures and their attributes are as shown below:

Group:

User obj:



















All Users list:




Group obj:




























All groups info:







Responsibilities of Client and server:

This client serves to display the app of course. The server side collects data from the client side and updates the Mongo Database. The client side shows different views depending on the user. Some users of higher roles have more features/inputs, those will be displayed accordingly. The server side will report accordingly to the changes given by the inputs. 


Routes and parameters , return values and purpose:


|Routes|Parameters|Return Value|Purpose|
| :- | :- | :- | :- |
|/message|{{message, username}, groupObject}|{message, userName}, to all users |This is send messages to the backend for saving to Mongo as well as broadcasting messages to all users|
|/getAllUsers|No parameters|Returns list of all users|Get all users to display when managing users|
|/createGroup|Group Obj|No return|Creates a group and updates MongoDB|
|/deleteGroup|Group Obj (no members, no rooms,just name)|No return|Deletes a group from MongoDB|
|/newUser|User Obj (with name, email password…)|No return|Add a user to mongoDB |
|/changeUserRole|User Obj|No return|Updates users role in Mongo DB|
|/CheckUser|userName|Boolean |Check if user exists when adding to rooms or groups|
|/updateGroups|Group Obs|No return|After groups has been edited ( users added/removed, rooms created/ removed ..) it updates MongoDB|
|.getUser|User Obj|Returns user object|User information when displaying main chat page|
|/login|{username, password}|User Obj or empty if wrong credentials|Enable login|
|/getGroup|“” if superAdmin else Groups that user are in|Array of groups that the user is in|To show groups user is in|


Angular architecture:

Each user role has their own component: superAdmin, groupAdmin, groupAssis, user. The app.routing module defines the routes: 

const routes: Routes = [

` `{path: '', component: AppComponent},

` `{path: 'login', component: LoginComponent},

` `{path: 'superAdmin/:userID', component: SuperAdminComponent},

` `{path: 'groupAdmin/:userID', component: GroupAdminComponent},

` `{path: 'groupAssis/:userID', component: GroupAssisComponent},

` `{path: 'user/:userID', component: UserComponent},

];

Services :

Services were used as middleware to reduce repeated code.

Auth.service.ts

- Used to call login route /login

export class AuthService {

` `constructor(private http: HttpClient, private router: Router) { }

`    `login(username: string, password: string){

`      `console.log(username, password)

`      `let res = this.http.post("http://localhost:3000/login", {name: username, password: password})

`      `return res

` `}




}

User-service.ts

- Used to get the groups that the user is in as well as the user information when the user has logged in

export class UserServiceService {

` `constructor(private http: HttpClient) { }

` `getUser(userId: string){

`   `console.log(userId)

`   `let res = this.http.post("http://localhost:3000/getUser", {\_id: userId})

`   `return res

` `}

` `getGroup(groups: any){

`   `let res = this.http.post("http://localhost:3000/getGroup", groups)

`   `return res

` `}

}



Web-socket service

- Used to emit to sockets as well as provide a listing function (socet.on), returns an observable for the user to listen to sockets (messages …)

export class WebSocketService {

` `socket: any

` `readonly url: string = "http://localhost:3000"

` `constructor() {

`     `this.socket = io.io(this.url)

` `}

` `listen(eventName: string){

`   `return new Observable((subscriber) => {

`       `this.socket.on(eventName, (data: any) => {

`         `subscriber.next(data)

`       `})

`   `})

` `}

` `emit(eventName: string, data: any){

`   `this.socket.emit(eventName, data)

` `}

}

Models:

Each component has models used to store user information such as the user Obj, html error elements to display, a list of all groups, list of groups that the user are in as well an models for user inputs so the ui  changes as they do.

` `Example:

` `user: any = {}

` `groups: any

` `message = ''

` `rooms: any = {}

` `currentRoom: any = {}

` `currentGroup: any = {}

` `newRoomName: any = ''

` `newGroupName = ''

` `userAddedToRoom: any = ''

` `roomToAddUser: any = ''

` `userAddedToGroup = ''

` `groupBeingManaged: any = {}

` `messageList: { message: string, userName: string }[] = []

` `socket: any

` `err: any

` `err2: any

` `err3: any

` `roomExistsErr: any

` `userInGroupErr: any

` `allUsers: any

` `newUsername: any

` `newEmail: any

` `newRole: any

` `newPassword: any











Interaction between client and server:

Everytime a user make changes to a client angular model, for example messgeList (by sending a message), creating users/groups (this will update model of users/groups), or managing groups; the changes are saved on the local variables in the component.ts files ( e.g. super-Admin.component.ts), these variables are bound to the html inputs, other models are also displayed (messages, groups, rooms, names). As the local variables change so does its value in the UI.

The sockets in each component serve to update the messages of each room. If one user sends a message to a room, the socket in the server listening will update the DB and broadcast the message to all connected users, the response will update the angular model  variables therefore updating the users UI simultaneously, a user in another room can switch to that room and view that message because the socket is listening to all messages from all rooms.

` `The client sends data to the back end through sockets with the updated variables (messageList, new users/groups…) the backend app.js then saves to the mongoDB. This way the local variables on the client side and the data in the mongoDB are always in sync.

User Updates inputs => local angular models are updated => updated info sent to server, response are sent => server saves to mongoDB




