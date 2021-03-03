import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { contains } from 'jquery';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css']
})
export class CustomModalComponent implements OnInit {
  isModalOpen: boolean;
  modal: string;
  @Input() set showModal(value : boolean){
      this.isModalOpen = value;
  }
  @Input() buttons : any;
  @Input() set modalDetails(value : string){
    this.modal = value;
  }


  @Output() onButtonClick = new EventEmitter();
  @Output() onButtonCancel = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onCancel(){
    this.onButtonCancel.emit()
  }

  onYes(item){  
    const isModalClose= item.isModalClose;
    if(isModalClose){
      this.onButtonCancel.emit();
    }else{
      this.onButtonClick.emit();
    }
  }



}
