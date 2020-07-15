import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './modules/header/header.component';
import { LovResolverService } from './services/Lov-resolver.service';
import { Authguard } from '@services/authguard';

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
    loadChildren: () =>
      import('./modules/activity-search/activity-search.module').then(
        (m) => m.ActivitySearchModule
      ),
  },
  {
    path: 'pages',
    component: HeaderComponent,
    canActivate: [Authguard],
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
        path: 'pd-dashboard', // added another routing for dde module to load from pd-dashboard
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
          import('./modules/dde/deviation-dashboard/deviation-dashoard.module').then(
            (m) => m.DeviationDashoardModule
          )
      },
      {
        path: 'pd-dashboard',
        loadChildren: () =>
          import('./modules/dde/pd-report/pd-report.module').then(
            (m) => m.PdReportModule
          ),
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
        path: 'fi-list',
        loadChildren: () =>
        import(
          './modules/dde/fi-report/fi-report.module'
          ).then((m) => m.FiReportModule),
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
