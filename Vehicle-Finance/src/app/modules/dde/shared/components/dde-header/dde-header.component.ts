import { Component ,OnInit} from '@angular/core';
import { LabelsService } from "src/app/services/labels.service";

@Component({
    selector: 'app-dde-header',
    templateUrl: './dde-header.component.html',
    styleUrls: ['./dde-header.component.css']
})
export class DdeHeaderComponent  implements OnInit{
    labels: any = {};
 
  
    constructor( private labelsData: LabelsService) {}
  
    ngOnInit() {
      this.labelsData.getLabelsData().subscribe(
        data => {
          this.labels = data;
          // console.log(this.labels)
        },
        error => {
          console.log(error);
        }
      );
    }
}
