import { Component } from '@angular/core';
import { LabelsService } from '@services/labels.service';

@Component({
    templateUrl: './vehicle-list.component.html',
    styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent {
    public labels: any = {};

    constructor(private labelsData: LabelsService) { }

    ngOnInit() {
        this.labelsData.getLabelsOfDDEData().subscribe(
            data => {
                this.labels = data[0].vehicleDetailsTable[0];
            },
            error => {
                console.log(error);
            }
        );
    }
}
