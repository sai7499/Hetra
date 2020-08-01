import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { LoginService } from '@modules/login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { TaskDashboard } from '@services/task-dashboard/task-dashboard.service';
import { ToasterService } from '@services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from '@services/dashboard/dashboard.service';

@Component({
  selector: 'app-viability-checks',
  templateUrl: './viability-checks.component.html',
  styleUrls: ['./viability-checks.component.css']
})
export class ViabilityChecksComponent implements OnInit {

  itemsPerPage = '25';
  labels: any = {};
  roleId: string;
  branchId: any;
  newArray: any;
  limit: any;
  count: any;
  pageNumber: any;
  currentPage: any;
  totalItems: any;
  userId: any;
  roles: any;
  roleName: any;
  roleType: any;
  leadId: any;
  isLoadLead = true;
  filterDetails: any;

  constructor(
    private labelsData: LabelsService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
    private taskDashboard: TaskDashboard,
    private toasterService: ToasterService,
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) {
    if (window.screen.width > 768) {
      this.itemsPerPage = '25';
    } else if (window.screen.width <= 768) {
      this.itemsPerPage = '5';
    }
  }

 async  ngOnInit() {
    this.leadId = (await this.getLeadId()) as number;
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    this.roles = roleAndUserDetails.roles;
    this.roleId = this.roles[0].roleId;
    this.roleName = this.roles[0].name;
    this.roleType = this.roles[0].roleType;
    console.log('this user roleType', this.roleType);

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
  //   this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
  //     this.roleId = String(value.roleId);
  //     this.branchId = value.branchId;
  //   });
  //   this.getViabilityDashboard(this.itemsPerPage);
  // }

    this.dashboardService.isFilterData.subscribe((filterValue: any) => {
    console.log('filterDetails', filterValue);
    this.filterDetails = filterValue;
    // this.getMyLeads(value);
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = String(value.roleId);
      this.branchId = value.branchId;
      this.roleType = value.roleType;
    });
    this.getViabilityDashboard(filterValue);
  });

    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
    this.roleId = String(value.roleId);
    this.branchId = value.branchId;
    this.roleType = value.roleType;
  });
    this.getViabilityDashboard(this.itemsPerPage);

}

onClick() {
  this.getViabilityDashboard(this.itemsPerPage);
}

getViabilityDashboard(filterValue, pageNumber?) {
  const data = {
    taskName: 'Vehicle Viability',
    branchId: this.branchId,
    roleId: this.roleId,
    // tslint:disable-next-line: radix
    currentPage: parseInt(pageNumber),
    // tslint:disable-next-line: radix
    perPage: parseInt(this.itemsPerPage),
    myLeads: true,
    leadId: filterValue.leadId ? filterValue.leadId : '',
    fromDate: filterValue.fromDate ? filterValue.fromDate : '',
    toDate: filterValue.toDate ? filterValue.toDate : '',
    product: filterValue.product ? filterValue.product : '',
    loanMinAmt: filterValue.loanMinAmt ? filterValue.loanMinAmt : '',
    loanMaxAmt: filterValue.loanMaxAmt ? filterValue.loanMaxAmt : ''
  };
  this.responseForCredit(data);
}

responseForCredit(data) {
  this.taskDashboard.taskDashboard(data).subscribe((res: any) => {
    this.setPageData(res);
    if (res.ProcessVariables.loanLead != null) {
      this.isLoadLead = true;
    } else {
      this.isLoadLead = false;
  }
  });
}

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.route.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }


// getViabilityDashboard(perPageCount, pageNumber?) {
//     const data = {
//       taskName: 'Vehicle Viability',
//       branchId: this.branchId,
//       roleId: this.roleId,
//       // tslint:disable-next-line: radix
//       currentPage: parseInt(pageNumber),
//       // tslint:disable-next-line: radix
//       perPage: parseInt(perPageCount),
//       myLeads: true,
//     };
//     this.taskDashboard.taskDashboard(data).subscribe((res: any) => {
//       this.setPageData(res);
//       if (res.ProcessVariables.loanLead != null) {
//         this.isLoadLead = true;
//       } else {
//         this.isLoadLead = false;
//     }
//     });
//   }

  setPageData(res) {
    const response = res.ProcessVariables.loanLead;
    this.newArray = response;
    this.limit = res.ProcessVariables.perPage;
    this.pageNumber = res.ProcessVariables.from;
    this.count = Number(res.ProcessVariables.totalPages) * Number(res.ProcessVariables.perPage);
    this.currentPage = res.ProcessVariables.currentPage;
    this.totalItems = res.ProcessVariables.totalPages;
  }

  setPage(event) {
    this.getViabilityDashboard(this.filterDetails, event);
  }
  routeToViabilityList(leadId: any) {
  this.router.navigate([`/pages/viability-list/${leadId}/viability-list`]);
  }

  onRelase(id) {
    this.taskDashboard.releaseTask(id).subscribe((res: any) => {
      console.log('release Task', res);
      const response = res;
      // tslint:disable-next-line: triple-equals
      if (response.ErrorCode == 0 ) {
        this.toasterService.showSuccess('Lead Released Successfully', 'Released');
      } else {
        this.toasterService.showError(response.Error, '');
      }
    });
  }

}
