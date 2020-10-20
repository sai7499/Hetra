import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './modules/header/header.component';
import { LovResolverService } from './services/Lov-resolver.service';
import { Authguard } from '@services/authguard';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import {TermSheetFromDashboardComponent} from './modules/dde/credit-decisions/term-sheet-from-dashboard/term-sheet-from-dashboard.component'
import {DetectBrowserActivityService} from '@services/detect-browser-activity.service'
import { PddComponent } from '@modules/shared/pdd-screen/pdd.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'activity-search',
    canActivate: [Authguard],
    canActivateChild: [DetectBrowserActivityService],
    loadChildren: () =>
      import('./modules/activity-search/activity-search.module').then(
        (m) => m.ActivitySearchModule
      ),
  },
  {
    path: 'pages',
    component: HeaderComponent,
    canActivate: [Authguard],
    canActivateChild: [DetectBrowserActivityService],
    resolve: {
      getLOV: LovResolverService,
    },
    children: [
      {
        path: 'lead-creation',
        loadChildren: () =>
          import('./modules/lead-creation/lead-creation.module').then(
            (m) => m.LeadCreationModule
          ),
      },
      {
        path: 'lead-section',
        loadChildren: () =>
          import('./modules/lead-section/lead-section.module').then(
            (m) => m.LeadSectionModule
          ),
      },
      {
        path: 'document-viewupload',
        loadChildren: () =>
          import(
            './modules/document-viewupload/document-viewupload.module'
          ).then((m) => m.DocumentViewuploadModule),
      },
      {
        path: 'terms-condition',
        loadChildren: () =>
          import('./modules/terms-conditions/terms-conditions.module').then(
            (m) => m.TermsConditionsModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        // canDeactivate: [can]
        
      },
      {
        path: 'terms-condition',
        loadChildren: () =>
          import('./modules/terms-conditions/terms-conditions.module').then(
            (m) => m.TermsConditionsModule
          ),
      },
      {
        path: 'dde',
        loadChildren: () =>
          import('./modules/dde/dde.module').then((m) => m.DdeModule),
      },
      {
        path: 'fi-cum-pd-dashboard', // added another routing for dde module to load from pd-dashboard
        loadChildren: () =>
          import('./modules/dde/dde.module').then((m) => m.DdeModule),
      },
      {
        path: 'vehicle-details',
        loadChildren: () =>
          import('./modules/dde/vehicle-details/vehicle-details.module').then(
            (m) => m.VehicleDetailsModule
          ),
      },
      {
        path: 'deviation-dashboard',
        loadChildren: () =>
          import(
            './modules/dde/deviation-dashboard/deviation-dashoard.module'
          ).then((m) => m.DeviationDashoardModule),
      },
      {
        path: 'fi-cum-pd-dashboard',
        loadChildren: () =>
          import('./modules/dde/fi-cum-pd-report/fi-cum-pd-report.module').then(
            (m) => m.FiCumPdReportModule
          ),
      },
      {
        path: 'pd-dashboard',
        loadChildren: () =>
          import('./modules/dde/pd-report/pd-report.module').then(
            (m) => m.PdReportModule
          ),
      },
      {
        path: 'pd-dashboard', // added another routing for dde module to load from pd-dashboard
        loadChildren: () =>
          import('./modules/dde/dde.module').then((m) => m.DdeModule),
      },
      {
        path: 'credit-decisions',
        loadChildren: () =>
          import('./modules/dde/credit-decisions/credit-decisions.module').then(
            (m) => m.CreditConditionModule
          ),
      },
      {
        path: 'applicant-details',
        loadChildren: () =>
          import(
            './modules/dde/applicant-details/applicant-details.module'
          ).then((m) => m.ApplicantDetailsModule),
      },
      {
        path: 'tvr-details',
        loadChildren: () =>
          import(
            './modules/dde/tele-verificarion-form/tele-verificarion-form.module'
          ).then((m) => m.TeleVerificarionFormModule),
      },
      {
        path: 'fi-dashboard',
        loadChildren: () =>
          import('./modules/dde/fi-report/fi-report.module').then(
            (m) => m.FiReportModule
          ),
      },
      {
        path: 'fi-dashboard', // added another routing for dde module to load from pd-dashboard
        loadChildren: () =>
          import('./modules/dde/dde.module').then((m) => m.DdeModule),
      },

      {
        path: 'vehicle-valuation',
        loadChildren: () =>
          import(
            './modules/dde/vehicle-valuation-router/vehicle-valuation-router.module'
          ).then((m) => m.VehicleValuationRouterModule),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./modules/sales/sales.module').then((m) => m.SalesModule),
      },
      {
        path: 'sales-applicant-details',
        loadChildren: () =>
          import(
            './modules/sales/applicant-details/applicant-details.module'
          ).then((m) => m.ApplicantDetailsModule),
      },
      {
        path: 'viability-list',
        loadChildren: () =>
          import(
            './modules/dde/viability-dashboard/viability-dashboard.module'
          ).then((m) => m.ViabilityDashboardModule),
      },
 //supervisorRelated starts
      {
        path: 'supervisor',
        loadChildren: () =>
          import('./modules/supervisor/supervisor.module').then(
            (m) => m.SupervisorModule
          ),
      },
      {
              path: 'negotiation',
              loadChildren: () =>
                import(
                  './modules/negotiation/negotiation.module'
                ).then((m) => m.NegotiationModule),
    
      },
      {
        path: 'cpc-maker',
        loadChildren: () =>
          import(
            './modules/dde/cpc-maker/cpc-maker.module'
          ).then((m) => m.CpcMakerModule),
      },
      {
        path: 'loanbooking',
        loadChildren: () =>
          import(
            './modules/dde/loan-status/loan-booking.module'
          ).then((m) => m.LoanBookingModule),
      },
      {
        path: 'cpc-checker',
        loadChildren: () =>
          import(
            './modules/dde/cpc-maker/cpc-maker.module'
          ).then((m) => m.CpcMakerModule),
      },
      // {
      //   path: ':leadId/new-term-sheet',
      //   component : TermSheetFromDashboardComponent
      // },
      {
        path: 'disbursement-section',
        loadChildren: () =>
          import('./modules/disbursement-section/disbursement-section.module').then(
            (m) => m.DisbursementSectionModule
          ),
        },
        {
          path: 'pre-disbursement',
          loadChildren: () =>
            import('./modules/dde/pre-disbursement/pre-disbursement.module').then(
              (m) => m.PreDisbursementModule
            ),

        },
        {
          path: 'pdd',
          component: PddComponent
        },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
