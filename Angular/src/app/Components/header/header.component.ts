import { HttpClient } from '@angular/common/http';
import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { User } from 'src/app/Model/user.model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
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
  constructor(private http:HttpClient,private router:Router, private route: ActivatedRoute, private loginService: LoginService)
  {
    
  }
  ngOnInit(): void {
    this.user.userId = this.route.snapshot.params['userId'];
    this.loginService.getUserbyId(this.user.userId).subscribe(response => {
     this.user = response;
    })
   }
  downloadPdf():void{
    const url = 'assets/Thota_T_13086941_2022.pdf';
    window.open(url,'_blank');
  }
  openContact():void{
    this.router.navigate([`/contact`]);
  }
  displayUsers():void{
    this.router.navigate([`/contact`]);
  }
  company():void{
    this.router.navigate([`/company`]);
  }
}
