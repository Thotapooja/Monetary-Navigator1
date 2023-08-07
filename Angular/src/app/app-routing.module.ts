import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import { ContactComponent } from './Components/contact/contact.component';
import { CompanyComponent } from './Components/company/company.component';
import { RegisterComponent } from './Components/register/register.component';
import { ScenarioComponent } from './Components/scenario/scenario.component';
import { IncomeStatementComponent } from './Components/income-statement/income-statement.component';
import { BalanceSheetComponent } from './Components/balance-sheet/balance-sheet.component';
import { CashFlowStatementComponent } from './Components/cash-flow-statement/cash-flow-statement.component';
import { CashFlowComponent } from './Components/cash-flow/cash-flow.component';
import { RevenueComponent } from './Components/revenue/revenue.component';
import { UsersComponent } from './Components/users/users.component';
import { CogsComponent } from './Components/cogs/cogs.component';
import { PersonnelComponent } from './Components/personnel/personnel.component';
import { AssetsComponent } from './Components/assets/assets.component';
import { FinancingComponent } from './Components/financing/financing.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent},
  {path:'home/:userId/:orgaId',component:HomeComponent},
  {path:'contact/:userId/:orgaId',component:ContactComponent},
  {path:'company/:userId/:orgId',component:CompanyComponent},
  {path:'register',component:RegisterComponent},
  {path:'scenario/:userId/:orgId/:scenarioId',component:ScenarioComponent},
  {path:'income/:userId/:orgId/:scenarioId',component:IncomeStatementComponent},
  {path:'balanceSheet/:userId/:orgId/:scenarioId',component:BalanceSheetComponent},
  {path:'cashFlowStatement',component:CashFlowStatementComponent},
  {path:'cashFlow',component:CashFlowComponent},
  {path:'revenue/:userId/:orgId/:scenarioId',component:RevenueComponent},
  {path:'user/:userId/:orgId',component:UsersComponent},
  {path:'cogs/:userId/:orgId/:scenarioId',component:CogsComponent},
  {path:'personnel/:userId/:orgId/:scenarioId', component:PersonnelComponent},
  {path:'assets/:userId/:orgId/:scenarioId', component:AssetsComponent},
  {path:'financing/:userId/:orgId/:scenarioId', component:FinancingComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
