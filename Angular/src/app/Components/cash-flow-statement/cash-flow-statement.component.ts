import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScenarioService } from 'src/app/services/scenario.service';

@Component({
  selector: 'app-cash-flow-statement',
  templateUrl: './cash-flow-statement.component.html',
  styleUrls: ['./cash-flow-statement.component.css']
})
export class CashFlowStatementComponent {
  constructor(private http: HttpClient,private router: Router,private route: ActivatedRoute,private scenarioService:ScenarioService)
  {
    
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
    //this.router.navigate([`/company/${this.user.userId}`]);
  }
}
