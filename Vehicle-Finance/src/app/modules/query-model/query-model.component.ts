import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SearchPipe } from '../../services/search.pipe';
import { Constant } from '@assets/constants/constant';

import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-query-model',
  templateUrl: './query-model.component.html',
  styleUrls: ['./query-model.component.css']
})
export class QueryModelComponent implements OnInit {
  showModal: boolean;
  selectedDocDetails;
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

  constructor(private _fb: FormBuilder,
              private createLeadDataService: CreateLeadDataService,
              private toasterService: ToasterService,
              private activatedRoute: ActivatedRoute ) { }

  ngOnInit() {

    const leadData = this.createLeadDataService.getLeadSectionData();
    this.leadDetails = leadData['leadDetails'];
    this.leadId = leadData['leadId'];

    this.activatedRoute.params.subscribe((value) => {
      this.leadId = value.leadId;
      console.log('leadId', this.leadId);
    });

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

  uploadDocs(index) {
    
 }

  onUploadSuccess(event) {
    this.showModal = false;
    this.toasterService.showSuccess('Document uploaded successfully', '');
    console.log('onUploadSuccess', event);
  }

  chooseFile() {
    this.showModal = true;
    const docNm = 'ACCOUNT_OPENING_FORM';
    const docCtgryCd = 70;
    const docTp = 'LEAD';
    const docSbCtgry = 'ACCOUNT OPENING FORM';
    const docCatg = 'KYC - I';
    const docCmnts = 'Addition of document for Lead Creation';
    const docTypCd = 276;
    const docSbCtgryCd = 204;

    this.selectedDocDetails = {
        docSize: 2097152,
        docsType: Constant.OTHER_DOCUMENTS_ALLOWED_TYPES,
        docNm,
        docCtgryCd,
        docTp,
        docSbCtgry,
        docCatg,
        docCmnts,
        docTypCd,
        docSbCtgryCd,
        docRefId: [
            {
              idTp: 'LEDID',
              id: this.leadId,
            },
            {
              idTp: 'BRNCH',
              id: Number(localStorage.getItem('branchId')),
            },
          ],
    };
  }

}
