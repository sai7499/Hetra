import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-common-docs-upload',
  templateUrl: './common-docs-upload.component.html',
  styleUrls: ['./common-docs-upload.component.css'],
})
export class CommonDocsUploadComponent implements OnInit {
  toDayDate: Date = new Date();
  documentForm: FormGroup;
  constructor() {}

  ngOnInit() {
    this.documentForm = new FormGroup({
      details: new FormArray([]),
    });
    this.addDocumentFormControls();
  }

  addDocumentFormControls() {
    const formArray = this.documentForm.get('details') as FormArray;
    const controls = new FormGroup({
      documentName: new FormControl(''),
      documentNumber: new FormControl(''),
      issueDate: new FormControl(''),
      expiryDate: new FormControl(''),
    });
    formArray.push(controls);
  }

  onSubmit() {
    console.log('formValue', this.documentForm.value);
  }
}
