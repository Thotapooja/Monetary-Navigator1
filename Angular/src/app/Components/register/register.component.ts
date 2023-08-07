import { Component ,OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { User, Users } from 'src/app/Model/user.model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  maxBirthDate: string | undefined;
  user:Users = {
    userId:'',
    userRoleId:'',
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    userStatus:0, 
    organisationId:'',
    dateofBirth:new Date(),
    confirmPassword:'',
  };
  constructor(private loginService:LoginService, private router:Router){

  }
  ngOnInit(): void {
    let auxDate = this.substractYearsToDate(new Date(), 18);
    this.maxBirthDate = this.getDateFormateForSearch(auxDate);
    
  }
  substractYearsToDate(auxDate: Date, years: number): Date {
    auxDate.setFullYear(auxDate.getFullYear() - years);
    return auxDate;
  }
  getDateFormateForSearch(date: Date): string {
    let year = date.toLocaleDateString('es', { year: 'numeric' });
    let month = date.toLocaleDateString('es', { month: '2-digit' });
    let day = date.toLocaleDateString('es', { day: '2-digit' });
    return `${year}-${month}-${day}`;
  }
  login(loginForm: NgForm){
    if(loginForm.valid)
    {
      this.user.email = loginForm.form.value.email;
      this.user.firstName = loginForm.form.value.firstname;
      this.user.lastName = loginForm.form.value.lastname;
      this.user.password = loginForm.form.value.password;
      this.user.confirmPassword = loginForm.form.value.confirmPassword;
      if(this.user.password != this.user.confirmPassword)
      {
        alert("Can you please confirm the password again!");
      }
      this.user.dateofBirth =  loginForm.form.value.dob;
      this.loginService.createUser(this.user).subscribe(response =>{
        alert("Your account setup is in progress. It will take 3 working days for the admin to approve your account");
        this.router.navigate([`/login`]);
      })
    }
  }
}
