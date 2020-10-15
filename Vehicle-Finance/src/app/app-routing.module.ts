import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './modules/header/header.component';
import { LovResolverService } from './services/Lov-resolver.service';
import { Authguard } from '@services/authguard';
import { LeadDataResolverService } from '@modules/lead-section/services/leadDataResolver.service';
import {TermSheetFromDashboardComponent} from './modules/dde/credit-decisions/term-sheet-from-dashboard/term-sheet-from-dashboard.component'
import {DetectBrowserActivityService} from '@services/detect-browser-activity.service'
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
    canActivate: [Authguard,DetectBrowserActivityService],
    loadChildren: () =>
      import('./modules/activity-search/activity-search.module').then(
        (m) => m.ActivitySearchModule
      ),
  },
  {
    path: 'pages',
    component: HeaderComponent,
    canActivate: [Authguard,DetectBrowserActivityService],
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
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'lead-section',
        loadChildren: () =>
          import('./modules/lead-section/lead-section.module').then(
            (m) => m.LeadSectionModule
          ),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'document-viewupload',
        loadChildren: () =>
          import(
            './modules/document-viewupload/document-viewupload.module'
          ).then((m) => m.DocumentViewuploadModule),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'terms-condition',
        loadChildren: () =>
          import('./modules/terms-conditions/terms-conditions.module').then(
            (m) => m.TermsConditionsModule
          ),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'terms-condition',
        loadChildren: () =>
          import('./modules/terms-conditions/terms-conditions.module').then(
            (m) => m.TermsConditionsModule
          ),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'dde',
        loadChildren: () =>
          import('./modules/dde/dde.module').then((m) => m.DdeModule),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'fi-cum-pd-dashboard', // added another routing for dde module to load from pd-dashboard
        loadChildren: () =>
          import('./modules/dde/dde.module').then((m) => m.DdeModule),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'vehicle-details',
        loadChildren: () =>
          import('./modules/dde/vehicle-details/vehicle-details.module').then(
            (m) => m.VehicleDetailsModule
          ),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'deviation-dashboard',
        loadChildren: () =>
          import(
            './modules/dde/deviation-dashboard/deviation-dashoard.module'
          ).then((m) => m.DeviationDashoardModule),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'fi-cum-pd-dashboard',
        loadChildren: () =>
          import('./modules/dde/fi-cum-pd-report/fi-cum-pd-report.module').then(
            (m) => m.FiCumPdReportModule
          ),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'pd-dashboard',
        loadChildren: () =>
          import('./modules/dde/pd-report/pd-report.module').then(
            (m) => m.PdReportModule
          ),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'pd-dashboard', // added another routing for dde module to load from pd-dashboard
        loadChildren: () =>
          import('./modules/dde/dde.module').then((m) => m.DdeModule),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'credit-decisions',
        loadChildren: () =>
          import('./modules/dde/credit-decisions/credit-decisions.module').then(
            (m) => m.CreditConditionModule
          ),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'applicant-details',
        loadChildren: () =>
          import(
            './modules/dde/applicant-details/applicant-details.module'
          ).then((m) => m.ApplicantDetailsModule),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'tvr-details',
        loadChildren: () =>
          import(
            './modules/dde/tele-verificarion-form/tele-verificarion-form.module'
          ).then((m) => m.TeleVerificarionFormModule),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'fi-dashboard',
        loadChildren: () =>
          import('./modules/dde/fi-report/fi-report.module').then(
            (m) => m.FiReportModule
          ),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'fi-dashboard', // added another routing for dde module to load from pd-dashboard
        loadChildren: () =>
          import('./modules/dde/dde.module').then((m) => m.DdeModule),
          canActivate: [DetectBrowserActivityService]
      },

      {
        path: 'vehicle-valuation',
        loadChildren: () =>
          import(
            './modules/dde/vehicle-valuation-router/vehicle-valuation-router.module'
          ).then((m) => m.VehicleValuationRouterModule),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./modules/sales/sales.module').then((m) => m.SalesModule),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'sales-applicant-details',
        loadChildren: () =>
          import(
            './modules/sales/applicant-details/applicant-details.module'
          ).then((m) => m.ApplicantDetailsModule),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'viability-list',
        loadChildren: () =>
          import(
            './modules/dde/viability-dashboard/viability-dashboard.module'
          ).then((m) => m.ViabilityDashboardModule),
          canActivate: [DetectBrowserActivityService]
      },
 //supervisorRelated starts
      {
        path: 'supervisor',
        loadChildren: () =>
          import('./modules/supervisor/supervisor.module').then(
            (m) => m.SupervisorModule
          ),
          canActivate: [DetectBrowserActivityService]
      },
      {
              path: 'negotiation',
              loadChildren: () =>
                import(
                  './modules/negotiation/negotiation.module'
                ).then((m) => m.NegotiationModule),
                canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'cpc-maker',
        loadChildren: () =>
          import(
            './modules/dde/cpc-maker/cpc-maker.module'
          ).then((m) => m.CpcMakerModule),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'loanbooking',
        loadChildren: () =>
          import(
            './modules/dde/loan-status/loan-booking.module'
          ).then((m) => m.LoanBookingModule),
          canActivate: [DetectBrowserActivityService]
      },
      {
        path: 'cpc-checker',
        loadChildren: () =>
          import(
            './modules/dde/cpc-maker/cpc-maker.module'
          ).then((m) => m.CpcMakerModule),
          canActivate: [DetectBrowserActivityService]
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
          canActivate: [DetectBrowserActivityService]
        },
        {
          path: 'pre-disbursement',
          loadChildren: () =>
            import('./modules/dde/pre-disbursement/pre-disbursement.module').then(
              (m) => m.PreDisbursementModule
            ),
            canActivate: [DetectBrowserActivityService]
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
