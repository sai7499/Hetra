import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { LovDataService } from 'src/app/services/lov-data.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';
import { Lead } from '@model/lead.model';

@Component({
  selector: 'app-lead-creation',
  templateUrl: './lead-creation.component.html',
  styleUrls: ['./lead-creation.component.css']
})
export class LeadCreationComponent implements OnInit, OnChanges {

  createLeadForm: FormGroup;
  test: any;
  values = [];
  lovLabels: any = [];

  constructor(
    private lovData: LovDataService,
    private router: Router,
    private leadStoreService: LeadStoreService) {
    this.lovData.getLovData().subscribe((res: any) => {
      this.lovLabels = res[0].leadCreation[0];
    });

  }

  ngOnChanges() {
    console.log(this.test);
  }

  initForm() {
    this.createLeadForm = new FormGroup({
      businessDivision: new FormControl(''),
      productCategory: new FormControl(''),
      childLoan: new FormControl(''),
      schemePromotion: new FormControl(''),
      subventionApplied: new FormControl(''),
      subvention: new FormControl(''),
      sourcingChannel: new FormControl(''),
      sourcingType: new FormControl(''),
      sourcingCode: new FormControl(''),
      spokeCodeLocation: new FormControl(''),
      loanAccountBranch: new FormControl(''),
      leadHandledBy: new FormControl(''),
      entity: new FormControl(''),
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      lastName: new FormControl(''),
      mobile: new FormControl(''),
      dateOfBirth: new FormControl('')
    });
  }

  ngOnInit() {
    this.initForm();
  }
  gotValue(e) {
    console.log(e.target.value);
  }

  onSubmit() {
    const formValue = this.createLeadForm.value;
    const leadModel: Lead = {...formValue};
    this.leadStoreService.setLeadCreation(leadModel);
    this.router.navigate(['/pages/lead-creation/lead-dedupe']);
  }

}
