import { Component } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

@Component({
    templateUrl: './vehicle-list.component.html',
    styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent {
    public label: any = {};
    leadId: number;

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

    constructor(private labelsData: LabelsService, private createLeadDataService: CreateLeadDataService) { }

    ngOnInit() {
        this.labelsData.getLabelsOfDDEData()
            .subscribe(data => {
                this.label = data.vehicleDetailsTable[0];
            }, error => {
                console.log('error')
            });

        let leadData = this.createLeadDataService.getLeadSectionData();
        this.leadId = leadData['leadId'];
    }
}
