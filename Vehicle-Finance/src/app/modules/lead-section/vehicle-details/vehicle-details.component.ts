import { Component, OnInit } from '@angular/core';
import { VehicleDetailService} from  '../services/vehicle-detail.service';

import { LabelsService } from 'src/app/services/labels.service';



@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailComponent implements OnInit {


    public labels = [];
    public errorMsg;
    public getAllFieldLabel;
    
    public vehicleType:any = [ 'Open', 'Tipper', 'Trailer', 'Goods', 'Bus', 'Passenger Vehicle', 'ODC' ];
    public vechicalRegion: any = ['TN', 'AP'];
    public assetMake: any = [ 'Tata Motors', 'Eicher'];
    public assetModel: any = ['Asset-Model-1', 'Asset-Model-2', 'Asset-Model-3'];
    public assetBodyType: any = ['Asset-Model-1', 'Asset-Model-2', 'Asset-Model-3'];
    public assetVariant:any = ['Asset-variant-1', 'Asset-variant-2', 'Asset-variant-3'];
    public assetSubVariant:any = ['Sub Variant 1', 'Sub Variant 2', 'Sub Variant 3'];
    public vechicalUsage:any = ['Yellow Board', 'White Board'];
    public vechicleCategory:any = ['CAT 1', 'CAT 2', 'CAT 3'];
    public orpFunding:any = ['Yes', 'No'];
    public pac:any = ['Yes', 'No'];
    public vas:any = ['Yes', 'No'];
    public emiProtect:any = ['Yes', 'No'];
    public fastTag:any = ['Yes', 'No'];
    public permitType: any = ['National', 'State', 'Others'];
  
    constructor( private vehicleDetailService: VehicleDetailService,private labelsData :LabelsService ) { }
  
    ngOnInit() {
      this.getAllFieldLabel = this.vehicleDetailService.getVehicleDetailLabels()
          .subscribe( data => {
            this.labels = data
          }, 
          error => {
            this.errorMsg = error;
          });      
    }
  
  }
