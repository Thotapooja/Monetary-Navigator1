import { HttpClient } from '@angular/common/http';
import { Component,HostListener,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Scenario } from 'src/app/Model/scenario.model';
import { User } from 'src/app/Model/user.model';
import { LoginService } from 'src/app/services/login.service';
import { ScenarioService } from 'src/app/services/scenario.service';
import { v5 } from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
  user1:any;
  orgId:Guid=Guid.create();
  enable:boolean = false;
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
  scenarios:Scenario[]=[];
  allScenarios:Scenario[]=[];
  disableUsers:any;
  constructor(private http: HttpClient,private router: Router,private route: ActivatedRoute, private loginService: LoginService,private scenarioService:ScenarioService)
  {

  }
  ngOnInit(): void {
    this.user.userId = this.route.snapshot.params['userId'];
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
   this.scenario.organisationId = this.route.snapshot.params['orgaId'];
   this.scenarioService.getAllScenarios(this.scenario.organisationId).subscribe((res)=>{
    this.scenarios = res;
    if(this.scenarios.length == 0)
    {
      this.scenario.scenarioName = "Scenario";
    }
    if(this.scenarios.length>0)
    {
      this.scenario.scenarioName = "Scenario"+this.scenarios.length;
      this.scenario.scenarioId = this.scenarios[0].scenarioId;
      this.enable = true;
    }
    });
    console.log("User Scenarios Are",this.scenarios);
    this.scenarioService.getScenarios().subscribe((res)=>{
      this.allScenarios = res;
    });
    
   console.log("Org Id from Home Component",this.scenario.organisationId);
  }
  addScenario(){ 
    this.scenario.scenarioId = this.allScenarios.length+1;
    this.scenarioService.createScenario(this.scenario).subscribe((res)=>{
      this.router.navigate([`/scenario/${this.scenario.organisationId}/${this.scenario.scenarioId}`]);
      alert("Added Successfully");
      window.location.reload();
    });
    
  }
  viewDashboard(){
    this.router.navigate([`/scenario/${this.user.userId}/${this.scenario.organisationId}/${this.scenario.scenarioId}`]);
  }
  downloadPdf():void{
    const url = 'assets/Thota_T_13086941_2022.pdf';
    window.open(url,'_blank');
  }
  openContact():void{
    this.router.navigate([`/contact/${this.user.userId}/${this.scenario.organisationId}`]);
  }
  displayUsers():void{
    this.router.navigate([`/user/${this.user.userId}/${this.scenario.organisationId}`]);
  }
  company():void{
    this.router.navigate([`/company/${this.user.userId}/${this.scenario.organisationId}`]);
  }
  
}
