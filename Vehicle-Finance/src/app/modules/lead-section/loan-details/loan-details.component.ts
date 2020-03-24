import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { LeadStoreService } from 'src/app/services/lead-store.service';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {

  @ViewChild('LosModal', {static: true}) LosModal: ElementRef;


  constructor(private renderer: Renderer2, private router: Router, private leadService: LeadStoreService) { }

  ngOnInit() {
  }

  openLOSPopup(myModal) {
    this.renderer.addClass(myModal, 'fadeIn');
  }

  closeLosPopup(myModal) {
    console.log(myModal)
    this.renderer.removeClass(myModal, 'fadeIn');
  }

  onNavigateTerms() {
    // /pages/terms-conditions
    this.router.navigate(['/'])
  }

  onLoanSubmit() {
    const formvalue: any = {};
    const loanType = formvalue.typeOfLoan;
    const amount = formvalue.requestedAmount;
    const tenour = formvalue.requestedTenour;
    const loanModel = {
      loanType,
      amount,
      tenour
    };
    this.leadService.setLoanDetails(loanModel);
  }

}
