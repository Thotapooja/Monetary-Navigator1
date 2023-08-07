import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Equity, Financing, FinancingDetails, Loan, Subsidy } from 'src/app/Model/financing.model';
import { FinancingValues } from 'src/app/Model/financingValue.model';
import { Month } from 'src/app/Model/month';
import { Months } from 'src/app/Model/months.model';
import { Scenario } from 'src/app/Model/scenario.model';
import { User } from 'src/app/Model/user.model';
import { Years } from 'src/app/Model/years.model';
import { AssetService } from 'src/app/services/asset.service';
import { CogsService } from 'src/app/services/cogs.service';
import { FinancingService } from 'src/app/services/financing.service';
import { LoginService } from 'src/app/services/login.service';
import { OtherRevenueService } from 'src/app/services/other-revenue.service';
import { PersonnelService } from 'src/app/services/personnel.service';
import { RevenueService } from 'src/app/services/revenue.service';
import { ScenarioService } from 'src/app/services/scenario.service';

@Component({
  selector: 'app-financing',
  templateUrl: './financing.component.html',
  styleUrls: ['./financing.component.css']
})
export class FinancingComponent implements OnInit {
  financing: Financing={
    financingId: 0,
    scenarioId: 0,
    organisationId: Guid.create(),
    name: '',
    financingType: 0,
    startYear: 0,
    startMonth: 0,
    financingAmount: 0,
    interestperYear: 0,
    payback: 0,
    residualValue: 0,
    financingPeriodMonths: 0,
    assumptions: 'test'
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
  financeType:any;
  paybackType:any;
  financingDetails: FinancingDetails [] = [];
  equityAmount: FinancingValues [] = [];
  grantAmount: FinancingValues [] = [];
  totalequity: FinancingValues [] = [];
  totalgrant: FinancingValues [] = [];
  loanAmount: FinancingValues [] = [];
  loanPayback: FinancingValues [] = [];
  loanOutstanding: FinancingValues [] = [];
  loanInterestRate: FinancingValues [] = [];
  loanInterestExpenses: FinancingValues [] = [];
  displayFirstYearValues = false;
  displaySecondYearValues = false;
  displayThirdYearValues = false;
  displayFourYearValues = false;
  displayFiveYearValues = false;
  disableUsers:any;

  constructor(private loginService: LoginService,private http: HttpClient,private router: Router,private route: ActivatedRoute,private scenarioService:ScenarioService,
    private revenueService: RevenueService,private otherRevenueService: OtherRevenueService,private cogsService: CogsService, 
    private personnelService: PersonnelService, private assetsService:AssetService, private financingService: FinancingService)
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
    this.financingService.getFinancingDetails(this.orgId,this.scenarioId).subscribe(response =>{
      this.financingDetails = response;
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
  changeType(e:any){
    this.financeType = e.target.value;
    this.financing.financingType = this.financeType;
  }
  changePayback(e:any){
    this.paybackType = e.target.value;
    this.financing.payback = this.paybackType;
  }
  createFinancing(financingForm: NgForm)
  {
    if(financingForm.valid)
    {
      this.financing.name = financingForm.form.value.name;
      this.financing.financingAmount = financingForm.form.value.financingAmount;
      this.financing.assumptions = financingForm.form.value.assumptions;
      this.financing.startYear = financingForm.form.value.startYear;
      this.financing.startMonth = financingForm.form.value.startMonth;
      this.financing.scenarioId = this.scenarioId;
      this.financing.organisationId = this.orgId;
      if(this.financing.financingType == 1 || this.financing.financingType == 3)
      {
        this.financing.interestperYear = 0;
        this.financing.payback = 0;
        this.financing.financingPeriodMonths = 0;
      }
      if(this.financing.financingType == 2)
      {
        if(this.financing.payback == 1)
        {
          this.financing.interestperYear = financingForm.form.value.interestperYear;
          this.financing.payback = this.paybackType;
          this.financing.financingPeriodMonths = 0;
        }
        if(this.financing.payback == 2 || this.financing.payback == 3)
        {
          this.financing.interestperYear = financingForm.form.value.interestperYear;
          this.financing.payback = this.paybackType;
          this.financing.financingPeriodMonths = financingForm.form.value.financingPeriodsMonths;
        }

      }
      this.financingService.createFinancing(this.financing).subscribe(response => {
        alert("Financing created successfully");
        window.location.reload();
      })
    }
  }
  onChange(col:any){
    this.equityAmount = [];
    this.grantAmount = [];
    this.totalequity= [];
    this.totalgrant =[];
    this.loanAmount = [];
    this.loanInterestExpenses =[];
    this.loanInterestRate =[];
    this.loanOutstanding=[];
    this.loanPayback=[];
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
      this.updateFinancing(yearNumber);
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
      this.updateFinancing(yearNumber);
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
      this.updateFinancing(yearNumber);
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
      this.updateFinancing(yearNumber);
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
      this.updateFinancing(yearNumber);
    }
  }
  updateFinancing(year:number)
  {
    this.financingDetails.forEach(x=>{
      if(x.financingId == this.financing.financingId && x.financingType == 1)
      {
        x.financingValues.forEach(y => {
          if(y.year == this.years[year].year)
          {
            if(y.valueType == Equity.AmountRecieved)
            {
              this.equityAmount.push(y);
              this.totalequity.push(y);
              this.totalgrant.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
            }           
          }
        })
      }
      if(x.financingId == this.financing.financingId && x.financingType == 3)
      {
        x.financingValues.forEach(y => {
          if(y.year == this.years[year].year)
          {
            if(y.valueType == Subsidy.AmountRecieved)
            {
              this.grantAmount.push(y);
              this.totalgrant.push(y);
              this.totalequity.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
            }           
          }
        })
      }
      if(x.financingId == this.financing.financingId && x.financingType == 2)
      {
        x.financingValues.forEach(y => {
          if(y.year == this.years[year].year)
          {
            if(y.valueType == Loan.AmountRecieved)
            {
              this.loanAmount.push(y);
              this.grantAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalgrant.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalequity.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              /*this.loanInterestExpenses.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestRate.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanPayback.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanOutstanding.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })*/
            } 
            if(y.valueType == Loan.InterestExpense)
            {
              this.loanInterestExpenses.push(y);
              this.grantAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalgrant.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalequity.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              /*this.loanAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestRate.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanPayback.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanOutstanding.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })*/
            } 
            if(y.valueType == Loan.InterestRate)
            {
              this.loanInterestRate.push(y);
              this.grantAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalgrant.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalequity.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              /*this.loanAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestExpenses.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanPayback.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanOutstanding.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })*/
            } 
            if(y.valueType == Loan.LoanOutstanding)
            {
              this.loanOutstanding.push(y);
              this.grantAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalgrant.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalequity.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              /*this.loanAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestExpenses.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanPayback.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestRate.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })*/
            } 
            if(y.valueType == Loan.PaybackAmount)
            {
              this.loanPayback.push(y);
              this.grantAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalgrant.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalequity.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              /*this.loanAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestExpenses.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanOutstanding.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestRate.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })*/
            }           
          }
        })
      }
    })
  }
  viewFinancing(finance:any)
  {
    this.financingDetails.forEach(x=>{
      if(x.financingId == finance.financingId)
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
    this.equityAmount = [];
    this.grantAmount = [];
    this.totalequity= [];
    this.totalgrant =[];
    this.loanAmount = [];
    this.loanInterestExpenses =[];
    this.loanInterestRate =[];
    this.loanOutstanding=[];
    this.loanPayback=[];
    this.financing.financingId = finance.financingId;
    this.financing.name = finance.name;
    this.financing.scenarioId = finance.scenarioId;
    this.financing.organisationId = finance.organisationId;
    this.financing.financingType = finance.financingType;
    var colSpan = this.displayFirstYearValues?'One': this.displaySecondYearValues? 'Two': this.displayThirdYearValues? 'Three': this.displayFourYearValues? 'Four': this.displayFiveYearValues? 'Five': 'One';
    let yearNumber = colSpan == 'One'? 0: colSpan == 'Two'? 1:colSpan == 'Three'? 2:colSpan == 'Four'? 3:colSpan == 'Five'? 4:1;
    if(finance.financeType == 1)
    {
      finance.financingValue.forEach((y:any) => {
        if(y.year == this.years[yearNumber].year)
        {
          if(y.valueType == Equity.AmountRecieved)
          {
            this.equityAmount.push(y);
            this.totalequity.push(y);
            this.totalgrant.push({
              financingValueId: 0,
              financingId: y.financingId,
              scenarioId: y.scenarioId,
              year: 0,
              month: 0,
              valueType: 0,
              financingValue: 0,
              total: 0
            })
          }     
        }
      })
    }
    if(finance.financeType == 3)
    {
      finance.financingValue.forEach((y:any) => {
        if(y.year == this.years[yearNumber].year)
        {
          if(y.valueType == Subsidy.AmountRecieved)
          {
            this.grantAmount.push(y);
            this.totalgrant.push(y);
            this.totalequity.push({
              financingValueId: 0,
              financingId: y.financingId,
              scenarioId: y.scenarioId,
              year: 0,
              month: 0,
              valueType: 0,
              financingValue: 0,
              total: 0
            })
          }     
        }
      })
    }
    if(finance.financeType == 2)
    {
      finance.financingValue.forEach((y:any) => {
        if(y.valueType == Loan.AmountRecieved)
            {
              this.loanAmount.push(y);
              this.grantAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalgrant.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalequity.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              /*this.loanInterestExpenses.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestRate.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanPayback.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanOutstanding.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })*/
            } 
            if(y.valueType == Loan.InterestExpense)
            {
              this.loanInterestExpenses.push(y);
              this.grantAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalgrant.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalequity.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              /*this.loanAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestRate.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanPayback.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanOutstanding.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })*/
            } 
            if(y.valueType == Loan.InterestRate)
            {
              this.loanInterestRate.push(y);
              this.grantAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalgrant.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalequity.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              /*this.loanAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestExpenses.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanPayback.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanOutstanding.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })*/
            } 
            if(y.valueType == Loan.LoanOutstanding)
            {
              this.loanOutstanding.push(y);
              this.grantAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalgrant.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalequity.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              /*this.loanAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestExpenses.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanPayback.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestRate.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })*/
            } 
            if(y.valueType == Loan.PaybackAmount)
            {
              this.loanPayback.push(y);
              this.grantAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalgrant.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              this.totalequity.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              });
              /*this.loanAmount.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestExpenses.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanOutstanding.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })
              this.loanInterestRate.push({
                financingValueId: 0,
                financingId: y.financingId,
                scenarioId: y.scenarioId,
                year: 0,
                month: 0,
                valueType: 0,
                financingValue: 0,
                total: 0
              })*/
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
