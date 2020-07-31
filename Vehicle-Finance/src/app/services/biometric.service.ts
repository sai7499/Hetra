import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { DashboardService } from '@services/dashboard/dashboard.service';
import * as moment from 'moment';



declare var identi5: any;


@Injectable({
    providedIn: 'root'
})

export class BiometricService {
    pid: any;
    constructor(private dashboardService: DashboardService){}


    initIdenti5(aadhar: string, callBack){

        // let dInfo = new device();
        // console.log(dInfo.model);
        var that = this;
        this.pid = "";
    
        identi5.getInfo(function(result){
          console.log("Result&&&&"+ result);
          that.pid = result["model"];
          console.log("base64Data"+ that.pid);
          that.prepareKYCRequest(that.pid, aadhar, callBack);
        },function(error){
          console.log("Result&&&&"+ error);
          alert("error"+error);
        });
      
    }

    prepareKYCRequest(pid, aadharStr, callBack) {
        let stan =  Math.floor(100000 + Math.random() * 900000);
        console.log(stan);
     
        let now = moment().format("MMDDhhmmss");
        let localDate = moment().format("MMDD");
        let localTime = moment().format("hhmmss");
     
     
        let pId = pid;
     
        console.log("pId"+pId);
     
        console.log("now"+now);
        console.log("localDate"+localDate);
     
     
        // let aadhar = "802172334890";
        // let wrongAadhar = "802172334891";
         let kycRequest =  "<KycRequest>"+
                             "<TransactionInfo>"+
                               "<UID type=\"U\">"+aadharStr+"</UID>"+
                               "<Transm_Date_time>"+now+"</Transm_Date_time>"+
                               "<Local_Trans_Time>"+localTime+"</Local_Trans_Time>"+
                               "<Local_date>"+localDate+"</Local_date>"+
                               "<CA_TID>"+"11205764"+"</CA_TID>"+
                               "<CA_ID>"+"EQT000000001441"+"</CA_ID>"+
                               "<CA_TA>"+"Equitas Bank Chennai TNIN"+"</CA_TA>"+
                               "<Stan>"+stan+"</Stan>"+
                             "</TransactionInfo>"+
                             pId+
                           "</KycRequest>";
     
     
         const data = {
           ekycRequest: kycRequest,
         };
         this.dashboardService.getKycDetails(data).subscribe((res: any) => {
           let result = JSON.stringify(res);
           callBack(result);
         });
     
       }
}
