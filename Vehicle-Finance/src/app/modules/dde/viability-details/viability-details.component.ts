import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';

@Component({
  selector: 'app-viability-details',
  templateUrl: './viability-details.component.html',
  styleUrls: ['./viability-details.component.css']
})
export class ViabilityDetailsComponent implements OnInit {

  public label: any = {};
  public vehicle_viability_value: string = 'passanger';

  public viabilityForm: FormGroup;

  constructor(private _fb: FormBuilder, private labelsData: LabelsService) { }

  ngOnInit() {
    this.createForm();

    this.labelsData.getLabelsOfDDEData()
      .subscribe(data => {
        this.label = data[0].viabilityDetails[0];
      },
        error => {
          console.log(error, 'error')
        });
  }

  createForm() {
    this.viabilityForm = this._fb.group({
      vehicle_viability_navigate: ['passanger', Validators.required],
      passanger: this._fb.group({

      })
    })
  }

  vehicle_viability_navigate(event) {
    this.vehicle_viability_value = event.target.value;
  }

}
