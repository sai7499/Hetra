import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LeadStoreService } from 'src/app/services/lead-store.service';

@Component({
  selector: 'app-lead-creation',
  templateUrl: './lead-creation.component.html',
  styleUrls: ['./lead-creation.component.css']
})
export class LeadCreationComponent implements OnInit, OnChanges {

  createLeadForm: FormGroup;
  test: any;
  values = [];

  constructor(private leadService: LeadStoreService) {
    console.log('inside lead-creation')

  }

  ngOnChanges() {
    console.log(this.test);
  }

  ngOnInit() {
    this.values = [
      { key: 1, value: 'Vechicle Finance' }, 
      { key: 2, value: 'Housing Finance' }, 
      { key: 3, value: 'Loan Against Property' }
    ]
  }
  gotValue(e) {
    console.log(e.target.value);
  }

  onCreateLeadCreation() {
    const value = this.createLeadForm.value;

    const businessDivision = value.businessDivision;
    const productCategory = value.productCategory;
    const childLoan = value.childLoan;
    const schemePromotion = value.schemePromotion;
    const subventionApplied = value.subventionApplied;
    const subvention = value.subvention;
    const sourcingChannel = value.sourcingChannel;
    const sourcingType = value.sourcingType;
    const sourcingCode = value.sourcingCode;
    const spokeCodeLocation = value.spokeCodeLocation;
    const loanAccountBranch = value.loanAccountBranch;
    const leadHandledBy = value.leadHandledBy;
    const entity = value.entity;
    const firstName = value.firstName;
    const middleName = value.middleName;
    const lastName = value.lastName;
    const mobile = value.mobile;
    const dateOfBirth = value.dateOfBirth;



    const leadCreationModel = {
      businessDivision,
      productCategory,
      childLoan,
      schemePromotion,
      subventionApplied,
      subvention,
      sourcingChannel,
      sourcingType,
      sourcingCode,
      spokeCodeLocation,
      loanAccountBranch,
      leadHandledBy,
      entity,
      firstName,
      middleName,
      lastName,
      mobile,
      dateOfBirth,
    };


    this.leadService.setLeadCreation(leadCreationModel);


  }

}
