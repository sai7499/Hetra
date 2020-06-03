import { Component, OnInit } from '@angular/core';
import { LabelsService } from 'src/app/services/labels.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit {
  isHeight1: boolean = true;
  isHeight2: boolean;
  isHeight3: boolean;
  isHeight4: boolean;

  labels: any = {};

  constructor(private labelsService: LabelsService) {}

  ngOnInit() {
    this.getLabelData();
  }

  getLabelData() {
    this.labelsService.getLabelsData().subscribe((labelsData) => {
      this.labels = labelsData;
    });
  }

  showHide(e) {
    const value = e;
    this.isHeight1 = value === 'photo';
    this.isHeight2 = value === 'signature';
    this.isHeight3 = value === 'ID Proof';
    this.isHeight4 = value === 'Additional Document';
  }
}
