import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';

@Component({
  selector: 'app-collateraldocument',
  templateUrl: './collateraldocument.component.html',
  styleUrls: ['./collateraldocument.component.css']
})
export class CollateraldocumentComponent implements OnInit {

  values: any = [];
  public labels: any = {};
  collateralDocumentForm: FormGroup;
  vehicleName: any;

  constructor(
    private lovData: LovDataService,
    private router: Router,
    private labelsData: LabelsService,
    private fb: FormBuilder) { 
      this.collateralDocumentForm  = fb.group({
        documents : fb.array([])
      })
    }

  ngOnInit() {
    this.initForm();
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].collateralDocument[0];
      //console.log(this.values)
    });
  }
  initForm() {
 
    this.collateralDocumentForm = new FormGroup ({
      documentName : new FormControl (''),
      documentNumber : new FormControl(''),
      issueDate : new FormControl(''),
      documentExpiryDate : new FormControl(''),
      mandatoryStage : new FormControl({value: 'Sales', disabled: true}),
      deferralDate : new FormControl({value:'',disabled:true}),
      uploadDocument : new FormControl (''),
      status : new FormControl ('')
    })

    this.labelsData.getLabelsData().subscribe(
      data => {

        this.labels = data;
         //console.log(this.labels)
      },
      error => {
        console.log(error);
      });
  }

  selectChangeHandler(event : any) {
      this.vehicleName = event.target.value;
      console.log(this.vehicleName);
  }

  onFormSubmit(){
    this.router.navigate(['/pages/lead-section']);
    console.log(this.vehicleName, this.collateralDocumentForm.value);
  }

  addNewAddressGroup(){
    const add =this.collateralDocumentForm.get('documents') as FormArray;
    add.push(this.fb.group({
      documentName: [],
      documentNumber: [],
      issueDate: [],
      documentExpiryDate: [],
      mandatoryStage: [],
      deferralDate: [],
      uploadDocument:[],
      status:[]
    }))
  }
  }


