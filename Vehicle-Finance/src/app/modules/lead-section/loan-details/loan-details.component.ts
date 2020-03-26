import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

import { LeadSectionService } from 'src/app/services/lead-section.service';
import { FormGroup, FormControl } from '@angular/forms';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {
  public label: any = {};
  public errorMsg;
  public lov: any = [];
  loanDetailsForm: FormGroup;

  @ViewChild('LosModal', { static: true }) LosModal: ElementRef;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private leadSectionService: LeadSectionService,
    private labelsData: LabelsService,
    private leadStoreService: LeadStoreService) { }

  ngOnInit() {
    this.initForm();
    this.leadSectionService.getLovs().subscribe(lovData => {
      this.lov = lovData[0].loanDetails[0];
      this.setFormValue();
    },
      error => {
        this.errorMsg = error;
      }
    );
  }

  initForm() {
    this.loanDetailsForm = new FormGroup({
      customerSegment: new FormControl(''),
      requestedAmount: new FormControl(''),
      requestedTenor: new FormControl('')
    });
    this.getLabel();
  }

  setFormValue() {
    const loanDetailsValue = this.leadStoreService.getLoanDetails() || {};
    this.loanDetailsForm.patchValue({
      customerSegment: loanDetailsValue.loanType || '',
      requestedAmount: loanDetailsValue.amount || '',
      requestedTenor: loanDetailsValue.tenor || ''
    });
  }

  getLabel() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.label = data;
      },
      error => {
        this.errorMsg = error;
      }
    );
  }

  onFormSubmit() {
    console.log('loanDetailscForm', this.loanDetailsForm.value);
    const formValue = this.loanDetailsForm.value;
    const loanDetailsModel = {...formValue};
    this.leadStoreService.setLoanDetails(loanDetailsModel);
    this.router.navigate(['/pages/lead-section/product-details']);
    alert();
  }

  openLOSPopup(myModal) {
    this.onFormSubmit();
    this.renderer.addClass(myModal, 'fadeIn');
  }

  closeLosPopup(myModal) {
    console.log(myModal);
    this.renderer.removeClass(myModal, 'fadeIn');
  }

  onNavigateTerms() {
    // /pages/terms-conditions
    this.router.navigate(['/']);
  }

}
