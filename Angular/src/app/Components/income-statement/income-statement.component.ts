import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Income } from 'src/app/Model/income.model';
import { Month } from 'src/app/Model/month';
import { Months } from 'src/app/Model/months.model';
import { Scenario } from 'src/app/Model/scenario.model';
import { User } from 'src/app/Model/user.model';
import { Years } from 'src/app/Model/years.model';
import { IncomeService } from 'src/app/services/income.service';
import { LoginService } from 'src/app/services/login.service';
import { ScenarioService } from 'src/app/services/scenario.service';

@Component({
  selector: 'app-income-statement',
  templateUrl: './income-statement.component.html',
  styleUrls: ['./income-statement.component.css']
})
export class IncomeStatementComponent implements OnInit {
  userId:any='';
  orgId:any='';
  scenarioId :any='';
  scenarios:Scenario [] =[];
  years:Years[]=[];
  year:any = 0;
  forecastPeriod:any = 0;
  j:number = 0;
  revenueStartYear :any;
  monthsList:Months[] = [];
  month:any =[];
  displayFirstYearValues = false;
  displaySecondYearValues = false;
  displayThirdYearValues = false;
  displayFourYearValues = false;
  displayFiveYearValues = false;
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
  incomeDetails: Income[]=[];
  incomeSales:Income[]=[];
  incomeCogs: Income[]=[];
  incomeGrossMargin: Income[]=[];
  incomeGrossMarginPer: Income[]=[];
  incomeInterest: Income[]=[];
  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private scenarioService:ScenarioService, 
              private loginService: LoginService,
              private incomeService: IncomeService)
  {
    
  }
  ngOnInit(): void {
    this.orgId = this.route.snapshot.params['orgId'];
    this.scenarioId = this.route.snapshot.params['scenarioId'];
    this.userId = this.route.snapshot.params['userId'];
    this.years = [];
    this.monthsList = [];
    this.scenarioService.getAllScenarios(this.orgId).subscribe(response => {
      this.scenarios = response;
    });
    this.loginService.getUserbyId(this.userId).subscribe(response => {
      this.user = response;
    });
    this.incomeService.getIncomeDetails(this.orgId,this.scenarioId).subscribe(response =>{
      this.incomeDetails = response;
    })
    if(this.scenarios.length>0)
    {
      this.year = this.scenarios[0].startYear;
      this.forecastPeriod = this.scenarios[0].forecastPeriod;
    }
    for(var i = this.year; i< this.year + this.forecastPeriod;i++)
    {
      this.years.push({
        id: this.j,
        year: i
      });
      this.j++;
    } 
    this.month = Object.values(Month);
    this.monthsList.push({
      id: 1,
      month: this.month[0]
    })
    this.monthsList.push({
      id: 2,
      month: this.month[1]
    })
    this.monthsList.push({
      id: 3,
      month: this.month[2]
    })
    this.monthsList.push({
      id: 4,
      month: this.month[3]
    })
    this.monthsList.push({
      id: 5,
      month: this.month[4]
    })
    this.monthsList.push({
      id: 6,
      month: this.month[5]
    })
    this.monthsList.push({
      id: 7,
      month: this.month[6]
    })
    this.monthsList.push({
      id: 8,
      month: this.month[7]
    })
    this.monthsList.push({
      id: 9,
      month: this.month[8]
    })
    this.monthsList.push({
      id: 10,
      month: this.month[9]
    })
    this.monthsList.push({
      id: 11,
      month: this.month[10]
    })
    this.monthsList.push({
      id: 12,
      month: this.month[11]
    });
  }
  login(loginForm: NgForm){
    if(loginForm.valid)
    {
     
    }
  }
  onChange(event:any,col:any)
  {
    this.incomeSales=[];
    this.incomeCogs=[];
    this.incomeGrossMargin = [];
    this.incomeGrossMarginPer = [];
    this.incomeInterest = [];
    let yearNumber = col == 'One'? 0: col == 'Two'? 1:col == 'Three'? 2:col == 'Four'? 3:col == 'Five'? 4:1;
    if(col == 'One')
    {
      if(this.displayFirstYearValues == true)
      {
        this.displayFirstYearValues = false;
      }
      else{
        this.displayFirstYearValues = true;
      }
      this.displaySecondYearValues = false;
      this.displayThirdYearValues = false;
      this.displayFourYearValues = false;
      this.displayFiveYearValues = false;
      this.incomeDetails.forEach(x=>{
        if(x.year == this.years[yearNumber].year && x.type=="Sales")
        {
          this.incomeSales.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Cogs")
        {
          this.incomeCogs.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Gross Margin")
        {
          this.incomeGrossMargin.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Gross Margin %")
        {
          this.incomeGrossMarginPer.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Interest")
        {
          this.incomeInterest.push(x);
        }
      })
    }
    if(col == 'Two')
    {
      if(this.displaySecondYearValues == true)
      {
        this.displaySecondYearValues = false;
      }
      else{
        this.displaySecondYearValues = true;
      }
      this.displayFirstYearValues = false;
      this.displayThirdYearValues = false;
      this.displayFourYearValues = false;
      this.displayFiveYearValues = false;
      this.incomeDetails.forEach(x=>{
        if(x.year == this.years[yearNumber].year && x.type=="Sales")
        {
          this.incomeSales.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Cogs")
        {
          this.incomeCogs.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Gross Margin")
        {
          this.incomeGrossMargin.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Gross Margin %")
        {
          this.incomeGrossMarginPer.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Interest")
        {
          this.incomeInterest.push(x);
        }
      })
    }
    if(col == 'Three')
    {
      if(this.displayThirdYearValues == true)
      {
        this.displayThirdYearValues = false;
      }
      else{
        this.displayThirdYearValues = true;
      }
      this.displayFirstYearValues = false;
      this.displaySecondYearValues = false;
      this.displayFourYearValues = false;
      this.displayFiveYearValues = false;
      this.incomeDetails.forEach(x=>{
        if(x.year == this.years[yearNumber].year && x.type=="Sales")
        {
          this.incomeSales.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Cogs")
        {
          this.incomeCogs.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Gross Margin")
        {
          this.incomeGrossMargin.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Gross Margin %")
        {
          this.incomeGrossMarginPer.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Interest")
        {
          this.incomeInterest.push(x);
        }
      })
    }
    if(col == 'Four')
    {
      if(this.displayFourYearValues == true)
      {
        this.displayFourYearValues = false;
      }
      else{
        this.displayFourYearValues = true;
      }
      this.displayFirstYearValues = false;
      this.displaySecondYearValues = false;
      this.displayThirdYearValues = false;
      this.displayFiveYearValues = false;
      this.incomeDetails.forEach(x=>{
        if(x.year == this.years[yearNumber].year && x.type=="Sales")
        {
          this.incomeSales.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Cogs")
        {
          this.incomeCogs.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Gross Margin")
        {
          this.incomeGrossMargin.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Gross Margin %")
        {
          this.incomeGrossMarginPer.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Interest")
        {
          this.incomeInterest.push(x);
        }
      })
    }
    if(col == 'Five')
    {
      if(this.displayFiveYearValues == true)
      {
        this.displayFiveYearValues = false;
      }
      else{
        this.displayFiveYearValues = true;
      }
      this.displayFirstYearValues = false;
      this.displaySecondYearValues = false;
      this.displayFourYearValues = false;
      this.displayThirdYearValues = false;
      this.incomeDetails.forEach(x=>{
        if(x.year == this.years[yearNumber].year && x.type=="Sales")
        {
          this.incomeSales.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Cogs")
        {
          this.incomeCogs.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Gross Margin")
        {
          this.incomeGrossMargin.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Gross Margin %")
        {
          this.incomeGrossMarginPer.push(x);
        }
        if(x.year == this.years[yearNumber].year && x.type=="Interest")
        {
          this.incomeInterest.push(x);
        }
      })
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
    //this.router.navigate([`/company/${this.user.userId}`]);
  }
}
