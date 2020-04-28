import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
    templateUrl: './basic-details.component.html',
    styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {
    basicForm: FormGroup;
    isIndividual = true;
    isSelfEmployed = true;

    designation = [{
        key: 1,
        value: 'Salaried',
      },
      {
        key: 2,
        value: 'Self Employed'
      }
    ];

    ngOnInit() {
        this.basicForm = new FormGroup({
            details: new FormArray([])
        });
        this.addIndividualFormControls();
    }

    addIndividualFormControls() {
        const formArray = (this.basicForm.get('details') as FormArray);
        const controls = new FormGroup({
            name: new FormControl(null),
            mobileNumber: new FormControl(null),
            dob: new FormControl(null),
            applicantType: new FormControl(null),
            seniorCitizen: new FormControl(''),
            guardianName: new FormControl(null),
            ucic: new FormControl(null),
            fatherName: new FormControl(null),
            spouseName: new FormControl(null),
            maidenName: new FormControl(null),
            occupation: new FormControl(''),
            nationality: new FormControl(''),
            customerCategory: new FormControl(''),
            emailId: new FormControl(''),
            altrEmailId: new FormControl(''),
            language: new FormControl(''),
            accountNumber: new FormControl(null),
            accountBank: new FormControl(''),
            branchAddress: new FormControl(null),
            spokeAddress: new FormControl(null),
            designation: new FormControl(''),
            officeName: new FormControl(null),
            years: new FormControl(null),
            employeeCode: new FormControl(null),
            employeeType: new FormControl(''),
            department: new FormControl(''),
            businessType: new FormControl(''),
            businessName: new FormControl(null),
            businessStartDate: new FormControl(null),
            currentBusinessYear: new FormControl(null),
            turnOver: new FormControl(null)
        });
        formArray.push(controls);
        setTimeout(() => {
            this.addOrRemoveSelfEmployedFormControls(false);
        });
    }

    addNonIndividualFormControls() {
        const formArray = (this.basicForm.get('details') as FormArray);
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
            accountNumber: new FormControl(null),
            accountBank: new FormControl(''),
            branchAddress: new FormControl(null),
            spokeAddress: new FormControl(null),
            directorName: new FormControl(null),
            din: new FormControl(null),
            contactPerson: new FormControl(null),
            contactDesignation: new FormControl(''),
            contactMobileNumber: new FormControl(null),
            issuerName: new FormControl(null),
            ratingAssigned: new FormControl(null),
            ratingIssuedDate: new FormControl(null),
            ratingExpiryDate: new FormControl(null),
            foreignCurrency: new FormControl(null),
            totalExposure: new FormControl(null),
            creditScore: new FormControl(null),
        });
        formArray.push(controls);
    }

    onDesignationChange(event) {
        const value = event.target.value;
        // const formArray = (this.basicForm.get('details') as FormArray);
        // const controls = formArray.at(0) as FormGroup;
        // controls.removeControl('department');
        // console.log('formArray', formArray);
        // if (value === '1') {


        // }
        this.addOrRemoveSelfEmployedFormControls(value === '2');
    }

    addOrRemoveSelfEmployedFormControls(isAdd: boolean) {
        const formArray = (this.basicForm.get('details') as FormArray);
        const controls = formArray.at(0) as FormGroup;

        if (isAdd) {
            this.isSelfEmployed = true;
            controls.addControl('businessType', new FormControl(''));
            controls.addControl('businessName', new FormControl(null));
            controls.addControl('businessStartDate', new FormControl(null));
            controls.addControl('currentBusinessYear', new FormControl(null));
            controls.addControl('turnOver', new FormControl(null));
        } else {
            this.isSelfEmployed = false;
            controls.removeControl('businessType');
            controls.removeControl('businessName');
            controls.removeControl('businessStartDate');
            controls.removeControl('currentBusinessYear');
            controls.removeControl('turnOver');
        }

    }

    onIndividualChange(event) {
        const value = event.target.value;
        this.isIndividual = value === 'individual';
        const formArray = (this.basicForm.get('details') as FormArray);
        formArray.clear();
        this.isIndividual ? this.addIndividualFormControls() : this.addNonIndividualFormControls();
    }

    onSave() {
        console.log('form value', this.basicForm.value);
    }

}
