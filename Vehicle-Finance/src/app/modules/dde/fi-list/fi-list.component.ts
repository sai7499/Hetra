import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonalDiscussionService } from '@services/personal-discussion.service';

@Component({
  selector: 'app-fi-list',
  templateUrl: './fi-list.component.html',
  styleUrls: ['./fi-list.component.css']
})
export class FiListComponent implements OnInit {

  labels: any;
  leadId: number;
  fiList: Array<any>;
  constructor(
    private labelDetails: LabelsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private personalDiscussionService: PersonalDiscussionService
    ) { }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  async ngOnInit() {
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    this.leadId = (await this.getLeadId()) as number;
    this.getFiList();
  }

   onClick() {
    
    this.router.navigateByUrl(`pages/fi-list/${this.leadId}/fi-report`);
  }

  getFiList()  {
    
    
    const data = {
      // leadId: 153,
      //  uncomment this once get proper Pd data for perticular
      leadId: this.leadId,
      userId: '1001',
    };
    this.personalDiscussionService.getPdList(data).subscribe((value: any) => {
      const processveriables = value.ProcessVariables;
      this.fiList = processveriables.finalPDList;
      console.log('PD List', this.fiList);

      // for (var i in this.pdList) {
      //   console.log("in for pd list", i)
      //   this.pdStatusValue = this.pdList[i]['pdStatusValue']
      //   console.log("pd status value", this.pdStatusValue)

    // this.leadId = (await this.getLeadId()) as number;
    // this.router.navigateByUrl(`pages/fi-list/${this.leadId}/fi-report`);
  });
}

  onBack() {
    this.router.navigate(['pages/dde/' + this.leadId + '/tvr-details']);

  }

  onNext() {
    this.router.navigate(['pages/dde/' + this.leadId + '/pd-list']);
  }
}
