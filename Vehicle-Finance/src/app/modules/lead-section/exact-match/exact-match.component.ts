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


  constructor() { }

  ngOnInit() {
  }

  OnChecked(e){
    const selected= e.target.value
    if(selected){
      this.count++;
    }
    else{
      this.count--;
    }
    this.isChecked = this.count !=0 ? true : false;
    console.log(this.isChecked);
  }
  
  

  onSelected(){
    this.isReason = false;
    this.isSubmit = false;
  }

}
