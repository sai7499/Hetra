import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { FormBuilder, FormControl, FormArray } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { ToasterService } from '@services/toaster.service';
import { PddDetailsService } from '@services/pdd-details.service';
import { UploadService } from '@services/upload.service';
import { DraggableContainerService } from '@services/draggable.service';
import { UtilityService } from '@services/utility.service';

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
  public toDayDate: Date = new Date();

  constructor(
    private router: Router,
    private labelsData: LabelsService,
    private formBuilder: FormBuilder,
    private commonLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private pddDetailsService: PddDetailsService,
    private uploadService: UploadService,
    private draggableContainerService: DraggableContainerService,
    private utilityService: UtilityService,


  ) { }

  ngOnInit() {

    this.getLabels();
    this.getLeadId();
    this.userId = localStorage.getItem('userId');
    this.getLov();
   
    this.pddDetailsForm = this.formBuilder.group({
      pddDocumentDetails: this.formBuilder.array(this.childgroups),
    })
    this.getAllPddDetails();

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
      this.pddLov.checklistans = value.LOVS.checklistans;
    });
  }

  private getpddDocumentDetails(data?: any) {

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
        documentName: data.documentTypeValue ? data.documentTypeValue : null,
        expectedDate: (data.deferredDate ? data.deferredDate : null),
        documentNumber: data.documentNumber ? data.documentNumber : null,
        dmsDocumentId: data.dmsDocumentId ? data.dmsDocumentId : null,
        docCollectedDate: data.docCollectedDate ? this.utilityService.getDateFromString(data.docCollectedDate) : null,
        pddDocumentStatus: data.pddDocumentStatus ? data.pddDocumentStatus : null,
        cpcCheck: data.cpcCheck ? data.cpcCheck : null,
        physicalTrackingNumber:data.physicalTrackingNumber ? data.physicalTrackingNumber : null,

      });
    }
  }
  getAllPddDetails() {
    const data = {
      leadId: this.leadId,
      userId: this.userId
    }
    this.pddDetailsService.getPddDetails(data).subscribe((res: any) => {
      this.applicantResponse = res.ProcessVariables.pddDocumentDetails;
      let childgroups = []
      if(this.applicantResponse && this.applicantResponse.length > 0 ){
        for (let i = 0; i < this.applicantResponse.length; i++) {
          childgroups.push(this.getpddDocumentDetails(this.applicantResponse[i]));
        }
        this.pddDetailsForm = this.formBuilder.group({
          pddDocumentDetails: this.formBuilder.array(childgroups),
        })
      }
    })

  }

  onUpdate() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.pddDetailsForm.invalid) {
      this.toasterService.showError(
        'Fields Missing Or Invalid Pattern Detected',
        'Pdd Details'
      );
      return;
    } else {
      this.submitted = true;
      this.pddDetailsForm.value.pddDocumentDetails.forEach(ele => {
        if(ele.docCollectedDate != null){
        ele.docCollectedDate =this.utilityService.convertDateTimeTOUTC(
          ele.docCollectedDate,
          'DD/MM/YYYY'
        );
        }
      });
      const body = {
        pddDocumentDetails: this.pddDetailsForm.value.pddDocumentDetails

      }
      this.pddDetailsService.updatePddDetails(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res && res.ProcessVariables.error.code == '0') {
          // tslint:disable-next-line: prefer-const
          const pddDetailsContols = this.pddDetailsForm.controls
            .pddDocumentDetails as FormArray;
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

  //to View uploaded Document
  getBase64String(dmsDocumentId) {
    return new Promise((resolve, reject) => {
      this.uploadService
        .getDocumentBase64String(dmsDocumentId)
        .subscribe((value) => {

          const imageUrl = value['dwnldDocumentRep'].msgBdy.bsPyld;
          const documentName = value['dwnldDocumentRep'].msgBdy.docNm || '';
          const imageType = documentName.split('.')[1].toLowerCase();

          resolve({
            imageUrl,
            imageType,
          });
          console.log('downloadDocs', value);
        });
    });
  }
  //for document 
  async downloadDocs(event) {
    // let el = event.srcElement;
    const dmsDocumentID : any = await this.getBase64String(event)
      const showDraggableContainer = {
        imageUrl: dmsDocumentID.imageUrl,
        imageType: dmsDocumentID.imageType,
      };
      this.draggableContainerService.setContainerValue({
        image: showDraggableContainer,
      });
  }

  onBack() {
    this.router.navigate([`/pages/dashboard`]);
  }
}
