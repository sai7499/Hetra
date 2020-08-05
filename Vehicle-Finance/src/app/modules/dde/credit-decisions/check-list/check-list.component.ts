import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { CommomLovService } from '@services/commom-lov-service';
import { ChecklistService } from '@services/checklist.service';

@Component({
  selector: 'app-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.css'],
})
export class CheckListComponent implements OnInit {
  checkListMaster: any;
  checklistObject: any;
  constructor(
    private commonLovService: CommomLovService,
    private checkList: ChecklistService
  ) {
    // tslint:disable-next-line: deprecation
    $(document).ready(() => {
      $('.collapse')
        .on('shown.bs.collapse', function(event) {
          event.stopPropagation();
          console.log('open');
          $(this)
            .parent()
            .find('.fa-chevron-right')
            .removeClass('fa-chevron-right')
            .addClass('fa-chevron-down')
            .find('.btn_bar')
            .removeClass('btn_bar')
            .addClass('btn_bar_pink');
        })
        .on('hidden.bs.collapse', function(event) {
          console.log('closed');
          event.stopPropagation();
          $(this)
            .parent()
            .find('.fa-chevron-down')
            .removeClass('fa-chevron-down')
            .addClass('fa-chevron-right')
            .find('.btn_bar_pink')
            .removeClass('btn_bar_pink')
            .addClass('btn_bar');
        });
    });
  }

  ngOnInit() {
    this.commonLovService.getLovData().subscribe((res: any) => {
      console.log(res, 'cmn lov service');
      this.checklistObject = res.LOVS;
      this.checkListMaster = res.LOVS.checklistMstView;
      // this.checkListMaster.push(res.LOVS.);
      console.log(this.checkListMaster, 'array of checklist');
    });
    const body = {
      leadId: 1176,
    };
    this.checkList.getCheckListDetails(body).subscribe((res: any) => {
      console.log(res, ' checklist');
    });
  }
}
