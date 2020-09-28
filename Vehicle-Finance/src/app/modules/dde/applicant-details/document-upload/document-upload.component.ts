import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';
import { LovDataService } from 'src/app/services/lov-data.service';


@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css']
})
export class DocumentUploadComponent implements OnInit {

  isHeight1: boolean = true;
  isHeight2: boolean;
  isHeight3: boolean;
  isHeight4: boolean;

  labels: any = {};
  values: any = [];

  constructor(
    private labelsService: LabelsService,
    private lovDataService: LovDataService
  ) { }

  ngOnInit() {
    this.getLabelData();
    this.lovDataService.getLovData().subscribe((res: any) => {
      this.values = res[0].documentUpload[0]
    })
  }

  getLabelData() {
    this.labelsService.getLabelsData().subscribe(labelsData => {
      this.labels = labelsData.default;
    })
  }

  showHide(e) {
    const value = e;
    this.isHeight1 = (value == 'photo') ? true : false
    this.isHeight2 = (value == 'signature') ? true : false
    this.isHeight3 = (value == 'ID Proof') ? true : false
    this.isHeight4 = (value == 'Additional Document') ? true : false

  }
}


