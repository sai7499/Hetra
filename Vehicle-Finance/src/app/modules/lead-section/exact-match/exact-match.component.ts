import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exact-match',
  templateUrl: './exact-match.component.html',
  styleUrls: ['./exact-match.component.css']
})
export class ExactMatchComponent implements OnInit {
   isChecked : boolean;
   isReason: boolean;
   isSubmit: boolean;
   count = 0;
   radioValue = false;
   isDisabled = false;
   radioSel : number= -1;
   preSelectedIndex : number;
   againSelectedIndex : number;


  constructor() { }

  ngOnInit() {
  }

  OnChecked(index) {

    this.radioSel = index;

    if(this.preSelectedIndex !== undefined && this.againSelectedIndex === undefined && this.preSelectedIndex === index){
      this.radioSel = -1;
      this.againSelectedIndex = index;

    } else if(this.preSelectedIndex === this.againSelectedIndex){
      this.againSelectedIndex = undefined;
    }
    this.preSelectedIndex = index;
    console.log(this.radioSel);
    console.log(this.preSelectedIndex);
    // const selected = e.target.value;
    // console.log('selcted value', selected);
    // if (selected) {
    //   this.count++;
    // } else {
    //   this.count--;
    // }
    // this.isChecked = this.count !== 0 ? true : false;
    // console.log(this.isChecked);
    // this.radioValue = !this.radioValue;
    // this.isDisabled = this.radioValue === true ? true : false;
  }

  onSelected() {
    this.isReason = false;
    this.isSubmit = false;
  }

}
