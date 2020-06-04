import { Component } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    templateUrl: './vehicle-list.component.html',
    styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent {
    public labels: any = {};

    public colleteralArray = [
        {
            colleteralType: 'Colleteral Type-1',
            column2: '',
            column3: ''
        },
        {
            colleteralType: 'Colleteral Type-2',
            column2: '',
            column3: ''
        }
    ]

    constructor(private labelsData: LabelsService, private _fb: FormBuilder) { }

    ngOnInit() {
        this.labelsData.getLabelsOfDDEData()
            .subscribe(data => {
                this.labels = data.vehicleDetailsTable[0];
            }, error => {
                console.log('error')
            });
    }
}
