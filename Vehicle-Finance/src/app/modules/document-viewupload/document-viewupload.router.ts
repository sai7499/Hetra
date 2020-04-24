import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {DocumentViewuploadComponent } from "./document-viewupload.component";
import {ApplicantdocumentComponent } from "./applicantdocument/applicantdocument.component";
import {CollateraldocumentComponent} from "./collateraldocument/collateraldocument.component"



const routes: Routes = [
  {
    path: '',
    component: DocumentViewuploadComponent,
    children: [

      {
        path: "",
        component: ApplicantdocumentComponent
      },
      {
        path: "Applicant-documents",
        component: ApplicantdocumentComponent
      },
      {
        path: "collateral-documents",
        component: CollateraldocumentComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentViewUploadRouterModule {}
