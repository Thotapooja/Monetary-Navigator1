import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Scenario } from 'src/app/Model/scenario.model';
import { User } from 'src/app/Model/user.model';
import { LoginService } from 'src/app/services/login.service';
import { ScenarioService } from 'src/app/services/scenario.service';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})
export class ScenarioComponent implements OnInit {
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
  scenario:Scenario={
    scenarioId : 0,
    scenarioName: '',
    organisationId : Guid.create(),
    tax: 0,
    startYear: 2023,
    forecastPeriod: 5,
    marketSize: 0,
    sam:0,
    som:0,
    tam:0
  }
  toolbars:number=2;
  userId:any='';
  scenarios:Scenario[]=[];
  orgId:Guid=Guid.create();
  disableUsers:any;


  constructor(private loginService: LoginService,private http: HttpClient,private router: Router,private route: ActivatedRoute,private scenarioService:ScenarioService)
  {
    
  }
  ngOnInit(): void {
    this.userId = this.route.snapshot.params['userId'];
    this.orgId = this.route.snapshot.params['orgId'];
   this.scenario.organisationId = this.route.snapshot.params['orgId'];
   this.scenario.scenarioId = this.route.snapshot.params['scenarioId'];
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
   this.scenarioService.getAllScenarios(this.scenario.organisationId).subscribe((res)=>{
    this.scenarios = res;
    if(this.scenarios.length>0 && this.scenarios[0].scenarioId == this.scenario.scenarioId)
    {
      this.scenario.forecastPeriod = this.scenarios[0].forecastPeriod,
      this.scenario.marketSize = this.scenarios[0].marketSize,
      this.scenario.organisationId = this.scenarios[0].organisationId,
      this.scenario.sam = this.scenarios[0].sam,
      this.scenario.som = this.scenarios[0].som,
      this.scenario.scenarioName = this.scenarios[0].scenarioName,
      this.scenario.startYear = this.scenarios[0].startYear,
      this.scenario.tam = this.scenarios[0].tam,
      this.scenario.tax = this.scenarios[0].tax,
      this.scenario.scenarioId = this.scenarios[0].scenarioId
    }
   });
   
  }
  login(loginForm: NgForm){
    if(loginForm.valid)
    {
     
    }
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
    this.router.navigate([`/company/${this.userId}/${this.orgId}`]);
  }
  GotoHome():void{
    this.router.navigate([`/home/${this.userId}/${this.orgId}`]);
  }
}
