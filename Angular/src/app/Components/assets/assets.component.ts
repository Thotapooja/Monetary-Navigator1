import { HttpClient } from '@angular/common/http';
import { Component,OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { AssetValues } from 'src/app/Model/assetValues.model';
import { AssetValueType, Assets, AssetsDetails } from 'src/app/Model/assets.model';
import { Month } from 'src/app/Model/month';
import { Months } from 'src/app/Model/months.model';
import { Scenario } from 'src/app/Model/scenario.model';
import { User } from 'src/app/Model/user.model';
import { Years } from 'src/app/Model/years.model';
import { AssetService } from 'src/app/services/asset.service';
import { CogsService } from 'src/app/services/cogs.service';
import { LoginService } from 'src/app/services/login.service';
import { OtherRevenueService } from 'src/app/services/other-revenue.service';
import { PersonnelService } from 'src/app/services/personnel.service';
import { RevenueService } from 'src/app/services/revenue.service';
import { ScenarioService } from 'src/app/services/scenario.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit{
  asset : Assets = {
    assetId: 0,
    scenarioId: 0,
    organisationId: Guid.create(),
    name: '',
    assetType: 0,
    purchaseYear: 0,
    purchaseMonth: 0,
    noofUnits: 0,
    costsperUnit: 0,
    usefulLifetime: 0,
    residualValue: 0,
    daystoPay: 0,
    assumptions: ''
  }
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
  assetsList: AssetsDetails[]=[];
  equNoofUnits: AssetValues[]=[];
  equCostsperUnit: AssetValues[]=[];
  equTotalCosts: AssetValues[]=[];
  equDepreciation:AssetValues[]=[];
  equDaystoPay: AssetValues[]=[];
  equAccountsPayable: AssetValues[]=[];
  equPrepaidExpenses: AssetValues[]=[];
  equCarryingAmount:AssetValues[]=[];
  buildNoofUnits: AssetValues[]=[];
  buildCostsperUnit: AssetValues[]=[];
  buildTotalCosts: AssetValues[]=[];
  buildDepreciation:AssetValues[]=[];
  buildDaystoPay: AssetValues[]=[];
  buildAccountsPayable: AssetValues[]=[];
  buildPrepaidExpenses: AssetValues[]=[];
  buildCarryingAmount:AssetValues[]=[];
  elecNoofUnits: AssetValues[]=[];
  elecCostsperUnit: AssetValues[]=[];
  elecTotalCosts: AssetValues[]=[];
  elecDepreciation:AssetValues[]=[];
  elecDaystoPay: AssetValues[]=[];
  elecAccountsPayable: AssetValues[]=[];
  elecPrepaidExpenses: AssetValues[]=[];
  elecCarryingAmount:AssetValues[]=[];
  otherNoofUnits: AssetValues[]=[];
  otherCostsperUnit: AssetValues[]=[];
  otherTotalCosts: AssetValues[]=[];
  otherDepreciation:AssetValues[]=[];
  otherDaystoPay: AssetValues[]=[];
  otherAccountsPayable: AssetValues[]=[];
  otherPrepaidExpenses: AssetValues[]=[];
  otherCarryingAmount:AssetValues[]=[];
  displayFirstYearValues = false;
  displaySecondYearValues = false;
  displayThirdYearValues = false;
  displayFourYearValues = false;
  displayFiveYearValues = false;
  disableUsers:any;
  constructor(private http: HttpClient,private router: Router,private route: ActivatedRoute,private scenarioService:ScenarioService,
    private revenueService: RevenueService,private otherRevenueService: OtherRevenueService,private cogsService: CogsService, 
    private personnelService: PersonnelService, private assetsService:AssetService,private loginService: LoginService)
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
    this.assetsService.getAssetDetails(this.orgId,this.scenarioId).subscribe(response =>{
      this.assetsList = response;
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
  createAsset(assetsForm: NgForm){
    if(assetsForm.valid)
    {
      this.asset.organisationId = this.orgId;
      this.asset.scenarioId = this.scenarioId;
      this.asset.name = assetsForm.form.value.name;
      this.asset.assetType = assetsForm.form.value.assetType;
      this.asset.assumptions = assetsForm.form.value.assumptions;
      this.asset.costsperUnit = assetsForm.form.value.costsperUnit;
      this.asset.daystoPay = assetsForm.form.value.daysToPay;
      this.asset.noofUnits = assetsForm.form.value.noofUnits;
      this.asset.purchaseYear = assetsForm.form.value.purchaseYear;
      this.asset.purchaseMonth = assetsForm.form.value.purchaseMonth;
      this.asset.residualValue = assetsForm.form.value.resiValueperUnit;
      this.asset.usefulLifetime = assetsForm.form.value.usefulLifetime;
      this.assetsService.createAssets(this.asset).subscribe(response =>{
        alert("Assets created successfully");
        window.location.reload();
      })
    }
  }
  onChange(col:any){
    this.equAccountsPayable = [];
    this.equCostsperUnit =[];
    this.equDaystoPay = [];
    this.equDepreciation = [];
    this.equNoofUnits = [];
    this.equPrepaidExpenses =[];
    this.equTotalCosts = [];
    this.elecAccountsPayable = [];
    this.elecCostsperUnit =[];
    this.elecDaystoPay = [];
    this.elecDepreciation = [];
    this.elecNoofUnits = [];
    this.elecPrepaidExpenses =[];
    this.elecTotalCosts = [];
    this.buildAccountsPayable = [];
    this.buildCostsperUnit =[];
    this.buildDaystoPay = [];
    this.buildDepreciation = [];
    this.buildNoofUnits = [];
    this.buildPrepaidExpenses =[];
    this.buildTotalCosts = [];
    this.otherAccountsPayable = [];
    this.otherCostsperUnit =[];
    this.otherDaystoPay = [];
    this.otherDepreciation = [];
    this.otherNoofUnits = [];
    this.otherPrepaidExpenses =[];
    this.otherTotalCosts = [];
    this.equCarryingAmount = [];
    this.buildCarryingAmount = [];
    this.elecCarryingAmount = [];
    this.otherCarryingAmount=[];
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
      this.assetsList.forEach(x=>{
        if(x.assetId == this.asset.assetId && x.assetType == 1)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.equNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.equCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.equTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.equDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.equDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.equAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.equPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.equCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 2)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.buildNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.buildCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.buildTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.buildDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.buildDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.buildAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.buildPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.buildCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 3)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.elecNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.elecCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.elecTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.elecDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.elecDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.elecAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.elecPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.elecCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 4)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.otherNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.otherCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.otherTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.otherDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.otherDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.otherAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.otherPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.otherCarryingAmount.push(y);
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
      this.assetsList.forEach(x=>{
        if(x.assetId == this.asset.assetId && x.assetType == 1)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.equNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.equCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.equTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.equDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.equDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.equAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.equPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.equCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 2)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.buildNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.buildCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.buildTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.buildDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.buildDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.buildAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.buildPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.buildCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 3)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.elecNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.elecCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.elecTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.elecDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.elecDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.elecAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.elecPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.elecCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 4)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.otherNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.otherCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.otherTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.otherDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.otherDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.otherAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.otherPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.otherCarryingAmount.push(y);
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
      this.assetsList.forEach(x=>{
        if(x.assetId == this.asset.assetId && x.assetType == 1)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.equNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.equCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.equTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.equDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.equDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.equAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.equPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.equCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 2)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.buildNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.buildCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.buildTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.buildDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.buildDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.buildAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.buildPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.buildCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 3)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.elecNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.elecCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.elecTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.elecDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.elecDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.elecAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.elecPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.elecCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 4)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.otherNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.otherCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.otherTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.otherDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.otherDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.otherAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.otherPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.otherCarryingAmount.push(y);
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
      this.assetsList.forEach(x=>{
        if(x.assetId == this.asset.assetId && x.assetType == 1)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.equNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.equCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.equTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.equDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.equDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.equAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.equPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.equCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 2)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.buildNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.buildCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.buildTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.buildDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.buildDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.buildAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.buildPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.buildCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 3)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.elecNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.elecCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.elecTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.elecDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.elecDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.elecAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.elecPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.elecCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 4)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.otherNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.otherCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.otherTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.otherDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.otherDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.otherAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.otherPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.otherCarryingAmount.push(y);
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
      this.assetsList.forEach(x=>{
        if(x.assetId == this.asset.assetId && x.assetType == 1)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.equNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.equCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.equTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.equDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.equDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.equAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.equPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.equCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 2)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.buildNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.buildCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.buildTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.buildDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.buildDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.buildAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.buildPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.buildCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 3)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.elecNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.elecCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.elecTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.elecDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.elecDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.elecAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.elecPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.elecCarryingAmount.push(y);
              }
            }
          })
        }
        if(x.assetId == this.asset.assetId && x.assetType == 4)
        {
          x.assetValues.forEach(y => {
            if(y.year == this.years[yearNumber].year)
            {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.otherNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.otherCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.otherTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.otherDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.otherDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.otherAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.otherPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.otherCarryingAmount.push(y);
              }
            }
          })
        }
      })
    }
    
  }
  viewPersonnel(assetDetails:any){
    this.assetsList.forEach(x=>{
      if(x.assetId == assetDetails.assetId)
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
    this.equAccountsPayable = [];
    this.equCostsperUnit =[];
    this.equDaystoPay = [];
    this.equDepreciation = [];
    this.equNoofUnits = [];
    this.equPrepaidExpenses =[];
    this.equTotalCosts = [];
    this.elecAccountsPayable = [];
    this.elecCostsperUnit =[];
    this.elecDaystoPay = [];
    this.elecDepreciation = [];
    this.elecNoofUnits = [];
    this.elecPrepaidExpenses =[];
    this.elecTotalCosts = [];
    this.buildAccountsPayable = [];
    this.buildCostsperUnit =[];
    this.buildDaystoPay = [];
    this.buildDepreciation = [];
    this.buildNoofUnits = [];
    this.buildPrepaidExpenses =[];
    this.buildTotalCosts = [];
    this.otherAccountsPayable = [];
    this.otherCostsperUnit =[];
    this.otherDaystoPay = [];
    this.otherDepreciation = [];
    this.otherNoofUnits = [];
    this.otherPrepaidExpenses =[];
    this.otherTotalCosts = [];
    this.equCarryingAmount = [];
    this.buildCarryingAmount = [];
    this.elecCarryingAmount = [];
    this.otherCarryingAmount=[];
    this.asset.name = assetDetails.name;
    this.asset.assetId = assetDetails.assetId;
    this.asset.organisationId = assetDetails.organisationId;
    this.asset.scenarioId = assetDetails.scenarioId;
    this.asset.assetType = assetDetails.assetType;
    var colSpan = this.displayFirstYearValues?'One': this.displaySecondYearValues? 'Two': this.displayThirdYearValues? 'Three': this.displayFourYearValues? 'Four': this.displayFiveYearValues? 'Five': 'One';
    let yearNumber = colSpan == 'One'? 0: colSpan == 'Two'? 1:colSpan == 'Three'? 2:colSpan == 'Four'? 3:colSpan == 'Five'? 4:1;
    if(assetDetails.assetType == 1)
    {
      assetDetails.assetValues.forEach((y:any) => {
        if(y.year == this.years[yearNumber].year)
        {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.equNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.equCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.equTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.equDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.equDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.equAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.equPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.equCarryingAmount.push(y);
              }
        }
      })
    }
    if(assetDetails.assetType == 2)
    {
      assetDetails.assetValues.forEach((y:any) => {
        if(y.year == this.years[yearNumber].year)
        {
              if(y.valueType == AssetValueType.NoofUnits)
              {
                this.buildNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.buildCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.buildTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.buildDepreciation.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.buildDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.buildAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.buildPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.buildCarryingAmount.push(y);
              }
        }
      })
    }
    if(assetDetails.assetType == 3)
    {
      assetDetails.assetValues.forEach((y:any) => {
        if(y.year == this.years[yearNumber].year)
        {
          if(y.valueType == AssetValueType.NoofUnits)
          {
            this.elecNoofUnits.push(y);
          }
          if(y.valueType == AssetValueType.CostsperUnit)
          {
            this.elecCostsperUnit.push(y);
          }
          if(y.valueType == AssetValueType.TotalCosts)
          {
            this.elecTotalCosts.push(y);
          }
          if(y.valueType == AssetValueType.Depreciation)
          {
            this.elecDepreciation.push(y);
          }
          if(y.valueType == AssetValueType.NoofDaystoPay)
          {
            this.elecDaystoPay.push(y);
          }
          if(y.valueType == AssetValueType.AccountsPayable)
          {
            this.elecAccountsPayable.push(y);
          }
          if(y.valueType == AssetValueType.PrepaidExpenses)
          {
            this.elecPrepaidExpenses.push(y);
          }
          if(y.valueType == AssetValueType.CarryingAmount)
          {
            this.elecCarryingAmount.push(y);
          }
        }
      })
    }
    if(assetDetails.assetType == 4)
    {
      assetDetails.assetValues.forEach((y:any) => {
        if(y.year == this.years[yearNumber].year)
        {
          if(y.valueType == AssetValueType.NoofUnits)
              {
                this.otherNoofUnits.push(y);
              }
              if(y.valueType == AssetValueType.CostsperUnit)
              {
                this.otherCostsperUnit.push(y);
              }
              if(y.valueType == AssetValueType.TotalCosts)
              {
                this.otherTotalCosts.push(y);
              }
              if(y.valueType == AssetValueType.Depreciation)
              {
                this.otherDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.NoofDaystoPay)
              {
                this.otherDaystoPay.push(y);
              }
              if(y.valueType == AssetValueType.AccountsPayable)
              {
                this.otherAccountsPayable.push(y);
              }
              if(y.valueType == AssetValueType.PrepaidExpenses)
              {
                this.otherPrepaidExpenses.push(y);
              }
              if(y.valueType == AssetValueType.CarryingAmount)
              {
                this.otherCarryingAmount.push(y);
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
