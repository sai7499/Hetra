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
  public maxDate: any = new Date();

  public applicantLov: any = {};
  public getLabels;
  isDirty: boolean;
  LOV: any = [];
  applicantId: any;
  standardOfLiving: any;
  version: any;

  constructor(private labelsData: LabelsService,
    // tslint:disable-next-line: variable-name
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

    this.getLOV();
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.applicantLov = value ? value[0].applicantDetails[0] : {};
    });
  }

  initForm() {

    this.personalDetailsForm = this._fb.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      applicantName: [{ value: '', disabled: true }],
      fatherFirstName: ['', Validators.required],
      fatherMiddleName: ['', Validators.required],
      fatherLastName: ['', Validators.required],
      fatherName: [{ value: '', disabled: true }],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      dom: [''],
      religion: ['', Validators.required],
      category: ['', Validators.required],
      physicallyChallenged: ['', Validators.required],
      customerProfile: ['', Validators.required],
      priorExperience: ['', Validators.required],
      businessKey: ['', Validators.required],
      occupationType: ['', Validators.required],
      businessType: ['', Validators.required],
      natureOfBusiness: [''],
      educationalBackground: [''],
      isMinority: [''],
      community: [''],
      srto: [''],
      contactNumber: ['', Validators.required],
      alternateMobileNumber: ['', Validators.required],
      emailId: ['', Validators.required],
      residentStatus: ['', Validators.required],
      accomodationType: ['', Validators.required],
      noOfYearsResiding: [''],
      noOfAdultsDependant: [''],
      noOfChildrenDependant: [''],
      bankHolderName: [''],
      branch: [''],
      cbs: ['']
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
      console.log(value.version);
      this.version = value.version ? String(value.version) : null;
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
      console.log('in routing defined version condition', this.version);
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/income-details/${this.version}`]);
    } else {
      console.log('in routing undefined version condition', this.version);
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/income-details`]);
    }
  }

  onNavigateBack() {
    if (this.router.url.includes('/fi-cum-pd-dashboard')) {
      this.router.navigate([`/pages/fi-cum-pd-dashboard/${this.leadId}/pd-list`]);
    } else if (this.router.url.includes('/dde')) {
      {
        this.router.navigateByUrl(`/pages/dde/${this.leadId}/pd-list`);
      }
    }
  }

  onFormSubmit(url: string) {

  }

}
