import { Component, OnInit,Input,Output,EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-reject-reason-modal',
  templateUrl: './reject-reason-modal.component.html',
  styleUrls: ['./reject-reason-modal.component.css']
})
export class RejectReasonModalComponent implements OnInit,OnChanges {

  @Input() data: {
    okayLabel: string,
    cancelLabel: string,
    title: string,
    content: string,
    cancelBtn: boolean
}
@Input() modalId: string;
@Output() okay = new EventEmitter();
@Output() cancel = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    
  }

onOkay() {
    this.okay.emit();
}
onCancel() {
  this.cancel.emit();
}

}
