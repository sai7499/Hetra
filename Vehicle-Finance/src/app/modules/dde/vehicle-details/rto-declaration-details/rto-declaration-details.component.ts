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
  public labelRtoDeclaration: any = {};
  public labelRtoConfirmation: any = {};

  public rtoDetailsForm: FormGroup;

  constructor(private _fb: FormBuilder, private labelsData: LabelsService) { }

  ngOnInit() {
    this.createForm();
    this.labelsData.getLabelsOfDDEData()
      .subscribe(data => {
        this.label = data[0].rtoDetails[0];
        this.labelRtoDeclaration = this.label.rtoDeclaration[0];
        this.labelRtoConfirmation = this.label.rtoConfirmation[0];
      },
        error => {
          console.log(error, 'error')
        });
  }

  select_main_button(event) {
    this.select_main_button_value = event.target.value;
  }

  createForm() {
    this.rtoDetailsForm = this._fb.group({
      rtoDeclaration: this._fb.group({
        objectionFiled: [''],
        caseFiled: [''],
        attachmentbyCourtRevenue: [''],
        duplicateRC: [''],
        interstateVehicle: [''],
        reRegisteredVehicle: [''],
        assignedNumber: [''],
        fineVehicle: [''],
        taxArrears: [''],
        engineNumChassisnumbermatch: [''],
        issueinpermitTransfer: [''],
        anyOtherIssueDiscrepancy: [''],
        taxValid: [''],
        fitnessValid: [''],
        remarks: ['']
      }),
      rtoConfirmation: this._fb.group({
        rtoAgentName: [''],
        rtoAgentSignature: [''],
        date: [{ value: '', disabled: true }],
        borrowerName: [''],
        borrowerSignature: [''],
        remark: [''],
        date1: [{ value: '', disabled: true }]
      })
    })
  }

}
