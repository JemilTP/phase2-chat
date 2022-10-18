import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { ActivatedRoute} from '@angular/router'


@Component({
  selector: 'app-group-assis',
  templateUrl: './group-assis.component.html',
  styleUrls: ['./group-assis.component.css']
})
export class GroupAssisComponent implements OnInit {

 
  user: any
  groups: any
  constructor(private userService: UserServiceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
        
          const userID = String(this.route.snapshot.paramMap.get('userID'))
          console.log(userID, "it worked")
          
          this.userService.getUser(userID).subscribe(res => {
            this.user = res
            console.log(this.user)
           

           this.userService.getGroups(this.user.Groups).subscribe(res => {
              this.groups = res
              console.log(this.groups)
           })
          })
  }     
}
