import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesComponent } from './sales.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { ApplicantListComponent } from '@shared/applicant-list/applicant-list.component';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { AddvehicleComponent } from './addvehicle/addvehicle.component';
import { DetectBrowserActivityService } from '@services/detect-browser-activity.service'

const routes: Routes = [
  {
    path: ':leadId',
    component: SalesComponent,
    resolve: {
      leadData:LeadDataResolverService,
    },
    canActivate: [DetectBrowserActivityService],
    children: [
      {
        path: 'lead-details',
        component: LeadDetailsComponent,
        canActivate: [DetectBrowserActivityService],
      },
      {
        path: 'applicant-list',
        component: ApplicantListComponent,
        canActivate: [DetectBrowserActivityService],
      },
      {
        path: 'vehicle-list',
        component: VehicleDetailsComponent,
        canActivate: [DetectBrowserActivityService],
      },
      {
        path: 'document-upload',
        component: DocumentUploadComponent,
        canActivate: [DetectBrowserActivityService],
      },
      {
        path: 'add-vehicle',
        component: AddvehicleComponent,
        canActivate: [DetectBrowserActivityService],
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
