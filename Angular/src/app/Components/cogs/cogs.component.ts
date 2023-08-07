import { HttpClient } from '@angular/common/http';
import { Component,OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Cogs, CogsDetails, CogsList } from 'src/app/Model/cogs.model';
import { CogsValues } from 'src/app/Model/cogsValues.model';
import { Month } from 'src/app/Model/month';
import { Months } from 'src/app/Model/months.model';
import { ProductDetails } from 'src/app/Model/revenue.model';
import { Scenario } from 'src/app/Model/scenario.model';
import { User } from 'src/app/Model/user.model';
import { Years } from 'src/app/Model/years.model';
import { CogsService } from 'src/app/services/cogs.service';
import { LoginService } from 'src/app/services/login.service';
import { OtherRevenueService } from 'src/app/services/other-revenue.service';
import { RevenueService } from 'src/app/services/revenue.service';
import { ScenarioService } from 'src/app/services/scenario.service';

@Component({
  selector: 'app-cogs',
  templateUrl: './cogs.component.html',
  styleUrls: ['./cogs.component.css']
})
export class CogsComponent implements OnInit {
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
  productDetails:ProductDetails[]=[];
  cogsDetails: CogsDetails [] =[];
  cogsList:CogsList[]=[];
  costs:CogsValues[]=[];
  costperUnit: CogsValues [] =[];
  noofUnitsSold: CogsValues[]=[];
  pricePerUnit: CogsValues [] =[];
  noofDaystoPay: CogsValues [] =[];
  accountPayable: CogsValues[]=[];
  prepaidExpenses: CogsValues[]=[];
  inventoryDays: CogsValues[]=[];
  inventory: CogsValues[]=[];
  cogsTotal: CogsValues[]=[];
  cogs:Cogs = {
    cogsId: 0,
    revenueId: 0,
    scenarioId: 0,
    organisationId: Guid.create(),
    name: '',
    startYear: 0,
    startMonth: 0,
    costsInStartMonth: 0,
    monthlyCostChange: 0,
    daystoPay: 0,
    inventoryDays: 0,
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
  displayFirstYearValues = true;
  displaySecondYearValues = false;
  displayThirdYearValues = false;
  displayFourYearValues = false;
  displayFiveYearValues = false;
  disableUsers:any;
  constructor(private http: HttpClient,private router: Router,private route: ActivatedRoute,private scenarioService:ScenarioService,
    private revenueService: RevenueService,private otherRevenueService: OtherRevenueService,private cogsService: CogsService, private loginService: LoginService)
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
    this.revenueService.getProductDetails(this.orgId,this.scenarioId).subscribe(response =>{
      this.productDetails = response;
      console.log(this.productDetails);
    });
    this.cogsService.getCogsDetails(this.orgId,this.scenarioId).subscribe(response => {
      this.cogsDetails = response;
    });
  }
  createCogs(cogsForm:NgForm)
  {
    if(cogsForm.valid)
    {
      this.cogs.assumptions = cogsForm.form.value.assumptions;
      this.cogs.costsInStartMonth = cogsForm.form.value.costsInStartMonth;
      this.cogs.daystoPay = cogsForm.form.value.daystoPay;
      this.cogs.inventoryDays = cogsForm.form.value.inventoryDays;
      this.cogs.monthlyCostChange = cogsForm.form.value.monthlyCostChange;
      this.cogs.name = cogsForm.form.value.name;
      this.cogs.revenueId = cogsForm.form.value.revenueId;
      this.cogs.startYear = cogsForm.form.value.startYear;
      this.cogs.startMonth = cogsForm.form.value.startMonth;
      this.cogs.organisationId = this.orgId;
      this.cogs.scenarioId = this.scenarioId;
      this.cogsService.createCogs(this.cogs).subscribe(response => {
        alert("Cogs created successfully");
        window.location.reload();
      })
    }
  }
  viewCogs(cogsEvent:any)
  {
    this.cogsDetails.forEach(x=>{
      if(x.cogsId == cogsEvent.cogsId)
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
    })
    this.cogs.name = cogsEvent.name;
    this.cogs.cogsId = cogsEvent.cogsId;
    this.cogs.organisationId = cogsEvent.organisationId;
    this.cogs.scenarioId = cogsEvent.scenarioId;
    var colSpan = this.displayFirstYearValues?'One': this.displaySecondYearValues? 'Two': this.displayThirdYearValues? 'Three': this.displayFourYearValues? 'Four': this.displayFiveYearValues? 'Five': 'One';
    this.onChange(colSpan);
  }
  onChange(col:any)
  {
    this.costs =[];
    this.costperUnit =[];
    this.noofUnitsSold=[];
    this.pricePerUnit =[];
    this.noofDaystoPay =[];
    this.accountPayable=[];
    this.prepaidExpenses=[];
    this.inventoryDays=[];
    this.inventory=[];
    this.cogsTotal = [];
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
      this.cogsDetails.forEach(x=>{
        if(x.cogsId == this.cogs.cogsId)
        {
          x.cogsValues.forEach(y=>{
            if(y.valueType == 3 && y.year == this.years[0].year)
            {
              this.costs.push(y);
            }
            if(y.valueType == 2 && y.year == this.years[0].year)
            {
              this.noofUnitsSold.push(y);
            }
            if(y.valueType == 1 && y.year == this.years[0].year)
            {
              this.costperUnit.push(y);
            }
            if(y.valueType == 4 && y.year == this.years[0].year)
            {
              this.noofDaystoPay.push(y);
            }
            if(y.valueType == 5 && y.year == this.years[0].year)
            {
              this.accountPayable.push(y);
            }
            if(y.valueType == 6 && y.year == this.years[0].year)
            {
              this.prepaidExpenses.push(y);
            }
            if(y.valueType == 7 && y.year == this.years[0].year)
            {
              this.inventoryDays.push(y);
            }
            if(y.valueType == 8 && y.year == this.years[0].year)
            {
              this.inventory.push(y);
            }
            if(y.valueType == 9 && y.year == this.years[0].year)
            {
              this.cogsTotal.push(y);
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
      this.cogsDetails.forEach(x=>{
        if(x.cogsId == this.cogs.cogsId)
        {
          x.cogsValues.forEach(y=>{
            if(y.valueType == 3 && y.year == this.years[1].year)
            {
              this.costs.push(y);
            }
            if(y.valueType == 2 && y.year == this.years[1].year)
            {
              this.noofUnitsSold.push(y);
            }
            if(y.valueType == 1 && y.year == this.years[1].year)
            {
              this.costperUnit.push(y);
            }
            if(y.valueType == 4 && y.year == this.years[1].year)
            {
              this.noofDaystoPay.push(y);
            }
            if(y.valueType == 5 && y.year == this.years[1].year)
            {
              this.accountPayable.push(y);
            }
            if(y.valueType == 6 && y.year == this.years[1].year)
            {
              this.prepaidExpenses.push(y);
            }
            if(y.valueType == 7 && y.year == this.years[1].year)
            {
              this.inventoryDays.push(y);
            }
            if(y.valueType == 8 && y.year == this.years[1].year)
            {
              this.inventory.push(y);
            }
            if(y.valueType == 9 && y.year == this.years[1].year)
            {
              this.cogsTotal.push(y);
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
      this.displayFirstYearValues = false;
      this.displaySecondYearValues = false;
      this.displayFourYearValues = false;
      this.displayFiveYearValues = false;
      this.cogsDetails.forEach(x=>{
        if(x.cogsId == this.cogs.cogsId)
        {
          x.cogsValues.forEach(y=>{
            if(y.valueType == 3 && y.year == this.years[2].year)
            {
              this.costs.push(y);
            }
            if(y.valueType == 2 && y.year == this.years[2].year)
            {
              this.noofUnitsSold.push(y);
            }
            if(y.valueType == 1 && y.year == this.years[2].year)
            {
              this.costperUnit.push(y);
            }
            if(y.valueType == 4 && y.year == this.years[2].year)
            {
              this.noofDaystoPay.push(y);
            }
            if(y.valueType == 5 && y.year == this.years[2].year)
            {
              this.accountPayable.push(y);
            }
            if(y.valueType == 6 && y.year == this.years[2].year)
            {
              this.prepaidExpenses.push(y);
            }
            if(y.valueType == 7 && y.year == this.years[2].year)
            {
              this.inventoryDays.push(y);
            }
            if(y.valueType == 8 && y.year == this.years[2].year)
            {
              this.inventory.push(y);
            }
            if(y.valueType == 9 && y.year == this.years[2].year)
            {
              this.cogsTotal.push(y);
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
      this.displayFirstYearValues = false;
      this.displaySecondYearValues = false;
      this.displayThirdYearValues = false;
      this.displayFiveYearValues = false;
      this.cogsDetails.forEach(x=>{
        if(x.cogsId == this.cogs.cogsId)
        {
          x.cogsValues.forEach(y=>{
            if(y.valueType == 3 && y.year == this.years[3].year)
            {
              this.costs.push(y);
            }
            if(y.valueType == 2 && y.year == this.years[3].year)
            {
              this.noofUnitsSold.push(y);
            }
            if(y.valueType == 1 && y.year == this.years[3].year)
            {
              this.costperUnit.push(y);
            }
            if(y.valueType == 4 && y.year == this.years[3].year)
            {
              this.noofDaystoPay.push(y);
            }
            if(y.valueType == 5 && y.year == this.years[3].year)
            {
              this.accountPayable.push(y);
            }
            if(y.valueType == 6 && y.year == this.years[3].year)
            {
              this.prepaidExpenses.push(y);
            }
            if(y.valueType == 7 && y.year == this.years[3].year)
            {
              this.inventoryDays.push(y);
            }
            if(y.valueType == 8 && y.year == this.years[3].year)
            {
              this.inventory.push(y);
            }
            if(y.valueType == 9 && y.year == this.years[3].year)
            {
              this.cogsTotal.push(y);
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
      this.displayFirstYearValues = false;
      this.displaySecondYearValues = false;
      this.displayFourYearValues = false;
      this.displayThirdYearValues = false;
      this.cogsDetails.forEach(x=>{
        if(x.cogsId == this.cogs.cogsId)
        {
          x.cogsValues.forEach(y=>{
            if(y.valueType == 3 && y.year == this.years[4].year)
            {
              this.costs.push(y);
            }
            if(y.valueType == 2 && y.year == this.years[4].year)
            {
              this.noofUnitsSold.push(y);
            }
            if(y.valueType == 1 && y.year == this.years[4].year)
            {
              this.costperUnit.push(y);
            }
            if(y.valueType == 4 && y.year == this.years[4].year)
            {
              this.noofDaystoPay.push(y);
            }
            if(y.valueType == 5 && y.year == this.years[4].year)
            {
              this.accountPayable.push(y);
            }
            if(y.valueType == 6 && y.year == this.years[4].year)
            {
              this.prepaidExpenses.push(y);
            }
            if(y.valueType == 7 && y.year == this.years[4].year)
            {
              this.inventoryDays.push(y);
            }
            if(y.valueType == 8 && y.year == this.years[4].year)
            {
              this.inventory.push(y);
            }
            if(y.valueType == 9 && y.year == this.years[4].year)
            {
              this.cogsTotal.push(y);
            }
          })
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
