import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { FormBuilder, FormControl } from '@angular/forms';
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
    // this.getAllPddDetails();
    const data = {
      leadId: this.leadId,
      userId: this.userId
    }
    this.pddDetailsForm = this.formBuilder.group({
      pddDocumentDetails: this.formBuilder.array(this.childgroups),
    })
    this.pddDetailsService.getPddDetails(data).subscribe((res: any) => {
      console.log("getting response", res)
      this.applicantResponse = res.ProcessVariables.pddDocumentDetails;
      console.log(this.applicantResponse);
      // this.getpddDocumentDetails(this.applicantResponse)
      for(let i = 0; i < this.applicantResponse.length; i++){
        this.childgroups.push(this.getpddDocumentDetails(this.applicantResponse[i]));
      }
      this.pddDetailsForm = this.formBuilder.group({
        pddDocumentDetails: this.formBuilder.array(this.childgroups),
      })
    })
   
    console.log(this.childgroups);
    
    
    console.log("form controls", this.pddDetailsForm.value);
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

    });
  }

  private getpddDocumentDetails(data?: any) {
    console.log("res from get", data);

    // if (data ) {
    //   if (data && data.length > 0) {
        // tslint:disable-next-line: prefer-for-of
        // for (let i = 0; i < data.length; i++) {

          return this.formBuilder.group({

            documentName: new FormControl(data.documentName),
            expectedDate: new FormControl(data.expectedDate),
            documentNumber: new FormControl(data.documentNumber),
            viewDocument: new FormControl(data.viewDocument),
            collectedDate: new FormControl(data.collectedDate),
            status: new FormControl(data.status),
            cpcCheck: new FormControl(data.cpcCheck),
            physicalTrackingNumber: new FormControl(data.physicalTrackingNumber),
          });
        // }
      // }
     
    // } else if(data === undefined) {
    //     return this.formBuilder.group({
    //       documentName: Number(data.documentName ? data.documentName : ''),
    //       documentNumber: data.documentNumber ? data.documentNumber : '',
    //       viewDocument: data.viewDocument
    //         ? data.viewDocument
    //         : '',
    //       collectedDate: data.collectedDate ? data.collectedDate : '',
    //       status: Number(data.status ? data.status : ''),
    //       cpcCheck: Number(data.cpcCheck ? data.cpcCheck : ''),
    //       physicalTrackingNumber: Number(data.physicalTrackingNumber ? data.physicalTrackingNumber : ''),
    //     });
    // }
  }
  //getting pdd details from getPddDetails api 
  // getAllPddDetails() {
  //   const data = {
  //     leadId: this.leadId,
  //     userId: this.userId
  //   }
  //   this.pddDetailsService.getPddDetails(data).subscribe((res: any) => {
  //     console.log("getting response", res)
  //     this.applicantResponse = res.ProcessVariables.pddDocumentDetails;
  //     console.log(this.applicantResponse);
  //     // this.getpddDocumentDetails(this.applicantResponse)
  //     for(let i = 0; i < this.applicantResponse.length; i++){
  //       this.childgroups.push(this.getpddDocumentDetails(this.applicantResponse[i]));
  //     }
     
  //   })

  // }

  onSubmit() {
    this.router.navigate([`/pages/dashboard`]);
  }

  onBack() {
    this.router.navigate([`/pages/dashboard`]);
  }
}
