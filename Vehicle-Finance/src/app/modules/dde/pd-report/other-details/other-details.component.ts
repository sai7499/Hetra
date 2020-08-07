import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.css']
})
export class OtherDetailsComponent implements OnInit {

  public labels: any = {};
  public errorMsg: any = '';
  public isDirty: boolean;

  constructor() { }

  ngOnInit() {
  }

}
