import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Month } from 'src/app/Model/month';
import { Months} from 'src/app/Model/months.model';
import { OtherRevenue, OtherRevenueDetail, OtherRevenueDetails } from 'src/app/Model/otherRevenue.model';
import { OtherRevenueValues } from 'src/app/Model/otherRevenueValues.model';
import { ProductDetail, ProductDetails, Revenue } from 'src/app/Model/revenue.model';
import { RevenueValues } from 'src/app/Model/revenueValues.model';
import { Scenario } from 'src/app/Model/scenario.model';
import { User } from 'src/app/Model/user.model';
import { Years } from 'src/app/Model/years.model';
import { LoginService } from 'src/app/services/login.service';
import { OtherRevenueService } from 'src/app/services/other-revenue.service';
import { RevenueService } from 'src/app/services/revenue.service';
import { ScenarioService } from 'src/app/services/scenario.service';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {
  revenueCategory:any;
  /*revenue:Revenue={
    revenueId:0,
    scenarioId:0,
    organisationId:Guid.create(),

  }*/
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
  revenue: Revenue = {
    revenueId: 0,
    scenarioId: 0,
    organisationId: Guid.create(),
    revenueCategory: '',
    revenueName: '',
    startYear: 0,
    startMonth: 0,
    clientsInStartMonth: 0,
    unitsSoldperclientpermonth: 0,
    frequencyClientIncr: '',
    perClientIncr: 0,
    pricePerUnit:0,
    daysPaid: 0,
    assumptions: ''
  }
  otherRevenue:OtherRevenue = {
    otherRevenueId: 0,
    scenarioId: 0,
    organisationId: Guid.create(),
    revenueCategory: '',
    revenueName: '',
    startYear: 0,
    startMonth: 0,
    revenueinStartMonth: 0,
    frequencyClientIncr: '',
    perClientIncr: 0,
    daysPaid: 0,
    assumptions: ''
  }
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
  displayFirstYearValues = true;
  displaySecondYearValues = false;
  displayThirdYearValues = false;
  displayFourYearValues = false;
  displayFiveYearValues = false;
  productDetails:ProductDetails[]=[];
  otherRevenues:OtherRevenueDetails[]=[];
  otherRevenueDetails:OtherRevenueDetail[]=[];
  otherTotal: OtherRevenueValues[]=[];
  noofUnitsSoldperClients:RevenueValues[]=[];
  noofClients: RevenueValues [] =[];
  noofUnitsSold: RevenueValues[]=[];
  pricePerUnit: RevenueValues [] =[];
  noofDaysGetPaid: RevenueValues [] =[];
  productAccountReceivable: RevenueValues[]=[];
  productPrepaidRevenue: RevenueValues[]=[];
  productTotal : RevenueValues[]=[];
  displayLoopTable= false;
  product:ProductDetail[]=[];
  others:OtherRevenueValues[]=[];
  otherDaysGetPaid:OtherRevenueValues[]=[];
  otherAccountReceivable:OtherRevenueValues[]=[];
  otherPrepaidRevenue:OtherRevenueValues[]=[];
  disableUsers:any;


  constructor(private http: HttpClient,private router: Router,private route: ActivatedRoute,private scenarioService:ScenarioService,
              private revenueService: RevenueService,private otherRevenueService: OtherRevenueService, private loginService: LoginService)
  {
    
  }
  ngOnInit(): void {
    //this.userId = this.route.snapshot.params['userId'];
    this.orgId = this.route.snapshot.params['orgId'];
    this.scenarioId = this.route.snapshot.params['scenarioId'];
    this.userId = this.route.snapshot.params['userId'];
    this.otherRevenue.organisationId = this.orgId;
    this.otherRevenue.scenarioId = this.scenarioId;
    this.years = [];
    this.monthsList = [];
    //this.productDetails = [];
    this.product = [];
    this.otherRevenueDetails = [];
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
    this.revenueService.getProductDetails(this.orgId,this.scenarioId).subscribe(response =>{
      this.productDetails = response;
      console.log(this.productDetails);
    });
    this.otherRevenueService.getProductDetails(this.orgId,this.scenarioId).subscribe(response =>{
      this.otherRevenues = response;
    });
  }
  changeCategory(e:any):void{
    this.revenueCategory = e.target.value;
    console.log(this.revenueCategory);
  }
  change(event:any)
  {
    
  }
  onChange(event:any,col:any)
  {
    this.otherTotal = [];
    this.noofUnitsSoldperClients = [];
    this.noofClients = [];
    this.noofUnitsSold = [];
    this.pricePerUnit = [];
    this.noofDaysGetPaid = [];
    this.productAccountReceivable = [];
    this.productPrepaidRevenue = [];
    this.others = [];
    this.otherDaysGetPaid = [];
    this.otherAccountReceivable = [];
    this.otherPrepaidRevenue = [];
    this.productTotal = [];
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
      this.otherRevenues.forEach(x=>{
        if(this.otherRevenue.otherRevenueId == x.otherRevenueId)
        {
          x.otherRevenueValues.forEach(y => {
            if(y.valueType == 1 && y.year == this.years[0].year)
            {
              this.others.push(y);
            }
            else if(y.valueType == 2 && y.year == this.years[0].year)
            {
              this.otherDaysGetPaid.push(y);
            }
            else if(y.valueType == 3 && y.year == this.years[0].year)
            {
              this.otherAccountReceivable.push(y);
            }
            else if(y.valueType == 4 && y.year == this.years[0].year)
            {
              this.otherPrepaidRevenue.push(y);
            }
            else if(y.valueType == 5 && y.year == this.years[0].year)
            {
              this.otherTotal.push(y);
            }
          })
        }
      })
      this.productDetails.forEach(x=>{
        if(this.revenue.revenueId == x.revenueId)
        {
          x.revenueValues.forEach(y=>{
          if(y.valueType == 1 && y.year == this.years[0].year)
          {
            this.noofUnitsSoldperClients.push(y);
          }
          else if(y.valueType == 2 && y.year == this.years[0].year)
          {
            this.noofClients.push(y);
          }
          else if(y.valueType == 3 && y.year == this.years[0].year)
          {
            this.noofUnitsSold.push(y);
          }
          else if(y.valueType == 4 && y.year == this.years[0].year)
          {
            this.pricePerUnit.push(y);
          }
          else if(y.valueType == 5 && y.year == this.years[0].year)
          {
            this.noofDaysGetPaid.push(y);
          }
          else if(y.valueType == 6 && y.year == this.years[0].year)
          {
            this.productAccountReceivable.push(y);
          }
          else if(y.valueType == 7 && y.year == this.years[0].year)
          {
            this.productPrepaidRevenue.push(y);
          }
          else if(y.valueType == 8 && y.year == this.years[0].year)
          {
            this.productTotal.push(y);
          }
          });
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
      this.otherRevenues.forEach(x=>{
        if(this.otherRevenue.otherRevenueId == x.otherRevenueId)
        {
          x.otherRevenueValues.forEach(y => {
            if(y.valueType == 1 && y.year == this.years[1].year)
            {
              this.others.push(y);
            }
            else if(y.valueType == 2 && y.year == this.years[1].year)
            {
              this.otherDaysGetPaid.push(y);
            }
            else if(y.valueType == 3 && y.year == this.years[1].year)
            {
              this.otherAccountReceivable.push(y);
            }
            else if(y.valueType == 4 && y.year == this.years[1].year)
            {
              this.otherPrepaidRevenue.push(y);
            }
            else if(y.valueType == 5 && y.year == this.years[1].year)
            {
              this.otherTotal.push(y);
            }
          })
        }
      })
      this.productDetails.forEach(x=>{
        if(this.revenue.revenueId == x.revenueId)
        {
          x.revenueValues.forEach(y=>{
          if(y.valueType == 1 && y.year == this.years[1].year)
          {
            this.noofUnitsSoldperClients.push(y);
          }
          else if(y.valueType == 2 && y.year == this.years[1].year)
          {
            this.noofClients.push(y);
          }
          else if(y.valueType == 3 && y.year == this.years[1].year)
          {
            this.noofUnitsSold.push(y);
          }
          else if(y.valueType == 4 && y.year == this.years[1].year)
          {
            this.pricePerUnit.push(y);
          }
          else if(y.valueType == 5 && y.year == this.years[1].year)
          {
            this.noofDaysGetPaid.push(y);
          }
          else if(y.valueType == 6 && y.year == this.years[1].year)
          {
            this.productAccountReceivable.push(y);
          }
          else if(y.valueType == 7 && y.year == this.years[1].year)
          {
            this.productPrepaidRevenue.push(y);
          }
          else if(y.valueType == 8 && y.year == this.years[1].year)
          {
            this.productTotal.push(y);
          }
          });
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
      this.otherRevenues.forEach(x=>{
        if(this.otherRevenue.otherRevenueId == x.otherRevenueId)
        {
          x.otherRevenueValues.forEach(y => {
            if(y.valueType == 1 && y.year == this.years[2].year)
            {
              this.others.push(y);
            }
            else if(y.valueType == 2 && y.year == this.years[2].year)
            {
              this.otherDaysGetPaid.push(y);
            }
            else if(y.valueType == 3 && y.year == this.years[2].year)
            {
              this.otherAccountReceivable.push(y);
            }
            else if(y.valueType == 4 && y.year == this.years[2].year)
            {
              this.otherPrepaidRevenue.push(y);
            }
            else if(y.valueType == 5 && y.year == this.years[2].year)
            {
              this.otherTotal.push(y);
            }
          })
        }
      })
      this.productDetails.forEach(x=>{
        if(this.revenue.revenueId == x.revenueId)
        {
          x.revenueValues.forEach(y=>{
          if(y.valueType == 1 && y.year == this.years[2].year)
          {
            this.noofUnitsSoldperClients.push(y);
          }
          else if(y.valueType == 2 && y.year == this.years[2].year)
          {
            this.noofClients.push(y);
          }
          else if(y.valueType == 3 && y.year == this.years[2].year)
          {
            this.noofUnitsSold.push(y);
          }
          else if(y.valueType == 4 && y.year == this.years[2].year)
          {
            this.pricePerUnit.push(y);
          }
          else if(y.valueType == 5 && y.year == this.years[2].year)
          {
            this.noofDaysGetPaid.push(y);
          }
          else if(y.valueType == 6 && y.year == this.years[2].year)
          {
            this.productAccountReceivable.push(y);
          }
          else if(y.valueType == 7 && y.year == this.years[2].year)
          {
            this.productPrepaidRevenue.push(y);
          }
          else if(y.valueType == 8 && y.year == this.years[2].year)
          {
            this.productTotal.push(y);
          }
          });
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
      this.otherRevenues.forEach(x=>{
        if(this.otherRevenue.otherRevenueId == x.otherRevenueId)
        {
          x.otherRevenueValues.forEach(y => {
            if(y.valueType == 1 && y.year == this.years[3].year)
            {
              this.others.push(y);
            }
            else if(y.valueType == 2 && y.year == this.years[3].year)
            {
              this.otherDaysGetPaid.push(y);
            }
            else if(y.valueType == 3 && y.year == this.years[3].year)
            {
              this.otherAccountReceivable.push(y);
            }
            else if(y.valueType == 4 && y.year == this.years[3].year)
            {
              this.otherPrepaidRevenue.push(y);
            }
            else if(y.valueType == 5 && y.year == this.years[3].year)
            {
              this.otherTotal.push(y);
            }
          })
        }
      })
      this.productDetails.forEach(x=>{
        if(this.revenue.revenueId == x.revenueId)
        {
          x.revenueValues.forEach(y=>{
          if(y.valueType == 1 && y.year == this.years[3].year)
          {
            this.noofUnitsSoldperClients.push(y);
          }
          else if(y.valueType == 2 && y.year == this.years[3].year)
          {
            this.noofClients.push(y);
          }
          else if(y.valueType == 3 && y.year == this.years[3].year)
          {
            this.noofUnitsSold.push(y);
          }
          else if(y.valueType == 4 && y.year == this.years[3].year)
          {
            this.pricePerUnit.push(y);
          }
          else if(y.valueType == 5 && y.year == this.years[3].year)
          {
            this.noofDaysGetPaid.push(y);
          }
          else if(y.valueType == 6 && y.year == this.years[3].year)
          {
            this.productAccountReceivable.push(y);
          }
          else if(y.valueType == 7 && y.year == this.years[3].year)
          {
            this.productPrepaidRevenue.push(y);
          }
          else if(y.valueType == 8 && y.year == this.years[3].year)
          {
            this.productTotal.push(y);
          }
        });
         
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
      this.otherRevenues.forEach(x=>{
        if(this.otherRevenue.otherRevenueId == x.otherRevenueId)
        {
          x.otherRevenueValues.forEach(y => {
            if(y.valueType == 1 && y.year == this.years[4].year)
            {
              this.others.push(y);
            }
            else if(y.valueType == 2 && y.year == this.years[4].year)
            {
              this.otherDaysGetPaid.push(y);
            }
            else if(y.valueType == 3 && y.year == this.years[4].year)
            {
              this.otherAccountReceivable.push(y);
            }
            else if(y.valueType == 4 && y.year == this.years[4].year)
            {
              this.otherPrepaidRevenue.push(y);
            }
            else if(y.valueType == 5 && y.year == this.years[4].year)
            {
              this.otherTotal.push(y);
            }
          })
        }
      })
      this.productDetails.forEach(x=>{
        if(this.revenue.revenueId == x.revenueId)
        {
          x.revenueValues.forEach(y=>{
          if(y.valueType == 1 && y.year == this.years[4].year)
          {
            this.noofUnitsSoldperClients.push(y);
          }
          else if(y.valueType == 2 && y.year == this.years[4].year)
          {
            this.noofClients.push(y);
          }
          else if(y.valueType == 3 && y.year == this.years[4].year)
          {
            this.noofUnitsSold.push(y);
          }
          else if(y.valueType == 4 && y.year == this.years[4].year)
          {
            this.pricePerUnit.push(y);
          }
          else if(y.valueType == 5 && y.year == this.years[4].year)
          {
            this.noofDaysGetPaid.push(y);
          }
          else if(y.valueType == 6 && y.year == this.years[4].year)
          {
            this.productAccountReceivable.push(y);
          }
          else if(y.valueType == 7 && y.year == this.years[4].year)
          {
            this.productPrepaidRevenue.push(y);
          }
          else if(y.valueType == 8 && y.year == this.years[4].year)
          {
            this.productTotal.push(y);
          }
          });
        }
      })
    }
    
  }
  createProduct(productForm: NgForm){
    if(productForm.valid)
    {
     console.log(productForm.form.value.name)
     this.revenue.revenueName = productForm.form.value.revenueName;
     this.revenue.startYear = productForm.form.value.startYear;
     this.monthsList.forEach(x=>{
      if(productForm.form.value.startMonth == x.month)
      {
        this.revenue.startMonth = x.id;
      }
     })
     this.revenue.clientsInStartMonth = productForm.form.value.clientsInStartMonth;
     this.revenue.unitsSoldperclientpermonth = productForm.form.value.unitsSoldperclientpermonth;
     if(productForm.form.value.frequencyIncr == 1)
      {
        this.revenue.frequencyClientIncr = "Monthly";
      }
      else{
        this.revenue.frequencyClientIncr = "Yearly";
      }
     this.revenue.perClientIncr = productForm.form.value.perClientIncr;
     this.revenue.pricePerUnit = productForm.form.value.pricePerUnit;
     this.revenue.daysPaid = productForm.form.value.daysPaid;
     this.revenue.assumptions = productForm.form.value.assumptions?productForm.form.value.assumptions:'';
     this.revenue.scenarioId = this.scenarioId;
     this.revenue.organisationId = this.orgId;
     this.revenue.revenueCategory = this.revenueCategory;
     this.revenueService.createProduct(this.revenue).subscribe(x=>{
      alert("Product/Service created Successfully");
      window.location.reload();
      });
    }
  }
  createOtherRevenue(otherForm:NgForm){
    if(otherForm.valid)
    {
      this.otherRevenue.organisationId = this.orgId;
      this.otherRevenue.scenarioId = this.scenarioId;
      this.otherRevenue.revenueCategory = this.revenueCategory;
      this.otherRevenue.revenueName = otherForm.form.value.revenueName;
      this.otherRevenue.revenueinStartMonth = otherForm.form.value.revenueinStartMonth;
      this.otherRevenue.startYear = otherForm.form.value.startYear;
      this.monthsList.forEach(x=>{
        if(otherForm.form.value.startMonth == x.month)
        {
          this.otherRevenue.startMonth = x.id;
        }
       })
      if(otherForm.form.value.frequencyIncr == 1)
      {
        this.otherRevenue.frequencyClientIncr = "Monthly";
      }
      else{
        this.otherRevenue.frequencyClientIncr = "Yearly";
      }
      this.otherRevenue.perClientIncr = otherForm.form.value.perIncrRevenue;
      this.otherRevenue.daysPaid = otherForm.form.value.daysGetPaid;
      this.otherRevenueService.createOtherRevenue(this.otherRevenue).subscribe(response=>{
        alert("Other Revenue Created Successfully");
        window.location.reload();
      })
    }
  }
  hello(event:any){
    this.productDetails.forEach(x=>{
      if(x.revenueId == event.revenueId)
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
    this.noofUnitsSoldperClients=[];
    this.noofClients = [];
    this.noofUnitsSold = [];
    this.productTotal = [];
    this.pricePerUnit = [];
    this.noofDaysGetPaid = [];
    this.productAccountReceivable = [];
    this.productPrepaidRevenue = [];
    this.revenue.revenueName = event.revenueName;
    this.revenue.revenueId = event.revenueId;
    this.revenue.organisationId = event.organisationId;
    this.revenue.scenarioId = event.scenarioId;
    if(this.displayFirstYearValues == true)
    {
      event.revenueValues.forEach((x: RevenueValues)=>{
        if(x.valueType == 1 && x.year == this.years[0].year)
        {
            this.noofUnitsSoldperClients.push(x);
        }
        else if(x.valueType == 2 && x.year == this.years[0].year)
        {
          this.noofClients.push(x);
        }
        else if(x.valueType == 3 && x.year == this.years[0].year)
        {
          this.noofUnitsSold.push(x);
        }
        else if(x.valueType == 4 && x.year == this.years[0].year)
        {
          this.pricePerUnit.push(x);
        }
        else if(x.valueType == 5 && x.year == this.years[0].year)
        {
          this.noofDaysGetPaid.push(x);
        }
        else if(x.valueType == 6 && x.year == this.years[0].year)
        {
          this.productAccountReceivable.push(x);
        }
        else if(x.valueType == 7 && x.year == this.years[0].year)
        {
          this.productPrepaidRevenue.push(x);
        }
        else if(x.valueType == 8 && x.year == this.years[0].year)
        {
          this.productTotal.push(x);
        }
      })
    }
    if(this.displaySecondYearValues == true)
    {
      event.revenueValues.forEach((x: RevenueValues)=>{
        if(x.valueType == 1 && x.year == this.years[1].year)
        {
          this.noofUnitsSoldperClients.push(x);
        }
        else if(x.valueType == 2 && x.year == this.years[1].year)
        {
          this.noofClients.push(x);
        }
        else if(x.valueType == 3 && x.year == this.years[1].year)
        {
          this.noofUnitsSold.push(x);
        }
        else if(x.valueType == 4 && x.year == this.years[1].year)
        {
          this.pricePerUnit.push(x);
        }
        else if(x.valueType == 5 && x.year == this.years[1].year)
        {
          this.noofDaysGetPaid.push(x);
        }
        else if(x.valueType == 6 && x.year == this.years[1].year)
        {
          this.productAccountReceivable.push(x);
        }
        else if(x.valueType == 7 && x.year == this.years[1].year)
        {
          this.productPrepaidRevenue.push(x);
        }
        else if(x.valueType == 8 && x.year == this.years[1].year)
        {
          this.productTotal.push(x);
        }
      })
    }
    if(this.displayThirdYearValues == true)
    {
      event.revenueValues.forEach((x: RevenueValues)=>{
        if(x.valueType == 1 && x.year == this.years[2].year)
        {
          this.noofUnitsSoldperClients.push(x);
        }
        else if(x.valueType == 2 && x.year == this.years[2].year)
        {
          this.noofClients.push(x);
        }
        else if(x.valueType == 3 && x.year == this.years[2].year)
        {
          this.noofUnitsSold.push(x);
        }
        else if(x.valueType == 4 && x.year == this.years[2].year)
        {
          this.pricePerUnit.push(x);
        }
        else if(x.valueType == 5 && x.year == this.years[2].year)
        {
          this.noofDaysGetPaid.push(x);
        }
        else if(x.valueType == 6 && x.year == this.years[2].year)
        {
          this.productAccountReceivable.push(x);
        }
        else if(x.valueType == 7 && x.year == this.years[2].year)
        {
          this.productPrepaidRevenue.push(x);
        }
        else if(x.valueType == 8 && x.year == this.years[2].year)
        {
          this.productTotal.push(x);
        }
      })
    }
    if(this.displayFourYearValues == true)
    {
      event.revenueValues.forEach((x: RevenueValues)=>{
        if(x.valueType == 1 && x.year == this.years[3].year)
        {
            this.noofUnitsSoldperClients.push(x);
        }
        else if(x.valueType == 2 && x.year == this.years[3].year)
        {
          this.noofClients.push(x);
        }
        else if(x.valueType == 3 && x.year == this.years[3].year)
        {
          this.noofUnitsSold.push(x);
        }
        else if(x.valueType == 4 && x.year == this.years[3].year)
        {
          this.pricePerUnit.push(x);
        }
        else if(x.valueType == 5 && x.year == this.years[3].year)
        {
          this.noofDaysGetPaid.push(x);
        }
        else if(x.valueType == 6 && x.year == this.years[3].year)
        {
          this.productAccountReceivable.push(x);
        }
        else if(x.valueType == 7 && x.year == this.years[3].year)
        {
          this.productPrepaidRevenue.push(x);
        }
        else if(x.valueType == 8 && x.year == this.years[3].year)
        {
          this.productTotal.push(x);
        }
      })
    }
    if(this.displayFiveYearValues == true)
    {
      event.revenueValues.forEach((x: RevenueValues)=>{
        if(x.valueType == 1 && x.year == this.years[4].year)
        {
          this.noofUnitsSoldperClients.push(x);
        }
        else if(x.valueType == 2 && x.year == this.years[4].year)
        {
          this.noofClients.push(x);
        }
        else if(x.valueType == 3 && x.year == this.years[4].year)
        {
          this.noofUnitsSold.push(x);
        }
        else if(x.valueType == 4 && x.year == this.years[4].year)
        {
          this.pricePerUnit.push(x);
        }
        else if(x.valueType == 5 && x.year == this.years[4].year)
        {
          this.noofDaysGetPaid.push(x);
        }
        else if(x.valueType == 6 && x.year == this.years[4].year)
        {
          this.productAccountReceivable.push(x);
        }
        else if(x.valueType == 7 && x.year == this.years[4].year)
        {
          this.productPrepaidRevenue.push(x);
        }
        else if(x.valueType == 8 && x.year == this.years[4].year)
        {
          this.productTotal.push(x);
        }
      })
    }
    
  }
  viewOtherRevenue(event:any)
  {
    this.otherRevenues.forEach(x=>{
      if(x.otherRevenueId == event.otherRevenueId)
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
    this.others = [];
    this.productTotal = [];
    this.otherDaysGetPaid = [];
    this.otherAccountReceivable = [];
    this.otherTotal = [];
    this.otherPrepaidRevenue = [];
    this.otherRevenue.revenueName = event.revenueName;
    this.otherRevenue.otherRevenueId = event.otherRevenueId;
    this.otherRevenue.organisationId = event.organisationId;
    this.otherRevenue.scenarioId = event.scenarioId;
    if(this.displayFirstYearValues == true)
    {
      event.otherRevenueValues.forEach((x:any)=>{
        if(x.valueType == 1 && x.year == this.years[0].year)
        {
            this.others.push(x);
        }
        else if(x.valueType == 2 && x.year == this.years[0].year)
        {
          this.otherDaysGetPaid.push(x);
        }
        else if(x.valueType == 3 && x.year == this.years[0].year)
        {
          this.otherAccountReceivable.push(x);
        }
        else if(x.valueType == 4 && x.year == this.years[0].year)
        {
          this.otherPrepaidRevenue.push(x);
        }
        else if(x.valueType == 5 && x.year == this.years[0].year)
        {
          this.otherTotal.push(x);
        }
      })
    }
    if(this.displaySecondYearValues == true)
    {
      event.otherRevenueValues.forEach((x: OtherRevenueValues)=>{
        if(x.valueType == 1 && x.year == this.years[1].year)
        {
            this.others.push(x);
        }
        else if(x.valueType == 2 && x.year == this.years[1].year)
        {
          this.otherDaysGetPaid.push(x);
        }
        else if(x.valueType == 3 && x.year == this.years[1].year)
        {
          this.otherAccountReceivable.push(x);
        }
        else if(x.valueType == 4 && x.year == this.years[1].year)
        {
          this.otherPrepaidRevenue.push(x);
        }
        else if(x.valueType == 5 && x.year == this.years[1].year)
        {
          this.otherTotal.push(x);
        }
      })
    }
    if(this.displayThirdYearValues == true)
    {
      event.otherRevenueValues.forEach((x: OtherRevenueValues)=>{
        if(x.valueType == 1 && x.year == this.years[2].year)
        {
            this.others.push(x);
        }
        else if(x.valueType == 2 && x.year == this.years[2].year)
        {
          this.otherDaysGetPaid.push(x);
        }
        else if(x.valueType == 3 && x.year == this.years[2].year)
        {
          this.otherAccountReceivable.push(x);
        }
        else if(x.valueType == 4 && x.year == this.years[2].year)
        {
          this.otherPrepaidRevenue.push(x);
        }
        else if(x.valueType == 5 && x.year == this.years[3].year)
        {
          this.otherTotal.push(x);
        }
      })
    }
    if(this.displayFourYearValues == true)
    {
      event.otherRevenueValues.forEach((x: OtherRevenueValues)=>{
        if(x.valueType == 1 && x.year == this.years[3].year)
        {
            this.others.push(x);
        }
        else if(x.valueType == 2 && x.year == this.years[3].year)
        {
          this.otherDaysGetPaid.push(x);
        }
        else if(x.valueType == 3 && x.year == this.years[3].year)
        {
          this.otherAccountReceivable.push(x);
        }
        else if(x.valueType == 4 && x.year == this.years[3].year)
        {
          this.otherPrepaidRevenue.push(x);
        }
        else if(x.valueType == 5 && x.year == this.years[3].year)
        {
          this.otherTotal.push(x);
        }
      })
    }
    if(this.displayFiveYearValues == true)
    {
      event.otherRevenueValues.forEach((x: OtherRevenueValues)=>{
        if(x.valueType == 1 && x.year == this.years[4].year)
        {
            this.others.push(x);
        }
        else if(x.valueType == 2 && x.year == this.years[4].year)
        {
          this.otherDaysGetPaid.push(x);
        }
        else if(x.valueType == 3 && x.year == this.years[4].year)
        {
          this.otherAccountReceivable.push(x);
        }
        else if(x.valueType == 4 && x.year == this.years[4].year)
        {
          this.otherPrepaidRevenue.push(x);
        }
        else if(x.valueType == 5 && x.year == this.years[4].year)
        {
          this.otherTotal.push(x);
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
