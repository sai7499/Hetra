import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LovDataService } from '@services/lov-data.service';
import { CommomLovService } from '@services/commom-lov-service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {

  public personalDetailsForm: FormGroup;
  public errorMsg: string = '';
  public labels: any = {};
  private leadId: number = 0;

  public applicantLov: any = {};
  public getLabels;
  isDirty: boolean;
  LOV: any = [];
  applicantId: any;
  standardOfLiving: any;
  version: any;

  constructor(private labelsData: LabelsService,
    private _fb: FormBuilder, private router: Router,
    private lovDataService: LovDataService,
    private activatedRoute: ActivatedRoute,
    private commomLovService: CommomLovService,) { }

  async ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        this.errorMsg = error;
      });
    this.initForm();

    this.leadId = (await this.getLeadId()) as number;

    console.log('LeadId', this.leadId)

    this.getLOV();
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.applicantLov = value ? value[0].applicantDetails[0] : {};
    });
  }

  initForm() {

    this.personalDetailsForm = this._fb.group({
      applicantName: [{ value: '', disabled: true }],
      fatherName: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      physicallyChallenged: ['', Validators.required],
      residancePhoneNumber: ['', Validators.required],
      officePhoneNumber: ['', Validators.required],
      mobile: [{ value: '', disabled: true }],
      residenceAddressAsPerLoanApplication: ['', Validators.required],
      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      landmark: ['', Validators.required],
      addressAccessibility: ['', Validators.required],
      residentialLocality: ['', Validators.required],
      residentialType: ['', Validators.required],
      houseType: ['', Validators.required],
      sizeOfHouse: ['', Validators.required],
      standardOfLiving: ['', Validators.required],
      houseOwnership: ['', Validators.required],
      ratingbySO: ['', Validators.required]
    })

  }

  getLOV() { // fun call to get all lovs
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    this.standardOfLiving = this.LOV.LOVS['fi/PdHouseStandard'].filter(data => data.value !== 'Very Good');
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      console.log(value.version)
      this.version = value.version ? String(value.version): null;
    });
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  onNavigateNext() {
    if (this.version) {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${this.applicantId}/income-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/${this.applicantId}/income-details`]);
    }
  }

  onNavigateBack() {
    if (this.version) {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list`]);
    } else {
      this.router.navigateByUrl(`/pages/pd-dashboard/${this.leadId}/pd-list`);
    }
  }

  onFormSubmit(url: string) {

  }

}
