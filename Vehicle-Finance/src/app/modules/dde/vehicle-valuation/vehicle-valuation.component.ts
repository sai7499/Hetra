import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';

// import { LabelsService } from "@services/labels.service";
// import { LovDataService } from '@services/lov-data.service';
// import { DdeStoreService } from '@services/dde-store.service';
// import { VehicleValuationService } from '../services/vehicle-valuation.service';
// import { CommomLovService } from '@services/commom-lov-service';
// import { ToasterService } from '@services/toaster.service';

@Component({
  selector: "app-vehicle-valuation",
  templateUrl: "./vehicle-valuation.component.html",
  styleUrls: ["./vehicle-valuation.component.css"]
})
export class VehicleValuationComponent implements OnInit {

  leadId;
  labels: any = {};
  LOV: any = [];

  isModal: boolean;
  isOk: boolean;
  isYes: boolean;

  constructor(
    // private labelsData: LabelsService,
    // private commomLovService: CommomLovService,
    // private vehicleValuationService: VehicleValuationService,
    // private lovDataService: LovDataService,
    private router: Router,
    // private aRoute: ActivatedRoute,
    // private toasterService: ToasterService,
    // private location: Location,
    // private ddeStoreService: DdeStoreService
    ) { }

  ngOnInit() {
    // this.getLabels();
    // this.getLOV();
    // this.getLeadId();
  }

  // getLabels() {
  //   this.labelsData.getLabelsData().subscribe(
  //     (data) => (this.labels = data),
  //     (error) => console.log("PSL_DATA Label Error", error)
  //   );
  // }

  // getLeadId() {
  //   this.aRoute.parent.params.subscribe((val) => {
  //     this.leadId = Number(val.leadId);
  //   });
  //   console.log("LEADID--->", this.leadId);
  // }

  // getLOV() {
  //   this.commomLovService.getLovData().subscribe((lov) => {
  //     this.LOV = lov;
  //   });
  //   console.log("PSL DATA LOV  --->", this.LOV);
  // }

  onChange() {
    this.router.navigateByUrl('pages/dde/valuation');
  }

  OnSubmit() {
    this.isModal = true;
  }

  closeModal() {
    this.isModal = false
  }

  okModal() {
    this.isOk = true;
  }

  yesModal() {
    this.isYes = true;
  }

  onFormSubmit() {
    this.router.navigate(['/pages/dde/tvr']);
  }

}
