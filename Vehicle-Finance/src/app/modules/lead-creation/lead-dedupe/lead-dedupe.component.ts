import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';
import { CreateLeadService } from '../service/creatLead.service';
import { CreateLeadDataService } from '../service/createLead-data.service';
import { Router } from '@angular/router';
import { LoginStoreService } from '@services/login-store.service';

@Component({
  selector: 'app-lead-dedupe',
  templateUrl: './lead-dedupe.component.html',
  styleUrls: ['./lead-dedupe.component.css'],
})
export class LeadDedupeComponent implements OnInit {
  labels: any = {};
  isReason: boolean;
  isSubmit: boolean;
  isChecked: boolean;
  isModal: boolean;
  radioValue = false;
  radioSelected: string;
  p = 1;
  perPage = 5;
  dedupeArray = [];
  selectedLead: boolean;
  showModal: string;
  modalMessage: string;
  leadId: string;
  isWithLead: boolean;
  status: string;
  product: string;
  rejectReasonList = [];
  rejectReasonCode: number;
  createdBy: string;
  userName: string;
  selectedIndex: number;
  isSelectedLead: boolean;
  isNewLead: boolean;
  isRejectLead: boolean;
  isRadioDisable: boolean;
  flowStage: string;
  isReasonSelected: boolean;

  @ViewChild('radioSelect', { static: true }) radioButtonSelected: ElementRef;
  udfScreenId: any;

  constructor(
    private route: Router,
    private labelsData: LabelsService,
    private leadStoreService: LeadStoreService,
    private createLeadService: CreateLeadService,
    private createLeadDataService: CreateLeadDataService,
    private loginStoreService: LoginStoreService
  ) {
    this.flowStage = '12';
   }

  ngOnInit() {
    this.getLabels();
    this.getUserDetails();
    this.getDedupeData();
    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = udfScreenId.QDE.leadDedupeQDE;

    })
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        console.log('labels', this.labels);
      },
      (error) => console.log(error)
    );
  }

  getUserDetails() {
    const getUserDetails = this.loginStoreService.getRolesAndUserDetails();
    if (!getUserDetails) {
      return;
    }
    this.userName = getUserDetails.userDetails.firstName;
  }

  getDedupeData() {
    const dedupeData = this.leadStoreService.getDedupeData();
    if (!dedupeData) {
      return;
    }
    this.dedupeArray = dedupeData.leadDedupeResults;
    this.leadId = dedupeData.leadDedupeResults[0].leadID;
    if(dedupeData.loanLeadDetails){
      this.product = dedupeData.loanLeadDetails.product;
    }
    console.log('dedupeData', dedupeData.leadDedupeResults);
  }

  OnProceed() {
    this.isReason = false;
    this.isSubmit = false;
    this.isWithLead = false;
    this.showModal = 'proceedModal_with';
    this.modalMessage = `Are you sure you want to proceed with lead - ${this.leadId} ?`;
  }

  OnReject() {
    this.createLeadService.rejectLead( this.flowStage, Number(this.product)).subscribe((res: any) => {
      const response = res;
      console.log('Reject Lead', response);
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;
      if (appiyoError === '0' && apiError === '0') {
        this.rejectReasonList = response.ProcessVariables.assetRejectReason;
        this.isReason = true;
        this.isSubmit = true;
        this.showModal = 'rejectModal';
        this.modalMessage = 'Your lead creation will be aborted !';
        this.isRadioDisable = true;
        this.isSelectedLead = false;
        this.isNewLead = true;
        this.isRejectLead = true;
      }
    });
  }

  OnCreateNew() {
    this.isWithLead = true;
    this.showModal = 'proceedModal_without';
    this.modalMessage = 'Are you sure you want to create a new lead ?';
  }

  proceedAsNewLead() {
    const createLead = this.createLeadDataService.getLeadData();
    const data: any = { ...createLead };
    const loanLeadDetails = data.loanLeadDetails;
    const applicantDetails = data.applicantDetails;

    this.createLeadService
      .createLead(loanLeadDetails, applicantDetails, true)
      .subscribe((res: any) => {
        const response = res;
        console.log('proceedAsNewLead', response);
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;
        if (appiyoError === '0' && apiError === '0') {
          const leadId = response.ProcessVariables.leadId;
          this.createLeadService.getLeadById(leadId).subscribe((res: any) => {
            const response = res;
            const appiyoError = response.Error;
            const apiError = response.ProcessVariables.error.code;
            if (appiyoError === '0' && apiError === '0') {
              const proceedAsNewLeadData = response.ProcessVariables;
              const leadId = proceedAsNewLeadData.leadId;
              this.createLeadDataService.setLeadSectionData(
                proceedAsNewLeadData
              );
              this.route.navigateByUrl(`/pages/lead-section/${leadId}`);
            }
          });
        }
      });
  }

  proceedWithSelectedLead(isChangeStatus?:boolean) {
    this.createLeadService.getLeadById(this.leadId,isChangeStatus).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;
      if (appiyoError === '0' && apiError === '0') {
        const proceedWithSelectedLeadData = response.ProcessVariables;
        const leadId = proceedWithSelectedLeadData.leadId;
        this.createLeadDataService.setLeadSectionData(
          proceedWithSelectedLeadData
        );
        this.route.navigateByUrl(`/pages/lead-section/${leadId}`);
      }
    });
  }

  onSelectRejectReason(event) {
    this.rejectReasonCode = event.target.value;
    this.isReasonSelected = true;
  }

  rejectReason() {
    const createLead = this.createLeadDataService.getLeadData();
    const data: any = { ...createLead };
    const loanLeadDetails = data.loanLeadDetails;
    const applicantDetails = data.applicantDetails;

    this.createLeadService
      .createLead(loanLeadDetails, applicantDetails, true, true, Number(this.rejectReasonCode))
      .subscribe((res: any) => {
        const response = res;
        console.log('Reject with reason', response);
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;
        if (appiyoError === '0' && apiError === '0') {
          const leadId = response.ProcessVariables.leadId;
          this.route.navigateByUrl(`/activity-search`);
        }
      });
  }

  navigateToLeadSection() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    const data: any = { ...leadData };
    console.log("get Lead Data",data);
    if (this.showModal === 'proceedModal_without') {   
      if(data.leadDetails.stage == 7) {
        this.leadId = data.leadId;
        return this.proceedWithSelectedLead(true);        
      }else{
        this.proceedAsNewLead();
      }    
    } else if (this.showModal === 'proceedModal_with') {
      this.proceedWithSelectedLead();
    } else if (this.showModal === 'rejectModal') {
      this.rejectReason();
    }
  }

  onLeadSelect(event, index: number) {
    this.selectedLead = event.target.checked;
    if (this.selectedLead) {
      this.leadId = this.dedupeArray[index].leadID;
    } else {
      this.getDedupeData();
    }

    if (this.selectedIndex === index) {
      this.selectedIndex = -1;
      this.isSelectedLead = false;
      this.isNewLead = false;
      this.isRejectLead = false;
    } else {
      this.selectedIndex = index;
      this.isSelectedLead = true;
      this.isNewLead = true;
      this.isRejectLead = true;
    }
  }

  OnItemPerPage(e) {
    this.perPage = e.target.value;
  }

  OnSubmit() {
    this.isModal = true;
  }

  closeModal() {
    this.isModal = false;
  }

  onCancelReject() {
    this.isNewLead = false;
    this.isRejectLead = false;
    this.isReason = false;
    this.isRadioDisable = false;
    this.isReasonSelected = false;
  }
}
