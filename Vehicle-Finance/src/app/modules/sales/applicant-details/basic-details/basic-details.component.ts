import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { LabelsService } from '@services/labels.service';

@Component({
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit {
  basicForm: FormGroup;
  isIndividual = true;
  isSelfEmployed = true;
  labels: any = {};

  designation = [
    {
      key: 1,
      value: 'Salaried',
    },
    {
      key: 2,
      value: 'Self Employed',
    },
  ];
  constructor(private labelsData: LabelsService) {}

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        // console.log(this.labels)
      },
      (error) => {
        console.log(error);
      }
    );

    this.basicForm = new FormGroup({
      details: new FormArray([]),
    });
    this.addIndividualFormControls();
  }

  addIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      name: new FormControl(null),
      mobileNumber: new FormControl(null),
      dob: new FormControl(null),
      applicantType: new FormControl(null),
      guardianName: new FormControl(null),
      fatherName: new FormControl(null),
      spouseName: new FormControl(null),
      maidenName: new FormControl(null),
      occupation: new FormControl(''),
      nationality: new FormControl(''),
      customerCategory: new FormControl(''),
      emailId: new FormControl(''),
      altrEmailId: new FormControl(''),
      language: new FormControl(''),
    });
    formArray.push(controls);
  }

  addNonIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      occupation: new FormControl(''),
      customerCategory: new FormControl(null),
      emailId: new FormControl(null),
      altrEmailId: new FormControl(null),
      language: new FormControl(''),
      company1: new FormControl(null),
      company2: new FormControl(null),
      company3: new FormControl(null),
      incorporationDate: new FormControl(null),
      numberOfDirection: new FormControl(null),
    });
    formArray.push(controls);
  }

  onIndividualChange(event) {
    const value = event.target.value;
    this.isIndividual = value === 'individual';
    const formArray = this.basicForm.get('details') as FormArray;
    formArray.clear();
    this.isIndividual
      ? this.addIndividualFormControls()
      : this.addNonIndividualFormControls();
  }

  onSave() {
    console.log('form value', this.basicForm.value);
  }
}
