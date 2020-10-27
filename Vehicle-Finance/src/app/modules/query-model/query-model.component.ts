import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-query-model',
  templateUrl: './query-model.component.html',
  styleUrls: ['./query-model.component.css']
})
export class QueryModelComponent implements OnInit {

  queryModalForm: FormGroup;
  chatList: any = [
    {
      "lead": "Lead 1234",
      "description": "Lead 1234 - UCV Giribabu - 500000 - Credit Decision"
    },
    {
      "lead": "Lead 1234",
      "description": "Lead 1234 - UCV Giribabu - 500000 - Credit Decision"
    },
    {
      "lead": "Lead 1234",
      "description": "Lead 1234 - UCV Giribabu - 500000 - Credit Decision"
    },
    {
      "lead": "Lead 1234",
      "description": "Lead 1234 - UCV Giribabu - 500000 - Credit Decision"
    }
  ]

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.queryModalForm = this._fb.group({
      
    })
  }

}
