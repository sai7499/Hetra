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
    this.radioItems = [{ value: 'Screened' }, { value: 'Sampled' }]
    this.getSelecteditem()
    this.documentArray = this.formBuilder.array([this.childgroups])
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
      // documentName: [''],
      // documentCategory: [''],
      // documentNumber: [''],
      // issueDate: [''],
      // documentExpiryDate: [''],
      // view: [''],
      // screened: [''],
      // sampled: [''],
      // status: [''],
      rcuReportStatus: [''],
      rcuUpload: [''],
      rcuReportReceivedDate: [''],
      remarks: [''],
      documents: this.formBuilder.array(this.childgroups)
    })
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
        status: [''],

      });
    } else {
      return this.formBuilder.group({
        // categoryCode: data.categoryCode ,
        categoryName: data.categoryName,
        dmsDocumentID: data.dmsDocumentID,
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
        status: data.status ? data.status : null,

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
  getAllRcuDetails() {
    const data = {
      applicantId: this.applicantId
    }

    this.rcuService.getRcuDetails(data).subscribe((res: any) => {
      this.applicantResponse = res.ProcessVariables;
      this.documentDetails = this.applicantResponse.documents
      this.childgroups = []

      if (this.documentDetails && this.documentDetails.length > 0) {
        for (let i = 0; i < this.documentDetails.length; i++) {
          
          this.childgroups.push(this.getRcuDocumentDetails(this.documentDetails[i]));
          // this.rcuDetailsForm.controls.documents.controls.push(this.getRcuDocumentDetails(this.documentDetails[i]));
          console.log(this.childgroups);

        }
       console.log(this.rcuDetailsForm)
      
        // this.rcuDetailsForm.controls.documents.push(childgroups)
      }
      this.rcuDetailsForm.patchValue({
        fileRCUStatus: this.applicantResponse.fileRCUStatus,
        // applicantId: this.applicantResponse.applicantId,
        // applicantType: this.applicantResponse.applicantType,
        loanAmount: this.applicantResponse.loanAmount,
        // vehicleMake: this.applicantResponse.vehicleMake,
        vehicleModel: this.applicantResponse.vehicleModel,
        vehicleNo: this.applicantResponse.vehicleNo,
        rcuReportStatus: this.applicantResponse.rcuReportStatus,
        // rcuUpload: this.applicantResponse.rcuUpload,
        rcuReportReceivedDate: this.applicantResponse.rcuReportReceivedDate,
        remarks: this.applicantResponse.remarks,  
        // documents: this.formBuilder.array(this.childgroups)  
      })
      
      console.log(this.applicantResponse);
      console.log(this.documentDetails && this.documentDetails.length > 0);

      
    })

  }
  testRadio(event) {
    // alert("event" + event)

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
      // this.pddDetailsForm.value.pddDocumentDetails.forEach(ele => {
      //   if(ele.docCollectedDate != null){
      //   ele.docCollectedDate =this.utilityService.convertDateTimeTOUTC(
      //     ele.docCollectedDate,
      //     'DD/MM/YYYY'
      //   );
      //   }
      // });
      const body = {
        applicantId: 3539,
        loanAmount: "300000",
        vehicleModel: "New",
        vehicleNo: "TN02A9879",
        fileRCUStatus: "Test",
        rcuActivityDate: "01/11/2020",
        rcuActivityTime: "02:41 PM",
        documentSampled: "123",
        rcuReportReceivedDate: "02/11/2020",
        rcuReportReceivedTime: "",
        rcuReportStatus: "test",
        remarks: "test",
        userId: "1002"

      }
      this.rcuService.saveUpdateRcuDetails(body).subscribe((res: any) => {
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
