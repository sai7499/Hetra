import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    FormArray } from '@angular/forms';
    import { LabelsService } from "src/app/services/labels.service";

@Component({
    templateUrl: './identity-details.component.html',
    styleUrls: ['./identity-details.component.css']
})
export class IdentityDetailsComponent implements OnInit {
    labels: any = {};

    isIndividual = true;

    identityForm: FormGroup;

    constructor(private labelsData: LabelsService,private fb: FormBuilder) {}

    ngOnInit() {

        this.labelsData.getLabelsData().subscribe(
            data => {
              this.labels = data;
              // console.log(this.labels)
            },
            error => {
              console.log(error);
            }
          );

        // this.identityForm = this.fb.group({
        //     details: this.fb.array([])
        // });
        this.identityForm = new FormGroup({
            details: new FormArray([])
        });
        this.addIndividualFormControls();
    }

    addIndividualFormControls() {
        const controls = new FormGroup({
        //    idDetails: new FormControl(''),
        //    idNumber: new FormControl(null),
        //    expiryDate: new FormControl(null),
        aadharNumber: new FormControl(null),
        panForm: new FormControl(''),
        panNumber: new FormControl(null),
        passportNumber: new FormControl(null),
        passportDate: new FormControl(null),
        passportExpiry: new FormControl(null),
        licenseNumber: new FormControl(null),
        licenseDate: new FormControl(null),
        licenseExpiry: new FormControl(null),
        voterId: new FormControl(null),
        voterDate: new FormControl(null),
        voterExpiry: new FormControl(null)
        });
        (this.identityForm.get('details') as FormArray).push(controls);
    }

    addNonIndividualFormControls() {
        const controls = new FormGroup({
            tin: new FormControl(null),
            pan: new FormControl(null),
            cin: new FormControl(null),
            gst: new FormControl(null)
        });
        (this.identityForm.get('details') as FormArray).push(controls);
    }

    onIndividualChange(event) {
        const value = event.target.value;
        this.isIndividual = value === 'individual';
        const formArray = (this.identityForm.get('details') as FormArray);
        formArray.clear();
        // const length = formArray.length;
        // for (let i = 0; i < length; i++) {
        //     formArray.removeAt(i);
        // }
        // console.log('formArray', formArray);
        this.isIndividual ? this.addIndividualForm() : this.addNonIndividualForm();
    }

    addIndividualForm() {
        this.addIndividualFormControls();
    }

    addNonIndividualForm() {
        this.addNonIndividualFormControls();
    }

    onSave() {
        console.log('form value', this.identityForm.value);
    }
}