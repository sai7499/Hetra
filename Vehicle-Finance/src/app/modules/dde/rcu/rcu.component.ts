import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ApplicantService } from '@services/applicant.service';
import { CommomLovService } from '@services/commom-lov-service';
import { DraggableContainerService } from '@services/draggable.service';
import { LabelsService } from '@services/labels.service';
import { PddDetailsService } from '@services/pdd-details.service';
import { RcuService } from '@services/rcu.service';
import { ToasterService } from '@services/toaster.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { UploadService } from '@services/upload.service';
import { UtilityService } from '@services/utility.service';


@Component({
  selector: 'app-rcu',
  templateUrl: './rcu.component.html',
  styleUrls: ['./rcu.component.css']
})
export class RcuComponent implements OnInit {
  labels: any;
  isRcuDetails: boolean = true;
  leadId: number;
  userId: string;
  applicantResponse: any;
  applicantId: any;
  applicantDetails: any;
  rcuLov: any = [];
  rcuDetailsForm: any;
  radioItems = [];
  childgroups = [];
  applicantType: any;

  model = { option: 'Screened' };
  radioSel: any;
  radioSelectedString: string;
  documentDetails: any;
  submitted: boolean;
  documentArray: FormArray;
  tab: any = 'tab1';
  tab1: any;
  tab2: any;
  documents: any;
  applicantDocuments: any;
  fileRCUStatus: any;
  screened: string;
  sampled: string;
  response: any;
  showColletralDocuments: boolean = false;
  collateralDocuments: any;
  selectDocument: any;
 rcuInitiated = false
 today: any = new Date();
//  public value: Date = new Date(2019, 5, 1, 22);
//     public format = 'MM/dd/yyyy HH:mm';
  constructor(
    private labelsData: LabelsService,
    private activatedRoute: ActivatedRoute,
    private rcuService: RcuService,
    private createLeadDataService: CreateLeadDataService,
    private applicantService: ApplicantService,
    private commonLovService: CommomLovService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private utilityService: UtilityService,
    private uploadService: UploadService,
    private draggableContainerService: DraggableContainerService,





  ) {
    console.log(this.today);
    
    // this.radioItems = [{ value: 'Screened' }, { value: 'Sampled' }]
    // this.getSelecteditem()
    // this.documentArray = this.formBuilder.array([this.childgroups])
    //   { id: 11, name: 'Dr Nice' },[{value: 'Screened'},{value: 'Sampled'}];

  }

  ngOnInit() {
    this.getLabels();
    this.getLeadId();
    this.getLov();

    this.userId = localStorage.getItem('userId');
    const leadData = this.createLeadDataService.getLeadSectionData();
    const leadSectionData = leadData as any;
    this.applicantId = leadSectionData.applicantDetails[0]['applicantId'];

    this.rcuDetailsForm = this.formBuilder.group({

      fileRCUStatus: [''],
      applicantId: [''],
      applicantType: [''],
      loanAmount: [''],
      vehicleMake: [''],
      vehicleModel: [''],
      vehicleNo: [''],
      rcuReportStatus: [''],
      // rcuUpload: [''],
      rcuReportReceivedDateTime: [''],
      remarks: [''],
      applicantDocuments: this.formBuilder.array([]),
      collateralDocuments:this.formBuilder.array([])
    })
    console.log("formgroup....>", this.rcuDetailsForm);
    // this.testRadio('screened')
    this.getApplicantList()

    this.getAllRcuDetails(this.rcuInitiated)
    // this.assignRcuTask()
  }
  showDocuments(check) {
    //    console.log(check);
    this.selectDocument = check
    if (check == 'applicant') {
      this.tab = 'tab1';
      this.showColletralDocuments = false
    } else if (check == 'colletral') {
      this.tab = 'tab2';
      this.showColletralDocuments = true
    }
    // this.getAllRcuDetails()

  }

  onSwitch(check) {

    switch (check) {
      case 1:
        return 'tab1';
      case 2:
        return 'tab2';
    }
  }
  private getRcuDocumentDetails(data?: any) {
    console.log(data);

    if (data === undefined) {
      // tslint:disable-next-line: prefer-for-of

      return this.formBuilder.group({
        categoryName: [''],
        dmsDocumentID: [''],
        documentName: [''],
        documentNo: [''],
        expiryDate: [''],
        issueDate: [''],
        screened: [''],
        sampled: [''],
        rcuStatus: [''],

      });
    } else {
      return this.formBuilder.group({
        categoryName: data.categoryName,
        dmsDocumentID: data.dmsDocumentID,
        documentName: data.documentName,
        documentNo: data.documentNo,
        expiryDate: this.utilityService.getDateFromString(data.expiryDate),
        issueDate: this.utilityService.getDateFromString(data.issueDate),
        screened: data.screened,
        sampled: data.sampled,
        rcuStatus: data.rcuStatus,

      })
    }
  }

  populateApplicantDocuments(event) {
    event = event ? event : "screened"
    this.rcuDetailsForm.patchValue({
      fileRCUStatus: event,
      loanAmount: this.response.loanAmount,
      applicantId: this.response.applicantDetails[0].applicantId,
      applicantType: this.response.applicantDetails[0].applicantType,
      vehicleMake: this.response.vehicleMake,
      vehicleModel: this.response.vehicleModel,
      vehicleNo: this.response.vehicleNo,
      rcuReportStatus: this.response.rcuReportStatus,
      // rcuUpload: this.response.rcuUpload,
      rcuReportReceivedDateTime: this.response.rcuReportReceivedDateTime,
      remarks: this.response.remarks,
    })

    if (this.applicantDocuments != null) {
      for (let i = 0; i < this.applicantDocuments.length; i++) {
        this.rcuDetailsForm.controls.applicantDocuments.push(this.getRcuDocumentDetails(this.applicantDocuments[i]))
      }
      this.testRadio(event)
    }
    if (this.collateralDocuments != null) {
      for (let i = 0; i < this.collateralDocuments.length; i++) {
        this.rcuDetailsForm.controls.collateralDocuments.push(this.getRcuDocumentDetails(this.collateralDocuments[i]))
      }
      this.testRadio(event)
    }
    // if(event !== null && event !== ""){
    //   this.testRadio(event)
    // }else {
    //   this.testRadio('screened')
    // }

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
      this.rcuLov.rcuStatus = value.LOVS.rcuStatus;
      console.log(value);

    });
  }

  showRcuDetails() {
    this.isRcuDetails = false
  }
  getSelecteditem() {
    this.radioSel = this.radioItems.find(value => value === this.model.option);
    this.radioSelectedString = JSON.stringify(this.radioSel);
    console.log(this.radioSelectedString);

  }
  onItemChange(item) {
    this.getSelecteditem();
    console.log(item);

  }

  getAllRcuDetails(rcuInitiate) {
    console.log(rcuInitiate);
    
    const data = {
      applicantId: this.applicantId
    }
    this.rcuService.getRcuDetails(data).subscribe((res: any) => {
      this.response = res.ProcessVariables
      if(this.response.rcuInitiated == rcuInitiate){
        this.isRcuDetails = true
      }else{
        this.isRcuDetails = false

      }
       
      this.applicantDocuments = this.response.applicantDocuments
      this.collateralDocuments = this.response.collateralDocuments
      // this.applicantDetails = this.response.applicantDetails
      console.log(this.applicantDocuments);
// if(this.applicantDetails && this.applicantDetails.length > 0 ){
//   for (let i = 0; i < this.applicantDetails.length; i++) {
//     this.rcuDetailsForm.controls.applicantDetails.push(
//       this.populateApplicantDocuments(data[i])
//     );
//   }
// }
console.log(this.tab);
this.populateApplicantDocuments(this.response.fileRCUStatus)

// if(this.tab == this.tab1)  {
//   this.showColletralDocuments = false
//   this.populateApplicantDocuments(this.response.fileRCUStatus)

// }  else if( this.tab == this.tab2)  {
//   this.showColletralDocuments = true
//   this.populateColletralDocuments(this.response.fileRCUStatus)
// }
     
      // this.testRadio(this.response.fileRCUStatus)
    })
  }
  onSubmit() {
    console.log(this.rcuDetailsForm);

    this.submitted = true;
    // stop here if form is invalid
    if (this.rcuDetailsForm.invalid) {
      this.toasterService.showError(
        'Fields Missing Or Invalid Pattern Detected',
        'RCU Details'
      );
      return;
    } else {
      this.submitted = true;
      this.rcuDetailsForm.value.applicantDocuments.forEach((ele) => {
        ele.issueDate = this.utilityService.convertDateTimeTOUTC(
          ele.issueDate,
          'DD/MM/YYYY'
        );
        ele.expiryDate = this.utilityService.convertDateTimeTOUTC(
          ele.expiryDate,
          'DD/MM/YYYY'
        );
        
      });
      // this.rcuDetailsForm.value.collateralDocuments.forEach((ele) => {
      //   ele.issueDate = this.utilityService.convertDateTimeTOUTC(
      //     ele.issueDate,
      //     'DD/MM/YYYY'
      //   );
      //   ele.expiryDate = this.utilityService.convertDateTimeTOUTC(
      //     ele.expiryDate,
      //     'DD/MM/YYYY'
      //   );
        
      // });
      const data = {
        userId: this.userId,
        applicantDocuments: this.rcuDetailsForm.controls.applicantDocuments.value,
        collateralDocuments: this.rcuDetailsForm.controls.collateralDocuments.value,
        fileRCUStatus: this.rcuDetailsForm.controls.fileRCUStatus.value,
        applicantId: Number(this.rcuDetailsForm.controls.applicantId.value),
        applicantType: this.rcuDetailsForm.controls.applicantType.value,
        loanAmount: this.rcuDetailsForm.controls.loanAmount.value,
        vehicleMake: this.rcuDetailsForm.controls.vehicleMake.value,
        vehicleModel: this.rcuDetailsForm.controls.vehicleModel.value,
        vehicleNo: this.rcuDetailsForm.controls.vehicleNo.value,
        rcuReportStatus: this.rcuDetailsForm.controls.rcuReportStatus.value,
        // rcuUpload: this.rcuDetailsForm.controls.rcuUpload.value,
        rcuReportReceivedDateTime:
          this.rcuDetailsForm.controls.rcuReportReceivedDateTime.value,
          
        
        remarks: this.rcuDetailsForm.controls.remarks.value,

      }
      this.rcuService.saveUpdateRcuDetails(data).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res && res.ProcessVariables.error.code == '0') {
          // tslint:disable-next-line: prefer-const
          let rcuFormApplicantControls = this.rcuDetailsForm.controls.applicantDocuments as FormArray;
          rcuFormApplicantControls.controls = [];
          let rcuFormColletralControls = this.rcuDetailsForm.controls.collateralDocuments as FormArray;
          rcuFormColletralControls.controls = [];
          this.toasterService.showSuccess(
            'Updated Successfully',
            'RCU Details'
          );
          this.rcuInitiated = true
          this.getAllRcuDetails( this.rcuInitiated);

        }
      });
    }
  }
  testRadio(event) {
    // alert("event" + event)
    // this.fileRCUStatus = this.rcuDetailsForm.controls.fileRCUStatus.value
    console.log(this.fileRCUStatus);
    console.log(event);

    if (event == "screened" && this.applicantDocuments != null) {
      this.screened = '0'
      this.sampled = '1'
      for (let i = 0; i < this.rcuDetailsForm.controls.applicantDocuments.length; i++) {
        const control = this.rcuDetailsForm.controls.applicantDocuments.controls as FormArray
        control[i].patchValue({
          screened: '1',
          sampled: '0'
        })
      }
    } else
    if (event == "screened" && this.collateralDocuments != null) {
      this.screened = '0'
      this.sampled = '1'
      for (let i = 0; i < this.rcuDetailsForm.controls.collateralDocuments.length; i++) {
        const control = this.rcuDetailsForm.controls.collateralDocuments.controls as FormArray
        control[i].patchValue({
          screened: '1',
          sampled: '0'
        })
      }
    } else
  
    if (event == "sampled"  && this.applicantDocuments != null) {
      this.screened = '1'
      this.sampled = '0'
      for (let i = 0; i < this.rcuDetailsForm.controls.applicantDocuments.length; i++) {
        const control = this.rcuDetailsForm.controls.applicantDocuments.controls as FormArray
        control[i].patchValue({
          screened: '0',
          sampled: '1'
        })
      }
     
    } else
    if (event == "sampled"  && this.collateralDocuments != null) {
      this.screened = '1'
      this.sampled = '0'
      for (let i = 0; i < this.rcuDetailsForm.controls.collateralDocuments.length; i++) {
        const control = this.rcuDetailsForm.controls.collateralDocuments.controls as FormArray
        control[i].patchValue({
          screened: '0',
          sampled: '1'
        })
      }
    }

  }
  getApplicantList() {
    const data = {
      leadId: this.leadId,
    };

    this.applicantService.getApplicantList(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      this.applicantDetails = processVariables.applicantListForLead;
    });
  }
  onRcuApplicantChange(event, i?: number) {
    console.log(event);

    // tslint:disable-next-line: triple-equals
    console.log(this.applicantDetails);

    const applicantType = this.applicantDetails.find(

      // tslint:disable-next-line: triple-equals
      (res) => res.applicantId == event
    ).applicantType;
    // const control = this.rcuDetailsForm.controls
    //   .obligationDetails as FormArray;
    console.log(this.rcuDetailsForm);

    this.rcuDetailsForm.get('applicantType').setValue(applicantType);
  }
  assignRcuTask() {

 this.rcuInitiated = true
 this.getAllRcuDetails( this.rcuInitiated)
    // this.isRcuDetails = true
    const data = {
      leadId: this.leadId,
      userId: this.userId
    };

    this.rcuService.assignRcuTask(data).subscribe((res: any) => {
      console.log(res);
      console.log(res && res.ProcessVariables.error.code == '0')
      if (res && res.ProcessVariables.error.code == '0') {
        // this.isRcuDetails = false
      } else {
        // this.isRcuDetails = true
      }
      // const processVariables = value.ProcessVariables;
      // this.applicantDetails = processVariables.applicantListForLead;
    });
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
}
