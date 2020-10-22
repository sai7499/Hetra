import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-page-redirect-modal',
  templateUrl: './page-redirect-modal.component.html',
  styleUrls: ['./page-redirect-modal.component.css']
})
export class PageRedirectModalComponent implements OnInit {

  @Output() okay = new EventEmitter();
  @Input() showPageRedirectModal: boolean;

  constructor() { }

  ngOnInit() {
  }

  onOkay() {

    this.okay.emit()

  }

}
