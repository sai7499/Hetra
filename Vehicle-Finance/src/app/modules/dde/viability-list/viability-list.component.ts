import { Component } from '@angular/core';
import { LabelsService } from '@services/labels.service';

@Component({
    templateUrl: './viability-list.component.html',
    styleUrls: ['./viability-list.component.css']
})
export class ViabilityListComponent {
    labels: any = {};

    constructor(private labelsData: LabelsService) { }

    ngOnInit() {
        this.labelsData.getLabelsOfDDEData().subscribe(
            data => {
                this.labels = data[0].viabilityListTable[0];
            },
            error => {
                console.log(error);
            }
        );
    }
}