import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-query-model',
  templateUrl: './query-model.component.html',
  styleUrls: ['./query-model.component.css']
})
export class QueryModelComponent implements OnInit {

  queryModalForm: FormGroup;
  chatList: any = []

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.queryModalForm = this._fb.group({
      
    })
  }

}
