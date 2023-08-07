import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ScenarioService } from 'src/app/services/scenario.service';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.css']
})
export class CashFlowComponent {
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
