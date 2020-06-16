import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';
import { CreateLeadService } from '../service/creatLead.service';
import { CreateLeadDataService } from '../service/createLead-data.service';
import { Router } from '@angular/router';

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

  constructor(
    private route: Router,
    private labelsData: LabelsService,
    private leadStoreService: LeadStoreService,
    private createLeadService: CreateLeadService,
    private createLeadDataService: CreateLeadDataService
  ) {}

  ngOnInit() {
    this.getLabels();
    this.getDedupeData();
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

  getDedupeData() {
    const dedupeData = this.leadStoreService.getDedupeData();
    if (!dedupeData) {
      return;
    }
    this.dedupeArray = dedupeData;
    this.status = dedupeData.status;
    this.leadId = dedupeData[0].leadID;
  }

  OnProceed() {
    this.isReason = false;
    this.isSubmit = false;
    this.isWithLead = false;
    this.showModal = 'proceedModal_with';
    this.modalMessage = `Are you sure you want to proceed with lead - ${this.leadId} ?`;
  }

  OnReject() {
    this.isReason = true;
    this.isSubmit = true;
    this.showModal = 'rejectModal';
    this.modalMessage = `Are you sure you want to reject lead - ${this.leadId} ?`;
  }

  OnCreateNew() {
    this.isWithLead = true;
    this.showModal = 'proceedModal_without';
    this.modalMessage = 'Are you sure you want to create a new lead?';
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

  proceedWithSelectedLead() {
    this.createLeadService.getLeadById(this.leadId).subscribe((res: any) => {
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

  navigateToLeadSection() {
    if (this.isWithLead) {
      this.proceedAsNewLead();
    } else {
      this.proceedWithSelectedLead();
    }
  }

  onLeadSelect(index: number) {
    this.selectedLead = !this.selectedLead;
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
}
