import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { VehicleDetailService } from '../services/vehicle-detail.service';
import { LovDataService } from 'src/app/services/lov-data.service';
<<<<<<< HEAD
import { LabelsService } from 'src/app/services/labels.service';
=======
import { LeadStoreService } from '@services/lead-store.service';
>>>>>>> 30d14c8a9a77fde33ea116b85e14c89b60751a9c

@Component({
  selector: 'app-sourcing-details',
  templateUrl: './sourcing-details.component.html',
  styleUrls: ['./sourcing-details.component.css']
})
export class SourcingDetailsComponent implements OnInit {
  values: any = [];
   public labels:any;
  

<<<<<<< HEAD
  constructor(private leadSectionService: VehicleDetailService, private lovData: LovDataService,private labelsData : LabelsService) { }

  ngOnInit() {


=======
  sourcingDetailsForm: FormGroup;


  constructor(
    private leadSectionService: VehicleDetailService,
    private lovData: LovDataService,
    private leadStoreService: LeadStoreService,
    private router: Router) { }

  ngOnInit() {
    this.initForm();
>>>>>>> 30d14c8a9a77fde33ea116b85e14c89b60751a9c
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].sourcingDetails[0];
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
      data =>{

        this.labels = data
        // console.log(this.labels)
      },
      error =>{
        console.log(error);
        
      }
      
    )

   
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
    console.log('sourcing value', this.leadStoreService.getSourcingDetails());
  }

  onNext() {
    this.leadSectionService.setCurrentPage(1);
  }

  onFormSubmit() {
    console.log('sourcing form', this.sourcingDetailsForm.value);
    const formValue = this.sourcingDetailsForm.value;
    const sourcingModel = {...formValue};
    this.leadStoreService.setSourcingDetails(sourcingModel);
    this.router.navigate(['/pages/lead-section/product-details']);
  }

}
