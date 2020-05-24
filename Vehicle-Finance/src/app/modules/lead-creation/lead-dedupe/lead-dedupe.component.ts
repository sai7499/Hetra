import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';


@Component({
  selector: 'app-lead-dedupe',
  templateUrl: './lead-dedupe.component.html',
  styleUrls: ['./lead-dedupe.component.css']
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

  constructor(
    private labelsData: LabelsService,
    private leadStoreService: LeadStoreService
  ) { }

  ngOnInit() {
    this.getLabels();
    this.getDedupeData();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(data => {
      this.labels = data;
      console.log('labels', this.labels);
    },
      error => console.log(error));
  }

  getDedupeData() {
    const dedupeData = this.leadStoreService.getDedupeData();
    if (!dedupeData) {
      return;
    }
    console.log('dedupeData', dedupeData);
    this.dedupeArray = dedupeData;
    this.leadId = dedupeData[0].leadID;
  }

  OnProceed() {
    this.isReason = false;
    this.isSubmit = false;
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
    this.showModal = 'proceedModal_without';
    this.modalMessage = 'Are you sure you want to create a new lead?';
  }

  onLeadSelect(index: number) {
    this.selectedLead = !this.selectedLead;
  }

  OnItemPerPage(e) {
    this.perPage = e.target.value;
    console.log(this.perPage);
  }

  OnSubmit() {
    this.isModal = true;
  }

  closeModal() {
    this.isModal = false;
  }
}
