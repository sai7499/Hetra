import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesComponent } from './sales.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { ApplicantListComponent } from '@shared/applicant-list/applicant-list.component';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { AddvehicleComponent } from './addvehicle/addvehicle.component';

const routes: Routes = [
  {
    path: ':leadId',
    component: SalesComponent,
    resolve: {
      leadData:LeadDataResolverService,
    },
    children: [
      {
        path: 'lead-details',
        component: LeadDetailsComponent,
      },
      {
        path: 'applicant-list',
        component: ApplicantListComponent,
      },
      {
        path: 'vehicle-list',
        component: VehicleDetailsComponent,
      },
      {
        path: 'document-upload',
        component: DocumentUploadComponent,
      },
      {
        path: 'add-vehicle',
        component: AddvehicleComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
