import { Component , } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ViabilityServiceService } from '@services/viability-service.service';
import { ToasterService } from '@services/toaster.service';

@Component({
    templateUrl: './viability-list.component.html',
    styleUrls: ['./viability-list.component.css']
})
export class ViabilityListComponent {
    labels: any = {};
    leadId: number;
    viabilityData: any;

    constructor(private labelsData: LabelsService,
                private router: Router,
                private route: ActivatedRoute,
                private viabilityService: ViabilityServiceService,
                private toasterService: ToasterService) { }

    // tslint:disable-next-line: use-lifecycle-interface
   async ngOnInit() {
        this.leadId = (await this.getLeadId()) as number;
        this.labelsData.getLabelsData().subscribe(
            data => {
                this.labels = data;
            },
            error => {
                console.log(error);
            }
        );
        this.getViabilityList();
    }
    getViability() {
         this.router.navigateByUrl(`pages/dde/${this.leadId}/viability-dashboard`);
    }
    getLeadId() {
        return new Promise((resolve, reject) => {
          this.route.parent.params.subscribe((value) => {
            if (value && value.leadId) {
              resolve(Number(value.leadId));
            }
            resolve(null);
          });
        });
      }
    getViabilityList() {
        const body = {
            leadId : this.leadId
        };
        this.viabilityService.getViabilityList(body).subscribe((res: any) => {
       if (res.ProcessVariables.error.code === '0') {
        this.viabilityData = res.ProcessVariables.vehicleViabilityDashboardList;
       } else {
        this.toasterService.showWarning('No Viablity Found', 'Contact Sales');
       }
        });
    }
}
