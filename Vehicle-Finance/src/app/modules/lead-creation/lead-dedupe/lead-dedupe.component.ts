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
  // isDisabled: boolean = true;
  count = 0;
  radioValue = false;
  radioSelected: string;
  radioSel: number = -1;
  preSelectedIndex: number;

  p = 1;
  perPage = 5;

  dedupeArray = [];

  constructor( private labelsData: LabelsService, private leadStoreService: LeadStoreService) {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
        console.log('labels', this.labels);
      },
      error => {
        console.log(error);
      });
  }

  ngOnInit() {
    // this.dummy();
    const dedupeData = this.leadStoreService.getDedupeData();
    console.log('dedupeData', dedupeData);
    this.dedupeArray = dedupeData;
  }

  OnProceed() {
    this.isReason = false;
    this.isSubmit = false;
  }

  OnReject() {
    this.isReason = true;
    this.isSubmit = true;
  }

  OnCreateNew() {

  }

  OnChecked(index: number) {
    console.log(this.preSelectedIndex);
    console.log(index);
    this.radioSel = index;
    if ( this.preSelectedIndex !== undefined && this.preSelectedIndex === index) {
      this.radioSel = -1;
    }
    this.preSelectedIndex = index;
    console.log(this.preSelectedIndex);
    console.log(index);
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
