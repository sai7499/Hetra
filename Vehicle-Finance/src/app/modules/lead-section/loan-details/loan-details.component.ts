import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { LeadStoreService } from '@services/lead-store.service';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {

  loanForm: FormGroup;

   loanTypes = [
     {
       key: 1,
       value: 'Topup'
     },
     {
      key: 2,
      value: 'Tyre loan'
    },
    {
      key: 3,
      value: 'Saathi loan'
    },
    {
      key: 4,
      value: 'FC loan'
    }
   ];
  @ViewChild('LosModal', {static: true}) LosModal: ElementRef;


  constructor(
    private renderer: Renderer2,
    private router: Router,
    private leadStoreService: LeadStoreService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loanForm = new FormGroup({
      loanType: new FormControl(''),
      amount: new FormControl(''),
      tenor: new FormControl('')
    });
  }

  setFormValue() {
    const loanModel = this.leadStoreService.getLoanDetails() || {};
    this.loanForm.patchValue({
      loanType: loanModel.loanType,
      amount: loanModel.amount,
      tenor: loanModel.tenor
    });
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

}
