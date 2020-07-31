import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantList } from '@model/applicant.model';
import { LeadStoreService } from '../../sales/services/lead.store.service';
import { ApplicantImageService } from '@services/applicant-image.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.css'],
})
export class ApplicantListComponent implements OnInit {
  labels: any = {};
  showAddApplicant: boolean;
  applicantUrl: string;
  applicantList: ApplicantList[] = [];
  p = 1;
  index: number;
  selectedApplicantId: number;
  leadId: number;
  imageUrl: any;
  showModal = false;

  constructor(
    private labelsData: LabelsService,
    private location: Location,
    private applicantService: ApplicantService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicantImageService: ApplicantImageService,
    private domSanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    const currentUrl = this.location.path();

    this.isShowAddaApplicant(currentUrl);

    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
      (error) => {
        console.log(error);
      }
    );

    // this.activatedRoute.parent.params.subscribe((value) => {
    //   console.log('parent params', value);
    // });

    this.leadId = (await this.getLeadId()) as number;
    if (currentUrl.includes('sales')) {
      this.applicantUrl = `/pages/sales-applicant-details/${this.leadId}/basic-details`;
    } else {
      this.applicantUrl = `/pages/applicant-details/${this.leadId}/basic-data`;
    }
    this.getApplicantList();
  }

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

  navigateAddapplicant() {
    this.router.navigateByUrl(`/pages/sales-applicant-details/${this.leadId}/add-applicant`);
  }


  navigatePage(applicantId: string) {
    console.log(
      'applicantId',
      applicantId,
      `${this.applicantUrl}/${applicantId}`
    );
    this.router.navigate([`${this.applicantUrl}/${applicantId}`]);
  }

  getApplicantList() {
    const data = {
      leadId: this.leadId,
    };

    this.applicantService.getApplicantList(data).subscribe((value: any) => {
      const processVariables = value.ProcessVariables;
      this.applicantList = processVariables.applicantListForLead;
      console.log('getapplicants', this.applicantList);
    });
  }

  isShowAddaApplicant(currentUrl: string) {
    this.showAddApplicant = !currentUrl.includes('dde');
  }
  onApplicantClick(item) {}

  softDeleteApplicant(index: number, applicantId: number) {
    const findIndex = this.p === 1 ? index : (this.p - 1) * 5 + index;
    this.index = findIndex;
    this.selectedApplicantId = applicantId;

    // const data = {
    //   applicantId,
    // };
    // this.applicantService.softDeleteApplicant(data).subscribe((res) => {
    //   console.log('res', applicantId);
    //   this.applicantList.splice(findIndex, 1);
    // });
  }

  callDeleteApplicant() {
    const data = {
      applicantId: this.selectedApplicantId,
    };
    this.applicantService.softDeleteApplicant(data).subscribe((res) => {
      console.log('res', this.selectedApplicantId);
      this.applicantList.splice(this.index, 1);
    });
  }

  getApplicantImage(applicantID: any) {
   const body = {
     applicantId: 1721
   };
   this.applicantImageService.getApplicantImageDetails(body).subscribe((res: any) => {
     console.log(res);
     const imageUrl = res.ProcessVariables.response;
     console.log(imageUrl);
     this.imageUrl = imageUrl;
   
     // tslint:disable-next-line: max-line-length
    //  this.imageUrl = atob('DQogICAgICAgICAgLyogQ1NTIERvY3VtZW50ICovDQogICAgICAgICAgYm9keS5NYWluQm9keSB7bWFyZ2luOjBweDsgcGFkZGluZzowcHg7IHRleHQtYWxpZ246Y2VudGVyO30NCiAgICAgICAgICAubWFpbmNvbnRhaW5lciB7bWFyZ2luOjBweCBhdXRvO3dpZHRoOjgyN3B4OyBib3JkZXI6MHB4IHNvbGlkICNjOWM5Yzk7IGNvbG9yOiMwMDAwMDA7IGZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7IGZvbnQtc2l6ZTogMTFweDt9DQoNCiAgICAgICAgICAvKiBIZWFkYWVyICovDQoNCg0KICAgICAgICAgIC5oZWFkZXJsb2dvMXsNCiAgICAgICAgICB3aWR0aDozMDBweDsNCiAgICAgICAgICBoZWlnaHQ6NjVweDsNCiAgICAgICAgICBiYWNrZ3JvdW5kOnVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVN3QUFBQkJDQVlBQUFCcllKbEZBQUFBQVhOU1IwSUIyY2tzZndBQUczaEpSRUZVZUp6dFhRbWNIVVdaTDQ1RlFFVlJGZzlRVjBReExHNlFHMVpZTGxGQjVIQlpUcEZUQVRrVVVJNndaSUhsMkVXUWNDVWhNNW5YM1RNNWh2c0twNHdJaGlNejg3cjd6VXdPanBDUWdCSWtFQTJRUUJpLy8xZXYrMVZWOTd0bTVyM0ptNm4vNzFlL1NWNTNWMVZYZC8zN3E2KytRd2dMaTVHR2xtQTM0WVZYQ05lZkl4ei9YZUVHL1ZweC9MZUZGendrblBBOE1XM3VGNGU3dXhZV0ZxTU5NMmR2UkVSME9CSFNJL1QzTFNLcjk0UVRmRUQvL2lpRnNQRGJhaVl6SndCNVRXV1NzN0N3c0tnNXByL3dKZUdHMDRpQTNpQWllaStWcEVvVkovZzcvVjFJZjY4U3pkMy9QTnkzWTJGaE1WS1J5ZTFEQkRXWHlDWmw2UWNKSzNpWi92MEVsWW4wN3lhU3BwNmw4eGVuU2wyT3Y0SWtzMW1pTGZ6bWNOK1doWVhGU01Lc0JSOGo4am1GU0dZZWxROE5BZ3BFSnJoWXVEMzdNdm00L2xlRjEvY0YwZFQxUmVGMmJTMmMzQmlTeUE0Vlh0aEVKUFlYNDlxVlZGOFgxYjNOY04raWhZWEZTRUJILy9xaXRlZFVJcUlYaVdEV0tGTFNQQ0thTTBRTGtkU3Q0YVppZk1mNlJldVlBTUtiOHdYUjFyTUxYWGNsRWRkS1JUTDdVQkpoK0I5MXZDc0xDNHNSaC9IajF5VlMybytJcFR1V3JQaHYrQ1JKVEFlUlJMVXBuYlZPeGZXMTk2L0hPNFZ1Y0FLVnJMRk1mRnhNRGI1VnU1dXhzTEFZMmNoa3R5QUo2Q0VpazFVS3Vjd2dvdHBSdEhSc09PQjYzZGMvVGhMVmdTUzF6V1lKaSt2RlRxTi9zMmgvNlZORGVBY1dGaGFqQms1dUhCSEppZ0paK1U5UzJZNGxwY0ZpOHRLTnFmNGZFbUV0VU9wZlRCTGRmNHJ4L2VzT1FlOHRMQ3hHRFVCTTJnNmYzeVhjM0I1RDJnYmJjd1hINUUwZHNDeGNRK1ZSMFJ4dU5hVHRXRmhZakhDNGdhZm9sLzVNNVNSTnNwcmN1VEZKUTNzS04zc28vZjNSZ1BWUDNvSk5xSTNMRkNYOE8xUitLbzVvSDd3VVoyRmhNUXJRMHJNOUVkVGY4bVFGQy9iSm9xMXpNKzBjTDlpQmlPVXVWcDQ3L25QMDcwTUczdDV6bjgvYmIwVjZzaWVZRUMwc0xDekt3dlV2VXBhQ2kwUW1lNWpvNzlkM0F6UCs4WGxyOTM0bU54RFlvTm9NVHl5UUpDMFJZYVJxWVdGaFVSWnU4SEJNV0hCYzlvSXR0ZU10Q3pkazF4cjRDTXJ6K2dZdEVVRnZwVXBaVHRBNnFQb3NMQ3hHQ1J3L3NwRmFUY1J4VTJKWGNIcnVTL1Q3M1lvVWRzdWcyN3h1OWtaVTF3WFU5dnV4M3N4N2RwTkIxMnRoWVRIQ29STldrNWhnRUljVDdrN252S0JJWWZzTlRidmgvdXdZSFV0WjF2cmR3c0tpSE56Z0tVVUIzcGVYZkk0a1NlckhYQnovQ2kzMkZmd01vMk90WFY5aEMzZ280ZVZ2QjRzbStpMUcvenJDN2RrNlB0LzE5NDBQT2Y0M2hCcytwdFI3OFREY3ZZV0ZSVVBCOGE5SkR3bERVcFVzcnhsdU5TL2tKYTQ1d3UzK0xoSFM5NGw0d3Z6dkhjTEw3UjNYM2RHeFB2My9IT1dhNXZnWTlHQWM2Y0hQK3l6Njl3N0QzVnRZV0RRVXBGbERiMVZ4cmlSeFpVVW11d3Y5KzdleE80K0RFRE5kWStLNnBhN3FMdVc2cTdXMjNlQ1NRdmdhdjYvZXQyNWhZZEdJeUFSSEUybmNUK1JCVXBELzE1U3dNbW5CK2U0UUxkbC9vWFBod3JNbUg0bGhwcmFEaU5BelVLaEgvb051K0YydFhaZzN1RUZrTHJHWTZ2dDB2Vy9kd3NLaUVjRzZwdkJzSXBiZkVmbk1KQUxCenVCY2hhQmVvL0lBLzQ2U0NYOHV2TG5iMExINStlTUlpL3cvZXAxRVVJWHJYeEJUdTcrdUg4OGRUTWNXNVFucmRYWVJzckN3c0JnUVhIK0tJbFUxSjB3UFhQK29PRkNmUTVJWkNFaUZGOTZzTENHbkpjSWt1LzczNDUxQ1MxZ1dGaFlEQmdMeEZjamtBOUVhbktvRjdtdHZYMDk0d2JXeExSV0MvclgwZkw1dy9heVAwYkdYUkJ4UzJUOVB0UGRzb0xWaENjdkN3bUpJMEJwOFM1R09saWJzcEZ4L2N5S2kreFNEMG50TFhBK0g2aDhtMnNCdmNBZUtsNXk1TVlsekxDd3NMR0lnSHRYTkhaL2c4TWdxRUVXaG9IL3E0UERJMnZGd0p5S2JUc1h3ODZ4Q25lUFhGVzcyQW9Xd25oRXQyZTBUYlh2aGNiRlMzdkdYMkZ5R0ZoWVc2Y0R5ckxYM0syeko3dVpPWmtOT0ZZNS9vYUsvY2tYemdxVCtLVnJ5U2NOUG1Wd0NvV0xhZXIrdUIrc0xaaVN1bDIyY0t6UHE4RG56YTNlekZoWVdqUTFrdkhIOTlrSkk1UEJFN2JoSFpGSWduSWVKMU1heTJRRXMyNXZtZnBLejQ3akJrZ0poOWUzQXgzam4wRy9UUWkwN3dYUXhMZnljVUdQQ2c5amM0RWJsbk4vWGVRUXNMQ3dhQmxONlBrTkVjV2VjSE5VTGJtVlhtZ2p3R1l5czBLRlk1M2p2d1FTU3lKcEV4aitmSTVLNmZxQXMrK2JSMzBsRmpGRGZwTjh2WlNrTVVoMklEMUVoM1BBZVJRZDJ3ekNPaG9XRnhWb1BOM3NqN3dCS0NTZkhFVUVqNE4vSjNJTDVkUFQrZzJJcVIzR0EwbjFOQ2tGRkNWUS9LR0o0ZW9uSUJIdFJQYXFkMThDREFscFlXSXdDZUt4WVh4YnY1Q0VwaEFySFAwc2FoQ29wNmlVUkVkSDR1OUxmbjhobG9iOUdKelNPbmJXRTQydTVrTTYwNjFjTEw3Y3pTV3FuRlV3aTZQeDdhSmxwWVdGaFVSVFkrWXRDeDdBN2pqK0Y3YThpU0FmbFM2Z3Mxd21McERFbzNRSEhQNjNnZmhPNTRBUVBpeG56eDNKNk1OU3BSM3U0bThNa2UycU1yZUNCNFJvQ0N3dUxSb0p1elo0VkxaMjdKYzZCemdtT3pvakUwRm9rQVFXT29jQy8wQVFzM0tIend2RzdGMzVhdFBVaHhsWWhJelFTdFZwWVdGaVVCZHRUcWZvbC8vL0Z6VDJmcUdtYmVoS0tMTFg1OFpxMloyRmhNVUxRenVZRmhTQitUdkN5YU92NVRzM2FjLzNUUlNFK1BKYUl2OVpjZmdZS0xHVWQvenR4VVplMkZoWEE4WmNQU1hIOURMdEJXT2h3T3IrY1Q2MnVqRmR3VmNYWFo3SVhHR1A5UjdaTnFoWHVXN3F4YU0zOWhGMVluR0FjaDE1Wld6QjkvaGdpanhWNUhkVWFObGVvaGRWNUp2aUJwczl5dzZjU0Z2VFZBTmw3UEhybURoSy9Cc3M1RTA5VTVQKzdhTGw1YWRubjZ2aXZWRDRmZy9zTDEzSGJsVjczSEYvcjRkbm5qV3pUKzNKYWRSd1JIc2pYUVVyRk82d2Z2N0R5d1N3WFQ2amk0dC9PU2tvTEhkQ1Y2T0Y5K3prMFNxVncvZkg2Tmp5V0psMWIxNnkvWHZqZkF0RTdPV0NkL3lhVks5ZWFmSHlRY0JDSXJ6QWVKQUg1ajRuMklWd2F5cVZudDlMR2NwcTQ1NGhaQTVDRXBzOUZIQzVFZ2tCazFIYzBpVTB2cStuNDIzSlhNM2UrYUhvNmZTZFNFa3FsYzdJanZnN3ZXNlhYWVhkVWJrZ3NadzhCaE9JeG8xY0FHUnFUYXZnaE1nY0JZZkh5V2pubUdlRitTc0lTVm0z');
     this.imageUrl = atob(this.imageUrl);
    //  this.imageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + imageUrl);
     this.imageUrl = this.domSanitizer.bypassSecurityTrustHtml(this.imageUrl);
     if (this.imageUrl) { this.showModal = true;
                          console.log(this.imageUrl); }
   });
  }
}
