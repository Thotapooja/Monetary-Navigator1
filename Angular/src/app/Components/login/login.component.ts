import { Component,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Organisation } from 'src/app/Model/organisation.model';
import { User } from 'src/app/Model/user.model';
import { LoginService } from 'src/app/services/login.service';
import { OrganisationService } from 'src/app/services/organisation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user:User = {
    userId:Guid.create(),
    firstname:'',
    lastname:'',
    email:'',
    userRoleId:'',
    userStatus:0,
    password:'',
    organisationId:Guid.create(),
    dateofBirth:new Date(),
    confirmPassword:'',
  };
  user1:User = {
    userId:Guid.create(),
    firstname:'',
    lastname:'',
    email:'',
    userRoleId:'',
    userStatus:0,
    password:'',
    organisationId:Guid.create(),
    dateofBirth:new Date(),
    confirmPassword:'',
  };
  organisation:Organisation ={
    organisationId: Guid.create(),
    name:'',
    website:'',
    sector:'',
    subSector:'',
    description:'',
    country:'',
    currency:'',
    foundedYear:0
  }
  users:User[] =[];
  organisations: Organisation[]=[];

  constructor(private loginService:LoginService, private router:Router,private orgService:OrganisationService)
  {

  }
  ngOnInit(): void {
    this.users = this.getAllUsers();
    console.log("Users",this.users);
  }

   login(loginForm: NgForm){
    if (loginForm.valid) {
      //this.user.userId='';
      // Perform login logic here, e.g., send login request to the server
      this.user.email = loginForm.form.value.email;
      this.user.password = loginForm.form.value.password;
      console.log('Email:', this.user.email);
      //console.log(this.user.email);
      this.users = this.getAllUsers();
      console.log("Users",this.users);
      this.users.forEach(x =>{
        if(x.email === this.user.email && x.password === this.user.password && x.userStatus==1)
        {
          this.user.userId = x.userId,
          this.user.userRoleId = x.userRoleId,
          this.user.password = x.password,
          this.user.firstname = x.firstname,
          this.user.lastname = x.lastname,
          this.user.userStatus = x.userStatus,
          this.user.organisationId = x.organisationId;
          if(this.user.userId != null)
          {
            localStorage.setItem('userId',this.user.userId.toString());
          }
          if(this.user.organisationId!=null)
          {
            localStorage.setItem('organisationId',this.user.organisationId.toString());
          }
          
        }
        else if(x.email === this.user.email && x.password === this.user.password && x.userStatus == 0){
          alert("Your account setup is in progress. It will take 3 working days for the admin to approve your account");
          this.router.navigate([`/login`]);
        }
        else if(x.email === this.user.email && x.password === this.user.password && x.userStatus == 2)
        {
          alert("Sorry! Admin has rejected your account");
          this.router.navigate([`/login`]);
        }
      });
      this.getUserById(this.user.userId);
      //if(this.user.email == loginForm.form.value.email)
      //{
        //this.router.navigate([`/home`]);
      //}
      /*this.loginService.getUserbyCredentials(this.user.email,this.user.password).subscribe((data:any) => {
        this.user = data
      },
      error =>{
        console.log(error)
      });
      this.getUserById(this.user.userId);*/
    }
  }
  getAllUsers(): User[]{
     this.loginService.getAllUsers().subscribe({
      next: (usersData:User[]) => {
        this.users = usersData;
        console.log("Web api User",this.users);
        return usersData;
      }
     });
     return this.users;
  }
  getUserById(id:any):void{
    this.loginService.getUserbyId(id).subscribe(response =>
      {
        if(response.userId == this.user.userId)
        {
          this.user1 = response;
          this.router.navigate([`/home/${this.user.userId}/${this.user.organisationId}`]);
        }
        else{
          console.log("Not found");
          
        }
      }
      );
  }
  isLoginPage(): boolean {
    this.user=this.user;
    return true;
  }
}

