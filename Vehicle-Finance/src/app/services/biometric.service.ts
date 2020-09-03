import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { DashboardService } from '@services/dashboard/dashboard.service';
import * as moment from 'moment';
import { ApplicantService } from '@services/applicant.service';
import { ToasterService } from '@services/toaster.service';
import { truncateSync } from 'fs';




declare var identi5: any;


@Injectable({
    providedIn: 'root'
})

export class BiometricService {
    pid: any;
    constructor(private dashboardService: DashboardService,
      private applicantService: ApplicantService,
      private toasterService: ToasterService,
    ){}


    initIdenti5(refAadhar: string, applicantId, callBack){
      var that = this;
      this.pid = "";


      //refAadhar = "100006010634";  
      this.applicantService.retreiveAdhar(refAadhar).subscribe((res: any) => {
        let result = res;
        console.log("result aadhar",result);
        let processVariables =  result.ProcessVariables;
        if(processVariables.error.code = "0"){
          console.log("Aadhar number", processVariables.uid);
          let aadhar = processVariables.uid
          identi5.getInfo(function(result){
            console.log("Result&&&&"+ result);
            if(result["error"]){
              let result = JSON.stringify({"pidErr": true});
              callBack(result);
              return;
            }
            that.pid = result["model"];
            console.log("base64Data"+ that.pid);
            that.prepareKYCRequest(that.pid, aadhar, applicantId, callBack);
          },function(error){
            console.log("Result&&&&"+ error);
            alert("error"+error);
          });
        }else{
          this.toasterService.showError(res['ProcessVariables'].error.messge, '')
        }
      });
      
    }

    prepareKYCRequest(pid, aadharStr, applicantId, callBack) {
        let stan =  Math.floor(100000 + Math.random() * 900000);
        console.log(stan);
     
        let now = moment().format("MMDDhhmmss");
        let localDate = moment().format("MMDD");
        let localTime = moment().format("hhmmss");
     
     
        let pId = pid;
        if(!pId){
          let result = JSON.stringify({"pidErr": true});
          callBack(result);
          return;
        }
     
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
         this.applicantService.wrapperBiometriceKYC(data, applicantId).subscribe((res: any) => {
          let result = JSON.stringify(res);
          console.log("wrapperBiometriceKYC", result);
          callBack(result);
         });
     
       }
}
