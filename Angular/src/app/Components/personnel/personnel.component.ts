import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Month } from 'src/app/Model/month';
import { Months } from 'src/app/Model/months.model';
import { Personnel, PersonnelDetails, PersonnelValueType } from 'src/app/Model/personnel.model';
import { PersonnelValues } from 'src/app/Model/personnelValues.model';
import { Scenario } from 'src/app/Model/scenario.model';
import { User } from 'src/app/Model/user.model';
import { Years } from 'src/app/Model/years.model';
import { CogsService } from 'src/app/services/cogs.service';
import { LoginService } from 'src/app/services/login.service';
import { OtherRevenueService } from 'src/app/services/other-revenue.service';
import { PersonnelService } from 'src/app/services/personnel.service';
import { RevenueService } from 'src/app/services/revenue.service';
import { ScenarioService } from 'src/app/services/scenario.service';

@Component({
  selector: 'app-personnel',
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.css']
})
export class PersonnelComponent implements OnInit {
  
  userId:any='';
  orgId:any='';
  scenarioId :any='';
  years:Years[]=[];
  year:any = 0;
  forecastPeriod:any = 0;
  j:number = 0;
  k:number = 0;
  revenueStartYear :any;
  monthsList:Months[] = [];
  month:any =[];
  scenarios:Scenario [] =[];
  personnelDetails: PersonnelDetails [] =[];
  salesFTEs: PersonnelValues [] =[];
  salesSalaryperFTE: PersonnelValues [] =[];
  salesAddCost : PersonnelValues[] = [];
  salesAddCostperFTE: PersonnelValues[]=[];
  salesTotalCost: PersonnelValues[]=[];
  devFTEs: PersonnelValues [] =[];
  devSalaryperFTE: PersonnelValues [] =[];
  devAddCost : PersonnelValues[] = [];
  devAddCostperFTE: PersonnelValues[]=[];
  devTotalCost: PersonnelValues[]=[];
  adminFTEs: PersonnelValues [] =[];
  adminSalaryperFTE: PersonnelValues [] =[];
  adminAddCost : PersonnelValues[] = [];
  adminAddCostperFTE: PersonnelValues[]=[];
  adminTotalCost: PersonnelValues[]=[];
  directFTEs: PersonnelValues [] =[];
  directSalaryperFTE: PersonnelValues [] =[];
  directAddCost : PersonnelValues[] = [];
  directAddCostperFTE: PersonnelValues[]=[];
  directTotalCost: PersonnelValues[]=[];
  displayFirstYearValues = false;
  displaySecondYearValues = false;
  displayThirdYearValues = false;
  displayFourYearValues = false;
  displayFiveYearValues = false;
  personnel: Personnel ={
    personnelId: 0,
    scenarioId: 0,
    organisationId: Guid.create(),
    position: '',
    personnelType: 0,
    startYear: 0,
    startMonth: 0,
    noofFTEs: 0,
    grossSalary: 0,
    perSalaryIncrease: 0,
    additionalEmployeeCosts: 0,
    assumptions: ''
  };
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
  disableUsers:any;


  constructor(private http: HttpClient,private loginService: LoginService,private router: Router,private route: ActivatedRoute,private scenarioService:ScenarioService,
    private revenueService: RevenueService,private otherRevenueService: OtherRevenueService,private cogsService: CogsService, private personnelService: PersonnelService)
  {

  }
  ngOnInit(): void {
    this.orgId = this.route.snapshot.params['orgId'];
    this.scenarioId = this.route.snapshot.params['scenarioId'];
    this.userId = this.route.snapshot.params['userId'];
    this.years = [];
    this.monthsList = [];
    this.k = 0;
    this.scenarioService.getAllScenarios(this.orgId).subscribe(response => {
      this.scenarios = response;
    });
    this.personnelService.getPersonnelDetails(this.orgId,this.scenarioId).subscribe(response => {
      this.personnelDetails = response;
      console.log(this.personnelDetails);
    });
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
    for(this.j = 1; this.j<=12 ; this.j++)
    {
      this.monthsList.push({
        id: this.j,
        month: this.month[this.k]
      })
      this.k = this.k + 1;
    }  
  }
  createPersonnel(personnelForm: NgForm)
  {
    if(personnelForm.valid)
    {
      this.personnel.scenarioId = this.scenarioId;
      this.personnel.organisationId = this.orgId;
      this.personnel.position = personnelForm.form.value.position;
      this.personnel.personnelType = personnelForm.form.value.personnelType;
      this.personnel.noofFTEs = personnelForm.form.value.noofFTEs;
      this.personnel.startYear = personnelForm.form.value.startYear;
      this.personnel.startMonth = personnelForm.form.value.startMonth;
      this.personnel.grossSalary = personnelForm.form.value.grossSalary;
      this.personnel.perSalaryIncrease = personnelForm.form.value.yearlySalaryIncr;
      this.personnel.additionalEmployeeCosts = personnelForm.form.value.addEmpCost;
      this.personnel.assumptions = personnelForm.form.value.assumptions;
      this.personnelService.createCogs(this.personnel).subscribe(response => {
        alert("Personnel Created Successfully");
        window.location.reload();
      })
    }
  }
  onChange(col:any){
    this.salesFTEs = [];
    this.salesSalaryperFTE =[];
    this.salesAddCost = [];
    this.salesAddCostperFTE = [];
    this.devFTEs = [];
    this.devSalaryperFTE =[];
    this.devAddCost = [];
    this.devAddCostperFTE = [];
    this.adminFTEs = [];
    this.adminSalaryperFTE =[];
    this.adminAddCost = [];
    this.adminAddCostperFTE = [];
    this.directFTEs = [];
    this.directSalaryperFTE =[];
    this.directAddCost = [];
    this.directAddCostperFTE = [];
    this.directTotalCost = [];
    this.salesTotalCost = [];
    this.devTotalCost = [];
    this.adminTotalCost = [];
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
      let valueType =0;
      this.personnelDetails.forEach(x=>{
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 1)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.salesFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.salesSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.salesAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.salesAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.salesTotalCost.push(y);
              }
            }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 2)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.devFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.devSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.devAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.devAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.devTotalCost.push(y);
              }
            }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 3)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.adminFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.adminSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.adminAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.adminAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.adminTotalCost.push(y);
              }
            }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 4)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.directFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.directSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.directAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.directAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.directTotalCost.push(y);
              }
            }
          })
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
      let valueType =0;
      this.personnelDetails.forEach(x=>{
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 1)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.salesFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.salesSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.salesAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.salesAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.salesTotalCost.push(y);
              }
            }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 2)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.devFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.devSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.devAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.devAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.devTotalCost.push(y);
              }
            }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 3)
        {
          x.personnelValues.forEach(y => {
            if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.adminFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.adminSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.adminAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.adminAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.adminTotalCost.push(y);
              }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 4)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.directFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.directSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.directAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.directAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.directTotalCost.push(y);
              }
            }
          })
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
      this.displaySecondYearValues = false;
      this.displayFirstYearValues = false;
      this.displayFourYearValues = false;
      this.displayFiveYearValues = false;
      let valueType =0;
      this.personnelDetails.forEach(x=>{
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 1)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.salesFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.salesSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.salesAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.salesAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.salesTotalCost.push(y);
              }
            }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 2)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.devFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.devSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.devAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.devAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.devTotalCost.push(y);
              }
            }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 3)
        {
          x.personnelValues.forEach(y => {
            if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.adminFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.adminSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.adminAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.adminAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.adminTotalCost.push(y);
              }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 4)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.directFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.directSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.directAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.directAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.directTotalCost.push(y);
              }
            }
          })
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
      this.displaySecondYearValues = false;
      this.displayThirdYearValues = false;
      this.displayFirstYearValues = false;
      this.displayFiveYearValues = false;
      let valueType =0;
      this.personnelDetails.forEach(x=>{
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 1)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.salesFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.salesSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.salesAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.salesAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.salesTotalCost.push(y);
              }
            }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 2)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.devFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.devSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.devAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.devAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.devTotalCost.push(y);
              }
            }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 3)
        {
          x.personnelValues.forEach(y => {
            if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.adminFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.adminSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.adminAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.adminAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.adminTotalCost.push(y);
              }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 4)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.directFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.directSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.directAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.directAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.directTotalCost.push(y);
              }
            }
          })
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
      this.displaySecondYearValues = false;
      this.displayThirdYearValues = false;
      this.displayFourYearValues = false;
      this.displayFirstYearValues = false;
      let valueType =0;
      this.personnelDetails.forEach(x=>{
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 1)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.salesFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.salesSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.salesAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.salesAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.salesTotalCost.push(y);
              }
            }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 2)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.devFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.devSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.devAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.devAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.devTotalCost.push(y);
              }
            }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 3)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.directFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.directSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.directAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.directAddCostperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.TotalCosts)
              {
                this.directTotalCost.push(y);
              }
            }
          })
        }
        if(x.personnelId == this.personnel.personnelId && x.personnelType == 4)
        {
          x.personnelValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == PersonnelValueType.NoofFTEs)
              {
                this.directFTEs.push(y);
              }
              if(y.valueType == PersonnelValueType.SalaryperFTE)
              {
                this.directSalaryperFTE.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperSalary)
              {
                this.directAddCost.push(y);
              }
              if(y.valueType == PersonnelValueType.AddCostperFTE)
              {
                this.directAddCostperFTE.push(y);
              }
            }
          })
        }
      })
    }
    
  }
  viewPersonnel(personnel:any)
  {
    this.personnelDetails.forEach(x=>{
      if(x.personnelId == personnel.personnelId)
      {
        if(x.disable == true)
        {
          x.disable = false
        }
        else{
          x.disable = true
        }
      }
      else{
        if(x.disable == true)
        {
          x.disable = false
        }
      }
    });
    this.directTotalCost = [];
    this.salesTotalCost = [];
    this.devTotalCost = [];
    this.adminTotalCost = [];
    this.salesFTEs = [];
    this.salesSalaryperFTE =[];
    this.salesAddCost = [];
    this.salesAddCostperFTE = [];
    this.devFTEs = [];
    this.devSalaryperFTE =[];
    this.devAddCost = [];
    this.devAddCostperFTE = [];
    this.adminFTEs = [];
    this.adminSalaryperFTE =[];
    this.adminAddCost = [];
    this.adminAddCostperFTE = [];
    this.directFTEs = [];
    this.directSalaryperFTE =[];
    this.directAddCost = [];
    this.directAddCostperFTE = [];
    this.personnel.position = personnel.position;
    this.personnel.personnelId = personnel.personnelId;
    this.personnel.organisationId = personnel.organisationId;
    this.personnel.scenarioId = personnel.scenarioId;
    var colSpan = this.displayFirstYearValues?'One': this.displaySecondYearValues? 'Two': this.displayThirdYearValues? 'Three': this.displayFourYearValues? 'Four': this.displayFiveYearValues? 'Five': 'One';
    let yearNumber = colSpan == 'One'? 0: colSpan == 'Two'? 1:colSpan == 'Three'? 2:colSpan == 'Four'? 3:colSpan == 'Five'? 4:1;
    if(personnel.personnelType == 1)
    {
      personnel.personnelValues.forEach((y:any) => {
        if(y.year == this.years[yearNumber].year)
        {
          if(y.valueType == PersonnelValueType.NoofFTEs)
          {
            this.salesFTEs.push(y);
          }
          if(y.valueType == PersonnelValueType.SalaryperFTE)
          {
            this.salesSalaryperFTE.push(y);
          }
          if(y.valueType == PersonnelValueType.AddCostperSalary)
          {
            this.salesAddCost.push(y);
          }
          if(y.valueType == PersonnelValueType.AddCostperFTE)
          {
            this.salesAddCostperFTE.push(y);
          }
          if(y.valueType == PersonnelValueType.TotalCosts)
          {
            this.salesTotalCost.push(y);
          }
        }
      })
    }
    if(personnel.personnelType == 2)
    {
      personnel.personnelValues.forEach((y:any) => {
        if(y.year == this.years[yearNumber].year)
        {
          if(y.valueType == PersonnelValueType.NoofFTEs)
          {
            this.devFTEs.push(y);
          }
          if(y.valueType == PersonnelValueType.SalaryperFTE)
          {
            this.devSalaryperFTE.push(y);
          }
          if(y.valueType == PersonnelValueType.AddCostperSalary)
          {
            this.devAddCost.push(y);
          }
          if(y.valueType == PersonnelValueType.AddCostperFTE)
          {
            this.devAddCostperFTE.push(y);
          }
          if(y.valueType == PersonnelValueType.TotalCosts)
          {
            this.devTotalCost.push(y);
          }
        }
      })
    }
    if(personnel.personnelType == 3)
    {
      personnel.personnelValues.forEach((y:any) => {
        if(y.year == this.years[yearNumber].year)
        {
          if(y.valueType == PersonnelValueType.NoofFTEs)
          {
            this.adminFTEs.push(y);
          }
          if(y.valueType == PersonnelValueType.SalaryperFTE)
          {
            this.adminSalaryperFTE.push(y);
          }
          if(y.valueType == PersonnelValueType.AddCostperSalary)
          {
            this.adminAddCost.push(y);
          }
          if(y.valueType == PersonnelValueType.AddCostperFTE)
          {
            this.adminAddCostperFTE.push(y);
          }
          if(y.valueType == PersonnelValueType.TotalCosts)
          {
            this.adminTotalCost.push(y);
          }
        }
      })
    }
    if(personnel.personnelType == 4)
    {
      personnel.personnelValues.forEach((y:any) => {
        if(y.year == this.years[yearNumber].year)
        {
          if(y.valueType == PersonnelValueType.NoofFTEs)
          {
            this.directFTEs.push(y);
          }
          if(y.valueType == PersonnelValueType.SalaryperFTE)
          {
            this.directSalaryperFTE.push(y);
          }
          if(y.valueType == PersonnelValueType.AddCostperSalary)
          {
            this.directAddCost.push(y);
          }
          if(y.valueType == PersonnelValueType.AddCostperFTE)
          {
            this.directAddCostperFTE.push(y);
          }
          if(y.valueType == PersonnelValueType.TotalCosts)
          {
            this.directTotalCost.push(y);
          }
        }
      })
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
  GotoHome():void{
    this.router.navigate([`/home/${this.userId}/${this.orgId}`]);
  }
  
}
