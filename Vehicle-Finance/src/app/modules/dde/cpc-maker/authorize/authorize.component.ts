import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'app-authorize',
    templateUrl: './authorize.component.html',
    styleUrls: ['./authorize.component.css']
  })
  export class AuthorizeComponent implements OnInit {

    applicantDetails: any = [];

    constructor() {}

    ngOnInit() {

      this.applicantDetails = [
        {
          applicantType: "Applicant",
          extMobileNumber: "8220790623",
          newMobileNumber: "",
          oldAddress: "No 3, Mahalakashmi Nagar, Lawshpet, Pondy",
          newAddress: ""
        },
        {
          applicantType: "Co-Applicant",
          extMobileNumber: "9840407473",
          newMobileNumber: "",
          oldAddress: "No 112, Muthu vel nagar 12th street, iyancherry, urapakkam, chennai - 603210",
          newAddress: ""
        },
        {
          applicantType: "Guarantor",
          extMobileNumber: "9941893026",
          newMobileNumber: "",
          oldAddress: "No 27/10, T.V.K Street, Meenambakkam, Chennai - 600027",
          newAddress: ""
        }
      ]

    }
  }