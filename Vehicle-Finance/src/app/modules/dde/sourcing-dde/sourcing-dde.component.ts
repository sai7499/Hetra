import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';

@Component({
  selector: 'app-sourcing-dde',
  templateUrl: './sourcing-dde.component.html',
  styleUrls: ['./sourcing-dde.component.css']
})
export class SourcingDdeComponent implements OnInit {
  values: any = [];
  public labels: any = {};
  sourcingDetailsForm: FormGroup;
  SourcingChange: any;
  ProfessionList = [];
  text: any;
  id: any;


  constructor(
    private lovData: LovDataService,
    private leadStoreService: LeadStoreService,
    private router: Router,
    private labelsData: LabelsService) { }

  ngOnInit() {
    this.initForm();
    this.lovData.getLovData().subscribe((res: any) => {
      this.values.loanAccountBranch = res[0].leadCreation[0].loanAccountBranch;
      this.values.businessDivision = res[0].leadCreation[0].businessDivision;
      this.values.productCategory = res[0].leadCreation[0].productCategory;
      this.values.priority = res[0].leadCreation[0].priority;
      this.values.leadHandledBY = res[0].leadCreation[0].leadHandledBY;
      this.values.soucringChannel = res[0].leadCreation[0].soucringChannel;
      this.values.spokenCodeLocation = res[0].leadCreation[0].spokenCodeLocation;
      this.values.schemePromotion = res[0].leadCreation[0].schemePromotion;
      this.getdata();
    });
  }

  sourcingChannelChange(event: any) {

    this.SourcingChange = event.target.value;

    if (Number(this.SourcingChange) === 61) {
      this.ProfessionList = [{ key: 1, value: 'DSA' }, { key: 2, value: 'Dealers' },
      { key: 3, value: 'Connectors' }, { key: 4, value: 'Direct/Employee/DSE' }, { key: 5, value: 'Manufacturers' }];
      this.text = 'Employee Code';
    } else if (Number(this.SourcingChange) === 62) {
      this.ProfessionList = [{ key: 1, value: 'Liability Branch Code' }];
      this.text = 'Employee Code';
    } else if (Number(this.SourcingChange) === 63) {
      this.ProfessionList = [{ key: 1, value: 'Corporate Website' }, { key: 2, value: 'Internet Banking' }, { key: 3, value: 'Mobile Banking' }];
      this.text = 'Employee Code';
    } else if (Number(this.SourcingChange) === 64) {
      this.ProfessionList = [{ key: 1, value: 'Not Applicable' }];
      this.text = 'Campaign Code';

    } else {
      this.ProfessionList = [{ key: 1, value: 'Not Applicable' }];
      this.text = 'Employee Code';
    }

  }

  initForm() {
    this.sourcingDetailsForm = new FormGroup({
      leadNumber: new FormControl({ value: '', disabled: true }),
      leadCreatedDate: new FormControl({ value: '', disabled: true }),
      leadCreatedBy: new FormControl({ value: '', disabled: true }),
      leadHandledBy: new FormControl(''),
      priority: new FormControl(''),
      product: new FormControl(''),
      businessDivision: new FormControl({ value: '1', disabled: true }),
      sourcingChannel: new FormControl(''),
      sourcingType: new FormControl(''),
      sourcingCode: new FormControl(''),
      spokeCodeLocation: new FormControl({ value: '', disabled: true }),
      loanAccountBranch: new FormControl({ value: '', disabled: true }),
      schemePromotion: new FormControl(''),
      requestedAmount: new FormControl(''),
      requestedTenor: new FormControl('')
    });

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        console.log(error);
      });

  }

  getdata() {
    this.id = this.leadStoreService.getLeadCreation();

    this.getCategory(this.values.productCategory, this.id.productCategory, 'product');
    this.getCategory(this.values.priority, this.id.priority, 'priority');
    this.getCategory(this.values.businessDivision, this.id.businessDivision, 'businessDivision');
    this.getCategory(this.values.spokenCodeLocation, this.id.spokeCodeLocation, 'spokeCodeLocation');
    this.getCategory(this.values.loanAccountBranch, this.id.loanAccountBranch, 'loanAccountBranch');
    this.getCategory(this.values.leadHandledBY, this.id.leadHandledBy, 'leadHandledBy');
    this.getCategory(this.values.soucringChannel, this.id.sourcingChannel, 'sourcingChannel');
    this.getCategory(this.values.schemePromotion, this.id.schemePromotion, 'scheme-promotion');
  }

  getCategory(categoryArray, value, formControlName) {
    categoryArray.forEach(element => {
      if (parseInt(value) === element.key) {
        this.sourcingDetailsForm.controls[formControlName].setValue(element.key);
      }
    });
  }

  onFormSubmit() {
    this.router.navigate(['/pages/lead-section/applicant-details']);
    const formValue = this.sourcingDetailsForm.value;
    const sourcingModel = { ...formValue };
    this.leadStoreService.setSourcingDetails(sourcingModel);
  }
}
