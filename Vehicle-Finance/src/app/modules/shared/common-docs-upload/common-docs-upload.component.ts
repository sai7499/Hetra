import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  ControlValueAccessor,
} from '@angular/forms';

@Component({
  selector: 'app-common-docs-upload',
  templateUrl: './common-docs-upload.component.html',
  styleUrls: ['./common-docs-upload.component.css'],
})
export class CommonDocsUploadComponent implements OnInit, ControlValueAccessor {
  toDayDate: Date = new Date();
  documentForm: FormGroup;
  showModal: boolean;
  private propagateChange = (event) => {};

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

  removeDocumentFormControls(index: number) {
    const formArray = this.documentForm.get('details') as FormArray;
    if (formArray.length === 1) {
      return;
    }
    formArray.removeAt(index);
  }

  onSubmit() {
    console.log('formValue', this.documentForm.status);
  }

  writeValue(value) {
    console.log('write value', value);
  }
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn) {}
}
