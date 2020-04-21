import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { VehicleDetailService } from '../../lead-section/services/vehicle-detail.service';
import { LovDataService } from '@services/lov-data.service';
import { LeadStoreService } from '@services/lead-store.service';
import { Router } from '@angular/router';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-sourcing-dde',
  templateUrl: './sourcing-dde.component.html',
  styleUrls: ['./sourcing-dde.component.css']
})
export class SourcingDdeComponent implements OnInit {
  values: any = [];
  public labels: any = {};
  sourcingDdeForm: FormGroup;
  SourcingChange: any;
  ProfessionList: { key: number; value: string; }[];
  constructor(
    private leadSectionService: VehicleDetailService,
    private lovData: LovDataService,
    private leadStoreService: LeadStoreService,
    private router: Router,
    private labelsData: LabelsService) { }

  ngOnInit() {
    this.initForm();
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].ddeLoanDetails[0];
      console.log(this.values);
      this.values.loanAccountBranch = res[0].leadCreation[0].loanAccountBranch;
      this.setFormValue();
    });
  }
  initForm() {
    this.sourcingDdeForm = new FormGroup({
      leadNumber: new FormControl({value: '', disabled: true}),
      leadCreatedDate: new FormControl({value: '', disabled: true}),
      leadCreatedBy: new FormControl({value: '', disabled: true}),
      leadHandledBy: new FormControl(''),
      sourcingChannel: new FormControl(''),
      sourcingType: new FormControl(''),
      sourcingCode: new FormControl(''),
      spokeCodeLocation: new FormControl(''),
      loanAccountBranch: new FormControl({value: '', disabled: true}),
      requestedAmount: new FormControl(''),
      businessDivision: new FormControl(''),
      product: new FormControl(''),
      schemePromotion: new FormControl(''),
      marginMoney: new FormControl(''),
      emiAffordability: new FormControl(''),
      requestedTenor: new FormControl('')
    });

    this.labelsData.getLabelsData().subscribe(
      data => {

        this.labels = data;
        // console.log(this.labels)
      },
      error => {
        console.log(error);
      });
  }

  setFormValue() {
    const sourcingValue = this.leadStoreService.getSourcingDetails() || {};
    this.sourcingDdeForm.patchValue({
      leadHandledBy: sourcingValue.leadHandledBy || '',
      sourcingChannel: sourcingValue.sourcingChannel || '',
      sourcingType: sourcingValue.sourcingType || '',
      sourcingCode: sourcingValue.sourcingCode || '',
      spokeCodeLocation: sourcingValue.spokeCodeLocation || ''
    });
    const leadData = this.leadStoreService.getLeadCreation() || {};
    this.sourcingDdeForm.patchValue({
      loanAccountBranch: leadData.loanAccountBranch || ''
    });
  }

  onNext() {
    this.leadSectionService.setCurrentPage(1);
  }

  onFormSubmit() {
    console.log('sourcing form', this.sourcingDdeForm.value);
    const formValue = this.sourcingDdeForm.value;
    const sourcingModel = {...formValue};
    // this.leadStoreService.setSourcingDetails(sourcingModel);
    this.router.navigate(['/pages/dde/product-details']);
  }
  sourcingChannelChange(event: any) {

    this.SourcingChange = event.target.value;
    console.log(this.SourcingChange);

    // tslint:disable-next-line:no-string-literal
    this.sourcingDdeForm.controls['sourcingChannel'].valueChanges.subscribe((value) => {


      setTimeout(() => {
        switch (this.SourcingChange) {

      case '1': this.ProfessionList = [{key: 1, value: 'DSA'}, {key: 2, value: 'Dealers'},
      {key: 3, value: 'Connectors'}, {key: 4, value: 'Direct/Employee/DSE'}, {key: 5, value: 'Manufacturers'}];
                break;
      case '2': this.ProfessionList = [{key: 1, value: 'Liability Branch Code'}];
                break;
      case '3': this.ProfessionList = [{key: 1, value: 'Corporate Website'},
       {key: 2, value: 'Internet Banking'}, {key: 3, value: 'Mobile Banking'}];
                break;
      default: this.ProfessionList = [{key: 1, value: 'Not Applicable'}];
               break;
    }
      }, 10);
    });
  }


}
