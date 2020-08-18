import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { FormBuilder, FormControl, FormArray } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { ToasterService } from '@services/toaster.service';
import { PddDetailsService } from '@services/pdd-details.service';

@Component({
  selector: 'app-pdd-details',
  templateUrl: './pdd-details.component.html',
  styleUrls: ['./pdd-details.component.css']
})
export class PddDetailsComponent implements OnInit {
  labels: any = {};
  pddDetailsForm: any;
  isDirty = false;
  leadId: number;
  userId: string;
  applicantResponse: any;
  childgroups = [];
  submitted: boolean;
  pddLov: any = [];
  constructor(
    private router: Router,
    private labelsData: LabelsService,
    private formBuilder: FormBuilder,
    private commonLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private pddDetailsService: PddDetailsService
  ) { }

  ngOnInit() {

    this.getLabels();
    this.getLeadId();
    this.userId = localStorage.getItem('userId');
    this.getLov();
    
    // const data = {
    //   leadId: this.leadId,
    //   userId: this.userId
    // }

    this.pddDetailsForm = this.formBuilder.group({
      pddDocumentDetails: this.formBuilder.array(this.childgroups),
    })
    // this.pddDetailsService.getPddDetails(data).subscribe((res: any) => {
    //   console.log("getting response", res)
    //   this.applicantResponse = res.ProcessVariables.pddDocumentDetails;
    //   console.log(this.applicantResponse);
    //   // this.getpddDocumentDetails(this.applicantResponse)
    //   for (let i = 0; i < this.applicantResponse.length; i++) {
    //     this.childgroups.push(this.getpddDocumentDetails(this.applicantResponse[i]));
    //   }
    //   this.pddDetailsForm = this.formBuilder.group({
    //     pddDocumentDetails: this.formBuilder.array(this.childgroups),
    //   })
    // })
    this.getAllPddDetails();

    console.log(this.childgroups);


    console.log("form controls", this.pddDetailsForm);
  }


  // getting labels from labels.json
  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      (data) => {
        this.labels = data;
      },
      (error) => { }
    );
  }
  //getting leadID from Pdd Dashboard 
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
          this.leadId = Number(value.leadId);
        }
        resolve(null);
      });
    });
  }
  //getting LOV's from commonLovService
  getLov() {
    this.commonLovService.getLovData().subscribe((value: any) => {
      console.log("values", value);
      this.pddLov.checklistans = value.LOVS.checklistans;
    });
  }

  private getpddDocumentDetails(data?: any) {
    console.log("res from get", data);

    if (data === undefined) {
      // tslint:disable-next-line: prefer-for-of

      return this.formBuilder.group({
        documentName: [''],
        expectedDate: [''],
        documentNumber: [''],
        dmsDocumentId: [''],
        docCollectedDate: [''],
        pddDocumentStatus: [''],
        cpcCheck: [''],
        physicalTrackingNumber: [''],
      });
    } else 
     {
      return this.formBuilder.group({
        documentId: data.documentId ? data.documentId : null,
        documentName: data.documentTypeValue ? data.documentTypeValue : '',
        expectedDate: (data.deferredDate ? data.deferredDate : ''),
        documentNumber: data.documentNumber ? data.documentNumber : '',
        dmsDocumentId: data.dmsDocumentId ? data.dmsDocumentId : '',
        docCollectedDate: data.docCollectedDate ? data.docCollectedDate : '',
        pddDocumentStatus: data.pddDocumentStatus ? data.pddDocumentStatus : '',
        cpcCheck: data.cpcCheck ? data.cpcCheck : '',
        physicalTrackingNumber:data.physicalTrackingNumber ? data.physicalTrackingNumber : '',

      });
    }

    // if (data && data.length > 0) {
    //   // tslint:disable-next-line: prefer-for-of

    //   return this.formBuilder.group({

    //     documentName: new FormControl(data.documentTypeValue),
    //     expectedDate: new FormControl(data.deferredDate),
    //     documentNumber: new FormControl(data.documentNumber),
    //     dmsDocumentId: new FormControl(data.dmsDocumentId),
    //     docCollectedDate: new FormControl(data.docCollectedDate),
    //     pddDocumentStatus: new FormControl(data.pddDocumentStatus),
    //     cpcCheck: new FormControl(data.cpcCheck),
    //     physicalTrackingNumber: new FormControl(data.physicalTrackingNumber),
    //   });
    // } else 
    //  {
    //   return this.formBuilder.group({
    //     documentName: data.documentTypeValue ? data.documentTypeValue : '',
    //     expectedDate: (data.deferredDate ? data.deferredDate : ''),
    //     documentNumber: data.documentNumber ? data.documentNumber : '',
    //     dmsDocumentId: data.dmsDocumentId ? data.dmsDocumentId : '',
    //     docCollectedDate: data.docCollectedDate ? data.docCollectedDate : '',
    //     pddDocumentStatus: Number(data.pddDocumentStatus ? data.pddDocumentStatus : ''),
    //     cpcCheck: data.cpcCheck ? data.cpcCheck : '',
    //     physicalTrackingNumber: Number(data.physicalTrackingNumber ? data.physicalTrackingNumber : ''),

    //   });
    // }

    
  }
  //getting pdd details from getPddDetails api 
//   getAllPddDetails() {
//     const data = {
//       leadId: this.leadId,
//       userId: this.userId
//     }
// this.pddDetailsService.getPddDetails(data).subscribe((res: any) => {
//       console.log("getting response", res)
//       this.applicantResponse = res.ProcessVariables.pddDocumentDetails;
//       console.log(this.applicantResponse);
//       // this.getpddDocumentDetails(this.applicantResponse)
//       for (let i = 0; i < this.applicantResponse.length; i++) {
//         this.childgroups.push(this.getpddDocumentDetails(this.applicantResponse[i]));
//       }
//       this.pddDetailsForm = this.formBuilder.group({
//         pddDocumentDetails: this.formBuilder.array(this.childgroups),
//       })
//     })
//   }
  getAllPddDetails() {
    const pddDetailsContols = this.pddDetailsForm.controls
    .pddDocumentDetails as FormArray;
    console.log(pddDetailsContols);
    
    // pddDetailsContols.controls = [];
    const data = {
      leadId: this.leadId,
      userId: this.userId
    }
    this.pddDetailsService.getPddDetails(data).subscribe((res: any) => {
      // pddDetailsContols.controls = [];
      console.log("getting response", res)
      this.applicantResponse = res.ProcessVariables.pddDocumentDetails;
      console.log(this.applicantResponse);
      let childgroups = []
      // this.getpddDocumentDetails(this.applicantResponse)
      for (let i = 0; i < this.applicantResponse.length; i++) {
        childgroups.push(this.getpddDocumentDetails(this.applicantResponse[i]));
        // pddDetailsContols.controls.push(this.getpddDocumentDetails(this.applicantResponse[i]));
        // pddDetailsContols.value.push((this.applicantResponse[i]));
      }
      this.pddDetailsForm = this.formBuilder.group({
        pddDocumentDetails: this.formBuilder.array(childgroups),
      })
      // pddDetailsContols.controls.push(this.childgroups)
      // this.pddDetailsForm.controls.pddDocumentDetails = 
    })

  }
  onSubmit() {
    console.log(this.pddDetailsForm);

    this.submitted = true;
    // stop here if form is invalid
    if (this.pddDetailsForm.invalid) {
      this.toasterService.showError(
        'Fields Missing Or Invalid Pattern Detected',
        'OD Details'
      );
      return;
    } else {
      this.submitted = true;
      this.pddDetailsService.updatePddDetails(this.pddDetailsForm.value).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res && res.ProcessVariables.error.code == '0') {
          // tslint:disable-next-line: prefer-const
            console.log(this.pddDetailsForm);

          const pddDetailsContols = this.pddDetailsForm.controls
            .pddDocumentDetails as FormArray;
            console.log(pddDetailsContols);
            
            pddDetailsContols.controls = [];
          
          this.toasterService.showSuccess(
            'Updated Successfully',
            'Pdd Details'
          );
          this.getAllPddDetails();

        }
      });
    }
  }
  // onSubmit() {

  //   this.router.navigate([`/pages/dashboard`]);
  // }

  onBack() {
    this.router.navigate([`/pages/dashboard`]);
  }
}
