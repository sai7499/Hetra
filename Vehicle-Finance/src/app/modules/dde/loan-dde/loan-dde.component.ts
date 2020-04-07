import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LeadSectionService } from '@services/lead-section.service';
import { LeadStoreService } from '@services/lead-store.service';

@Component({
  selector: 'app-loan-dde',
  templateUrl: './loan-dde.component.html',
  styleUrls: ['./loan-dde.component.css']
})
export class LoanDdeComponent implements OnInit {
  loanDdeForm ;
  public label: any = {};
  public errorMsg;
  public lov: any = [];
  constructor(private formBuilder: FormBuilder,
              private leadSectionService: LeadSectionService, private leadStoreService: LeadStoreService) { }

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
  setFormValue() {
    const loanDetailsValue = this.leadStoreService.getLoanDetails() || {};
    // this.loanDdeForm.patchValue({
    //   emiAffordability: loanDetailsValue.loanType || '',
    //   requestedAmount: loanDetailsValue.amount || '',
    //   requestedTenor: loanDetailsValue.tenor || ''
    // });
  }
  initForm() {
    this.loanDdeForm = this.formBuilder.group({
      requestedAmount : [''],
      marginMoney: [''],
      emiAffordability: [''],
      requestedTenor: ['']
    });
  }

}
