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
  sourcingDetailsForm: FormGroup;
  constructor(
    private leadSectionService: VehicleDetailService,
    private lovData: LovDataService,
    private leadStoreService: LeadStoreService,
    private router: Router,
    private labelsData: LabelsService) { }

  ngOnInit() {
    this.initForm();
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].sourcingDetails[0];
      this.values.loanAccountBranch = res[0].leadCreation[0].loanAccountBranch;
      this.setFormValue();
    });
  }
  initForm() {
    this.sourcingDetailsForm = new FormGroup({
      leadNumber: new FormControl({value: '', disabled: true}),
      leadCreatedDate: new FormControl({value: '', disabled: true}),
      leadCreatedBy: new FormControl({value: '', disabled: true}),
      leadHandledBy: new FormControl(''),
      sourcingChannel: new FormControl(''),
      sourcingType: new FormControl(''),
      sourcingCode: new FormControl(''),
      spokeCodeLocation: new FormControl(''),
      loanAccountBranch: new FormControl({value: '', disabled: true})
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
    this.sourcingDetailsForm.patchValue({
      leadHandledBy: sourcingValue.leadHandledBy || '',
      sourcingChannel: sourcingValue.sourcingChannel || '',
      sourcingType: sourcingValue.sourcingType || '',
      sourcingCode: sourcingValue.sourcingCode || '',
      spokeCodeLocation: sourcingValue.spokeCodeLocation || ''
    });
    const leadData = this.leadStoreService.getLeadCreation() || {};
    this.sourcingDetailsForm.patchValue({
      loanAccountBranch: leadData.loanAccountBranch || ''
    });
  }

  onNext() {
    this.leadSectionService.setCurrentPage(1);
  }

  onFormSubmit() {
    console.log('sourcing form', this.sourcingDetailsForm.value);
    const formValue = this.sourcingDetailsForm.value;
    const sourcingModel = {...formValue};
    // this.leadStoreService.setSourcingDetails(sourcingModel);
    this.router.navigate(['/pages/dde/product-details']);
  }

}
