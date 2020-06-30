import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

@Component({
  selector: 'app-shared-deviation',
  templateUrl: './shared-deviation.component.html',
  styleUrls: ['./shared-deviation.component.css']
})
export class SharedDeviationComponent implements OnInit {

  deviationsForm: FormGroup;
  public labels: any = {};

  constructor(private labelsData: LabelsService, private formBuilder: FormBuilder, private createLeadDataService: CreateLeadDataService) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        console.log(error);
      }
    );

    const leadData = this.createLeadDataService.getLeadSectionData();

    this.deviationsForm = this.formBuilder.group({

    })

  }

  getTrigurePolicy() {
    
  }

}
