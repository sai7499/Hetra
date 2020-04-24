import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';


@Component({
  selector: 'app-applicantdocument',
  templateUrl: './applicantdocument.component.html',
  styleUrls: ['./applicantdocument.component.css']
})
export class ApplicantdocumentComponent implements OnInit {

  values: any = [];
  public labels: any = {};
  aaplicantDocumentForm: FormGroup;

  constructor(
    private lovData: LovDataService,
    private router: Router,
    private labelsData: LabelsService
  ) { }

  ngOnInit() {
    this.initform();
    this.lovData.getLovData().subscribe((res : any) => {
    this.values = res[0].applicantDocument[0];
    console.log(this.values);
    })
    
  }
  initform() {

    this.aaplicantDocumentForm = new FormGroup  ({
      documentName : new FormControl (''),
      documentNumber : new FormControl(''),
      issueDate : new FormControl(''),
      documentExpiryDate : new FormControl(''),
      mandatoryStage : new FormControl(''),
      deferralDate : new FormControl(''),
      uploadDocument : new FormControl (''),
      status : new FormControl ('') 
    })

    this.labelsData.getLabelsData().subscribe(
      data => {

        this.labels = data;
         console.log(this.labels)
      },
      error => {
        console.log(error);
      });
  }

  onFormSubmit(){
    this.router.navigate(['/pages/document-viewupload/collateral-documents']);
    console.log('Applicant Documents', this.aaplicantDocumentForm.value);
  }

}
