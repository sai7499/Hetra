import { Injectable, EventEmitter } from '@angular/core';
import { odApplicantArgs } from './cibil-od.component';

@Injectable({
  providedIn: 'root'
})
export class CibilOdService {
 $isApplicantList = new EventEmitter(); 
 applicantList:odApplicantArgs ={
  applicantType : "",
  cibilScore: "",
  fullName: "",
 };
  constructor() { }

  getOdApplicant(data){
    console.log(data)
    console.log("applicnt")
    for (let i = 0; i < data.length; i++) {
      this.applicantList.applicantType = data[i].applicantType;
    this.applicantList.cibilScore = data[i].cibilScore;
    this.applicantList.fullName=data[i].fullName;
      
    }
    

    this.$isApplicantList.emit(this.applicantList)
  }
}
