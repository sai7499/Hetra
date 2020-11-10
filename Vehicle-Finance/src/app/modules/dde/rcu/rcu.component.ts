import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ApplicantService } from '@services/applicant.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { PddDetailsService } from '@services/pdd-details.service';
import { RcuService } from '@services/rcu.service';
import { ToasterService } from '@services/toaster.service';
import { ToggleDdeService } from '@services/toggle-dde.service';


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
  constructor(
    private labelsData: LabelsService,
    private activatedRoute: ActivatedRoute,
    private rcuService: RcuService,
    private createLeadDataService: CreateLeadDataService,
    private applicantService: ApplicantService,
    private commonLovService: CommomLovService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,






  ) {
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

      fileRCUStatus: ['screened'],
      applicantId: [''],
      applicantType: [''],
      loanAmount: [''],
      vehicleMake: [''],
      vehicleModel: [''],
      vehicleNo: [''],
      rcuReportStatus: [''],
      rcuUpload: [''],
      rcuReportReceivedDate: [''],
      remarks: [''],
      applicantDocuments: this.formBuilder.array([this.getRcuDocumentDetails()])
    })
    console.log("formgroup....>", this.rcuDetailsForm);

    this.getAllRcuDetails()
    this.getApplicantList()
    this.assignRcuTask()
  }
  onClick(check) {
    //    console.log(check);
    if (check == 1) {
      this.tab = 'tab1';
    } else if (check == 2) {
      this.tab = 'tab2';
    } else {
      this.tab = 'tab3';
    }

  }

  onSwitch(check) {

    switch (check) {
      case 1:
        return 'tab1';
      case 2:
        return 'tab2';
      case 3:
        return 'tab3';
    }
  }
  private getRcuDocumentDetails(data?: any) {
    console.log(data);

    if (data === undefined) {
      // tslint:disable-next-line: prefer-for-of

      return this.formBuilder.group({
        // categoryCode: [''],
        categoryName: [''],
        dmsDocumentID: [''],
        documentName: [''],
        documentNo: [''],
        // documentType: [''],
        expiryDate: [''],
        issueDate: [''],
        // issuedAt: [''],
        // subCategoryName: [''],
        // subcategoryCode: [''],
        screened: [''],
        sampled: [''],
        rcuStatus: [''],

      });
    } else {
      return this.formBuilder.group({
        // categoryCode: data.categoryCode ,
        categoryName: data.categoryName ? data.categoryName : null,
        dmsDocumentID: data.dmsDocumentID ? data.dmsDocumentID : null,
        documentName: data.documentName ? data.documentName : null,
        documentNo: data.documentNo ? data.documentNo : null,
        // documentType: data.documentType ? data.documentType : null,
        expiryDate: data.expiryDate ? data.expiryDate : null,
        issueDate: data.issueDate ? data.issueDate : null,
        // issuedAt: data.issuedAt ? data.issuedAt : null,
        // subCategoryName: data.subCategoryName ? data.subCategoryName : null,
        // subcategoryCode: data.subcategoryCode ? data.subcategoryCode : null,
        screened: data.screened ? data.screened : null,
        sampled: data.sampled ? data.sampled : null,
        rcuStatus: data.rcuStatus ? data.rcuStatus : null,

      })
    }
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
  // getAllRcuDetails() {
  //   const data = {
  //     applicantId: this.applicantId
  //   }

  //   this.rcuService.getRcuDetails(data).subscribe((res: any) => {
  //     this.applicantResponse = res.ProcessVariables;
  //     this.rcuDetailsForm.patchValue({
  //       fileRCUStatus: this.applicantResponse.fileRCUStatus,
  //       // applicantId: this.applicantResponse.applicantId,
  //       // applicantType: this.applicantResponse.applicantType,
  //       loanAmount: this.applicantResponse.loanAmount,
  //       // vehicleMake: this.applicantResponse.vehicleMake,
  //       vehicleModel: this.applicantResponse.vehicleModel,
  //       vehicleNo: this.applicantResponse.vehicleNo,
  //       rcuReportStatus: this.applicantResponse.rcuReportStatus,
  //       // rcuUpload: this.applicantResponse.rcuUpload,
  //       rcuReportReceivedDate: this.applicantResponse.rcuReportReceivedDate,
  //       remarks: this.applicantResponse.remarks,  
  //       // documents: this.formBuilder.array(this.childgroups)  
  //     })
  //     this.documentDetails = this.applicantResponse.documents
  //     // this.childgroups = []

  //     if (this.documentDetails && this.documentDetails.length > 0) {
  //       for (let i = 0; i < this.documentDetails.length; i++) {

  //         this.childgroups.push(this.getRcuDocumentDetails(this.documentDetails[i]));
  //         // this.rcuDetailsForm.controls.documents.controls.push(this.getRcuDocumentDetails(this.documentDetails[i]));
  //         console.log(this.childgroups);

  //       }
  //      console.log(this.rcuDetailsForm)

  //       // this.rcuDetailsForm.controls.documents.push(childgroups)
  //     }


  //     console.log(this.applicantResponse);
  //     console.log(this.documentDetails && this.documentDetails.length > 0);


  //   })

  // }
  getAllRcuDetails() {
    const data = {
      applicantId: this.applicantId
    }
    this.rcuService.getRcuDetails(data).subscribe((res: any) => {
      const response = res.ProcessVariables
      this.applicantDocuments = response.applicantDocuments
      let applicantDocuments = response.applicantDocuments
      applicantDocuments = applicantDocuments.map((value) => {
        console.log(value);

        return {

          documentName: value.documentName,
          dmsDocumentID: value.dmsDocumentID,
          categoryName: value.categoryName,
          issueDate: value.issueDate,
          expiryDate: value.expiryDate,
          documentNo: value.documentNo,
          sampled: value.sampled,
          screened: value.screened,
          rcuStatus: value.rcuStatus
        };
      });
      console.log(applicantDocuments);

      this.getRcuDocumentDetails(applicantDocuments)

    })
  }
  testRadio(event) {
    // alert("event" + event)
    console.log(event);


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
    this.isRcuDetails = true
    const data = {
      leadId: this.leadId,
      userId: this.userId
    };

    this.rcuService.assignRcuTask(data).subscribe((res: any) => {
      console.log(res);
      console.log(res && res.ProcessVariables.error.code == '0')
      if (res && res.ProcessVariables.error.code == '0') {
        this.isRcuDetails = false
      } else {
        this.isRcuDetails = true
      }
      // const processVariables = value.ProcessVariables;
      // this.applicantDetails = processVariables.applicantListForLead;
    });
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
      const data = {
        userId: this.userId,
        applicantDocuments: this.rcuDetailsForm.controls.applicantDocuments.value,
        fileRCUStatus: this.rcuDetailsForm.controls.fileRCUStatus.value,
        applicantId: Number(this.rcuDetailsForm.controls.applicantId.value),
        applicantType: this.rcuDetailsForm.controls.applicantType.value,
        loanAmount: this.rcuDetailsForm.controls.loanAmount.value,
        vehicleMake: this.rcuDetailsForm.controls.vehicleMake.value,
        vehicleModel: this.rcuDetailsForm.controls.vehicleModel.value,
        vehicleNo: this.rcuDetailsForm.controls.vehicleNo.value,
        rcuReportStatus: this.rcuDetailsForm.controls.rcuReportStatus.value,
        rcuUpload: this.rcuDetailsForm.controls.rcuUpload.value,
        rcuReportReceivedDate: this.rcuDetailsForm.controls.rcuReportReceivedDate.value,
        remarks: this.rcuDetailsForm.controls.remarks.value,

      }
      this.rcuService.saveUpdateRcuDetails(data).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        if (res && res.ProcessVariables.error.code == '0') {
          // tslint:disable-next-line: prefer-const
          // const pddDetailsContols = this.pddDetailsForm.controls
          //   .pddDocumentDetails as FormArray;
          //   pddDetailsContols.controls = [];

          this.toasterService.showSuccess(
            'Updated Successfully',
            'RCU Details'
          );
          this.getAllRcuDetails();

        }
      });
    }
  }
}
