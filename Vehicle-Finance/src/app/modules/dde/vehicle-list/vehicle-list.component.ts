import { Component } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    templateUrl: './vehicle-list.component.html',
    styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent {
    public labels: any = {};

    public vehicleListArray = [
        {
            registrationNum: 'TN-04-SS-0292',
            make: 'TATA',
            model: 'SUMO'
        },
        {
            registrationNum: 'KL-05-AG-1191',
            make: 'TATA',
            model: 'SUMO'
        }
    ];

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
        this.labelsData.getLabelsOfDDEData().subscribe(
            data => {
                console.log(data, 'data')
                this.labels = data.vehicleDetailsTable[0];
            },
            error => {
                console.log(error);
            }
        );
    }

    removeOtherIndex(i, vehicleArray: any) {
        if (vehicleArray.length > 1) {
            console.log(i, 'i', vehicleArray.indexOf(i))
            // control.removeAt(i);
            vehicleArray.splice(i, 1)
          } else {
            alert("Atleast One Row Required");
          }
    }
}
