import { Component,Injectable,Input ,OnInit} from '@angular/core';
import { User } from 'src/app/Model/user.model';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LoginService } from 'src/app/services/login.service';
import { Organisation } from 'src/app/Model/organisation.model';
import { OrganisationService } from 'src/app/services/organisation.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Guid } from 'guid-typescript';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
  providers:[HomeComponent,LoginComponent]
})
@Injectable()
export class CompanyComponent implements OnInit{
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
  users:User[] =[];
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
  organisations:Organisation[]=[];
  orgId:Guid = Guid.create();
  apiUrl = 'https://localhost:7072/api/Organisation'; 
  disableUsers:any;
  constructor(private route:ActivatedRoute,private router: Router,private login:LoginComponent,private home:HomeComponent,private loginService:LoginService,private organisationService: OrganisationService,private http:HttpClient){}
  ngOnInit(): void {
    this.user.userId = this.route.snapshot.params['userId'];
    this.orgId = this.route.snapshot.params['orgId'];
    this.organisation.organisationId = this.orgId;
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
    this.organisations = this.getAllOrganisations();
    this.getOrganisationbyId(this.organisation.organisationId);
  }
  getAllOrganisations():Organisation[]{
    this.organisationService.getAllOrganisations().subscribe(res=>this.organisations = res);
    return this.organisations;
  }
  getOrganisationbyId(orgId1:any):void{
    this.organisationService.getOrganisationbyId(orgId1).subscribe(res =>this.organisation = res)
  }
  downloadPdf():void{
    const url = 'assets/Thota_T_13086941_2022.pdf';
    window.open(url,'_blank');
  }
  openContact():void{
    this.router.navigate([`/contact/${this.user.userId }/${this.orgId}`]);
  }
  displayUsers():void{
    this.router.navigate([`/user/${this.user.userId }/${this.orgId}`]);
  }
  company():void{
    this.router.navigate([`/company/${this.user.userId }/${this.orgId}`]);
  }
  GotoHome():void{
    this.router.navigate([`/home/${this.user.userId }/${this.orgId}`]);
  }
  changeName(companyForm:any)
  {
    this.organisationService.getOrganisationbyId(this.orgId).subscribe(res =>this.organisation = res)
    this.organisation.name = companyForm.form.value.name;
    this.organisationService.updateOrganisation(this.organisation).subscribe(response =>{
      alert("Company Name Updated Successfully");
      window.location.reload();
    })
  }
  changeWebsite(companyForm:any)
  {
    this.organisationService.getOrganisationbyId(this.orgId).subscribe(res =>this.organisation = res)
    this.organisation.website = companyForm.form.value.website;
    this.organisationService.updateOrganisation(this.organisation).subscribe(response =>{
      alert("Company Website Updated Successfully");
      window.location.reload();
    })
  }
  changeSector(companyForm:any)
  {
    this.organisationService.getOrganisationbyId(this.orgId).subscribe(res =>this.organisation = res)
    this.organisation.sector = companyForm.form.value.sector;
    this.organisationService.updateOrganisation(this.organisation).subscribe(response =>{
      alert("Company Sector Updated Successfully");
      window.location.reload();
    })
  }
  changeSubSector(companyForm:any)
  {
    this.organisationService.getOrganisationbyId(this.orgId).subscribe(res =>this.organisation = res)
    this.organisation.subSector = companyForm.form.value.subSector;
    this.organisationService.updateOrganisation(this.organisation).subscribe(response =>{
      alert("Company Sub-sector Updated Successfully");
      window.location.reload();
    })
  }
  changeDescription(companyForm:any)
  {
    this.organisationService.getOrganisationbyId(this.orgId).subscribe(res =>this.organisation = res)
    this.organisation.description = companyForm.form.value.description;
    this.organisationService.updateOrganisation(this.organisation).subscribe(response =>{
      alert("Company Description Updated Successfully");
      window.location.reload();
    })
  }
  changeCountry(companyForm:any)
  {
    this.organisationService.getOrganisationbyId(this.orgId).subscribe(res =>this.organisation = res)
    this.organisation.country = companyForm.form.value.country;
    this.organisationService.updateOrganisation(this.organisation).subscribe(response =>{
      alert("Company Country Updated Successfully");
      window.location.reload();
    })
  }
  changeCurrency(companyForm:any)
  {
    this.organisationService.getOrganisationbyId(this.orgId).subscribe(res =>this.organisation = res)
    this.organisation.currency = companyForm.form.value.currency;
    this.organisationService.updateOrganisation(this.organisation).subscribe(response =>{
      alert("Company Currency Updated Successfully");
      window.location.reload();
    })
  }
  changeFoundedYear(companyForm:any)
  {
    this.organisationService.getOrganisationbyId(this.orgId).subscribe(res =>this.organisation = res)
    this.organisation.foundedYear = companyForm.form.value.foundedYear;
    this.organisationService.updateOrganisation(this.organisation).subscribe(response =>{
      alert("Company Founded Year Updated Successfully");
      window.location.reload();
    })
  }
}

