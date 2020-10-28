import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SearchPipe } from '../../services/search.pipe';

@Component({
  selector: 'app-query-model',
  templateUrl: './query-model.component.html',
  styleUrls: ['./query-model.component.css']
})
export class QueryModelComponent implements OnInit {

  queryModalForm: FormGroup;
  queryModelLov: any = {};
  leadDetails: any;
  leadId: number = 0;
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
  ];

  chatMessages: any = [
    {
      "fromName": "E1923 - Dhanapal Nataraj",
      "role": "[ Sales Officer ]",
      "query": "Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis.",
      "docId": "Aadhar Card.pdf",
      "taggedTo": "E1850 - Dinesh Subramaniyam"
    }
  ];

  constructor(private _fb: FormBuilder, private createLeadDataService: CreateLeadDataService) { }

  ngOnInit() {

    const leadData = this.createLeadDataService.getLeadSectionData();
    this.leadDetails = leadData['leadDetails'];
    this.leadId = leadData['leadId'];

    this.queryModalForm = this._fb.group({
      queryType: [''],
      query: [''],
      tagQuery: [''],
      queryFrom: [''],
      queryTo: [''],
      docId: [''],
      leadId: [this.leadId, Validators.required]
    })

    this.queryModelLov.tagQuery = [
      {
        key: "0",
        value: "E1923 - Dhanapal Nataraj"
      },
      {
        key: "1",
        value: "E1850 - Dinesh Subramaniyam"
      }
    ];
    this.queryModelLov.queryType = [
      {
        key: "0",
        value: "Clarification"
      },
      {
        key: "1",
        value: "Require more data"
      },
      {
        key: "2",
        value: "Require more document"
      },
      {
        key: "3",
        value: "Require approval"
      }
    ];
  }

  onClickLeadId(lead) {
    console.log('lead', lead)
  }

  onSearchType(event) {
    console.log(event.target.value, 'event')
  }

  onFormSubmit(form) {

    console.log('fs', form)

  }

}
