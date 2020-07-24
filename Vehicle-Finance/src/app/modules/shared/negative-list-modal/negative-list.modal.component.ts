import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-negative-list-modal',
  templateUrl: './negative-list-modal.component.html',
  styleUrls: ['./negative-list.modal.component.css'],
})
export class NegativeListModalComponent {
  @Input() showModal: boolean;
  @Input() modalInput: {
    isNLFound?: boolean;
    isNLTRFound?: boolean;
    nlRemarks?: string;
    nlTrRemarks?: string;
  };

  remarks: string;
  showRemarks: string;

  @Output() onButtonClick = new EventEmitter();

  onClose() {
    this.showModal = false;
  }

  triggerClick(eventName: string) {
    this.onButtonClick.emit({
      name: eventName,
      remarks: this.remarks,
    });
  }
}
