import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Organisation } from 'src/app/Model/organisation.model';
import { User, Users } from 'src/app/Model/user.model';
import { LoginService } from 'src/app/services/login.service';
import { OrganisationService } from 'src/app/services/organisation.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
 users : Users [] =[];
 organisation:Organisation={
   organisationId: Guid.create(),
   name: '',
   website: '',
   sector: '',
   subSector: '',
   description: '',
   country: '',
   currency: '',
   foundedYear: undefined
 };
 user:Users={
   userId: '',
   userRoleId: '',
   firstName: '',
   lastName: '',
   email: '',
   password: '',
   organisationId: '',
   userStatus: 0,
   dateofBirth: new Date,
   confirmPassword: ''
 }
 userId:any='';
 orgId:any='';
 editUserDetails:any=true;
 userStatus:any='';
 statusField:boolean= true;
 constructor(private loginService : LoginService,private organisationService:OrganisationService,private route: ActivatedRoute,private router: Router)
 {

 }
  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.orgId = this.route.snapshot.params['orgId'];
    this.loginService.getUsers().subscribe(response => {
      this.users = response;
    });
  }
  viewUser(event:any)
  {
    this.editUserDetails = true;
    this.user = event;
    if(this.user.userStatus == 0)
    {
      this.userStatus = 'Awaiting for Access';
    }
    else if(this.user.userStatus == 1)
    {
      this.userStatus = 'Access Provided'
    }
    else if(this.user.userStatus == 2)
    {
      this.userStatus = 'Access Denied'
    }
    this.organisationService.getOrganisationbyId(this.user.organisationId).subscribe(response => {
      this.organisation = response;
    });
  }
  editUser(event:any)
  {
    this.editUserDetails = false;
    this.user = event;
    if(this.user.userStatus == 0)
    {
      this.userStatus = 'Awaiting for Access';
    }
    else if(this.user.userStatus == 1)
    {
      this.userStatus = 'Access Provided'
    }
    else if(this.user.userStatus == 2)
    {
      this.userStatus = 'Access Denied'
    }
    this.organisationService.getOrganisationbyId(this.user.organisationId).subscribe(response => {
      this.organisation = response;
    });
  }
  deleteUser(event:any)
  {
    this.user = event;
    this.organisationService.deleteUser(this.user.userId).subscribe(response => {
      alert("User deleted successfully");
      window.location.reload();
    })
  }
  change(event:any,userDetailstoUpdate:any)
  {
    if(event.target.value == 0)
    {
      this.userStatus = 'Awaiting for Access';
      this.user.userStatus = 0;
    }
    else if(event.target.value == 1)
    {
      this.userStatus = 'Access Provided';
      this.user.userStatus = 1;
    }
    else if(event.target.value == 2)
    {
      this.userStatus = 'Access Denied';
      this.user.userStatus = 2;
    }
    this.loginService.updateUser(userDetailstoUpdate).subscribe(x=> {
      alert("Updaed Successfully");
      window.location.reload();
    })
  }
  downloadPdf():void{
    const url = 'assets/Thota_T_13086941_2022.pdf';
    window.open(url,'_blank');
  }
  openContact():void{
    this.router.navigate([`/contact/${this.userId}/${this.orgId}`]);
  }
  displayUsers():void{
    this.router.navigate([`/user/${this.userId}/${this.orgId}`]);
  }
  company():void{
    this.router.navigate([`/company/${this.userId}/${this.orgId}`]);
  }
  GotoHome():void{
    this.router.navigate([`/home/${this.userId}/${this.orgId}`]);
  }
}
