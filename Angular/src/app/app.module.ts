import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { FormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule} from '@angular/material/list';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './Components/home/home.component';
import { HeaderComponent } from './Components/header/header.component';
import { ContactComponent } from './Components/contact/contact.component';
import { CompanyComponent } from './Components/company/company.component';
import { RegisterComponent } from './Components/register/register.component';
import { ScenarioComponent } from './Components/scenario/scenario.component';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    ContactComponent,
    CompanyComponent,
    RegisterComponent,
    ScenarioComponent,
    IncomeStatementComponent,
    BalanceSheetComponent,
    CashFlowStatementComponent,
    CashFlowComponent,
    RevenueComponent,
    UsersComponent,
    CogsComponent,
    PersonnelComponent,
    AssetsComponent,
    FinancingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    FormsModule,
    HttpClientModule,
    NumericTextBoxModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
