import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-rto-declaration-details',
  templateUrl: './rto-declaration-details.component.html',
  styleUrls: ['./rto-declaration-details.component.css']
})
export class RtoDeclarationDetailsComponent implements OnInit {

  public select_main_button_value: string = 'individual';
  public label: any = {};
  public label_rto_declaration: any = {};
  public label_rto_confirmation: any = {};

  public rtoDeclarationForm: FormGroup;
  public rtoConfirmationForm: FormGroup

  constructor(private _fb: FormBuilder, private labelsData: LabelsService) { }

  ngOnInit() {
    this.createForm();
    this.labelsData.getLabelsOfDDEData()
      .subscribe(data => {
        this.label = data[0].rtoDetails[0];
        console.log(this.label, 'data')
        this.label_rto_declaration = this.label.rto_declaration[0];
        this.label_rto_confirmation = this.label.rto_confirmation[0];
      },
        error => {
          console.log(error, 'error')
        });
  }

  select_main_button(event) {
    this.select_main_button_value = event.target.value;
  }

  createForm() {
    this.rtoDeclarationForm = this._fb.group({
      objection_filed_vehicle: [''],
      case_filed_vehicle: [''],
      court_revenue: [''],
      duplicate_rc: [''],
      interstate_vehicle: [''],
      re_registered_vehicle: [''],
      assigned_number: [''],
      fine_vehicle: [''],
      tax_arrears: [''],
      engine_number_match: [''],
      issues_permit_transfer: [''],
      discrepancy: [''],
      tax_valid_upto: [''],
      fitness_valid_upto: [''],
      remarks: ['']
    })

    this.rtoConfirmationForm = this._fb.group({
      rto_agent_name: [''],
      rto_agent_signature: [''],
      date: [{ value: '', disabled: true }],
      borrower_name: [''],
      borrower_signature: [''],
      remark: [''],
      date1: [{ value: '', disabled: true }]
    })
  }

}
