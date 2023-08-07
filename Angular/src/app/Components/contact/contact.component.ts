import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Contact } from 'src/app/Model/contact.model';
import { User } from 'src/app/Model/user.model';
import { ContactService } from 'src/app/services/contact.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contact:Contact = {
    emailAddress:'',
    subject:'',
    message:''
  };
  userId:any='';
  orgId:any ='';
  disableUsers:any;
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
  constructor(private route:ActivatedRoute,private router: Router,private contactService:ContactService, private loginService: LoginService)
  {

  }
  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.orgId = this.route.snapshot.params['orgaId'];
    this.loginService.getUserbyId(this.user.userId).subscribe(response => {
      this.user = response;
    });
    if(this.user.userRoleId == '871F89D4-AC1D-4D78-9854-E9E8DE01EC7A')
    {
      this.disableUsers = false;
    }
    if(this.user.userRoleId == 'EBB2DDBC-5E74-4247-83D4-A8A314AB12A3')
    {
      this.disableUsers = true;
    }
  }
  login(contactForm: NgForm){
    if (contactForm.valid) {
      // Perform login logic here, e.g., send login request to the server
     this.contact.emailAddress = contactForm.form.value.emailAddress;
     this.contact.subject = contactForm.form.value.subject;
     this.contact.message = contactForm.form.value.message;
     this.contactService.sendEmail(this.contact).subscribe((response: Response) =>
      {
        console.log(response),
        alert("Mail send successfully");
      });
    }
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
}
