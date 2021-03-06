import { Component, OnInit } from '@angular/core';
import { ScoreCardService } from '../services/score-card.service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { LabelsService } from 'src/app/services/labels.service';

import { LoanViewService } from '@services/loan-view.service';
import { ToasterService } from '@services/toaster.service';

@Component({
    templateUrl: './score-card.component.html',
    styleUrls: ['./score-card.component.css']
})
export class ScoreCardComponent implements OnInit {

    labels: any = {};
    borrowerAttributes: any;
    borrowerAttributesLength: number;
    borrowerAssessments: any;
    borrowerAssessmentsLength: number;
    fieldVerifications: any;
    fieldVerificationsLength: number;
    repaymentAssessments: any;

    productCategoryFromLead: string;

    scoreCard: any;
    userId: string;
    leadId: number;
    disableSaveBtn: boolean;
    riskLevel: number;
    risk: string;
    showError: boolean;
    errorMessage: string;

    result = [];
    udfScreenId: any;

    constructor(
        private labelsData: LabelsService,
        private scoreCardService: ScoreCardService,
        private loginStoreService: LoginStoreService,
        private createLeadDataService: CreateLeadDataService,
        private toggleDdeService: ToggleDdeService,
        private loanViewService: LoanViewService,
        private toasterService: ToasterService
    ) { }


    ngOnInit() {
        const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
        this.userId = roleAndUserDetails.userDetails.userId;

        const leadData = this.createLeadDataService.getLeadSectionData();
        this.leadId = (leadData as any).leadId;
        const productCategory = (leadData as any).leadDetails.productCatCode;
        this.productCategoryFromLead = productCategory;

        this.reInitiateCreditScore();
        const operationType = this.toggleDdeService.getOperationType();
        if (operationType) {
            this.disableSaveBtn = true;
        }

        if (this.loanViewService.checkIsLoan360()) {
            this.disableSaveBtn = true;
        }



        this.labelsData.getLabelsData().subscribe(
            (data) => {
                this.labels = data;
            },
            (error) => {
                console.log(error);
            }
        );
        this.labelsData.getScreenId().subscribe((data) => {
            let udfScreenId = data.ScreenIDS;
      
            this.udfScreenId = udfScreenId.DDE.scoreCardDDE ;
      
          })

    }

    reInitiateCreditScore() {
        this.result = [];
        this.scoreCardService.reInitiateCreditScore(this.leadId, this.userId).subscribe((res: any) => {
            const response = res;
            const appiyoError = response.Error;
            const apiError = response.ProcessVariables.error.code;
            const errorMessage = response.ProcessVariables.error.message;
            this.errorMessage = errorMessage;

            if (appiyoError === '0' && apiError === '0') {
                this.scoreCard = JSON.parse(response.ProcessVariables.scoreCard);
                console.log('ScoreCard', this.scoreCard);
                // this.riskLevel = this.scoreCard.totalScore;
                // this.borrowerAttributes = this.scoreCard.borrowerAttribute;
                // this.borrowerAssessments = this.scoreCard.borrowerAssessment;
                // this.fieldVerifications = this.scoreCard.fieldVerification;
                // this.repaymentAssessments = this.scoreCard.repaymentAssessment;

                // this.borrowerAttributesLength = this.borrowerAttributes.length + 1;
                // this.borrowerAssessmentsLength = this.borrowerAttributes.length +
                //     this.borrowerAssessments.length + 1;
                // this.fieldVerificationsLength = this.borrowerAttributes.length +
                //     this.borrowerAssessments.length +
                //     this.fieldVerifications.length + 1;


                this.scoreCard = JSON.parse(response.ProcessVariables.scoreCard);
                this.riskLevel = this.scoreCard.totalScore;
            } else {
                this.toasterService.showError(
                    `${errorMessage}`,
                    'Score Card'
                );
                this.showError = true;
            }
            this.insertRow(this.scoreCard);
            this.levelOfRisk(this.riskLevel);
        });

    }

    insertRow(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object') {
                    if (!Array.isArray(obj[key])) {
                        this.result.push(obj[key]);
                    }
                    this.insertRow(obj[key]);
                }
            }
        }
    }

    levelOfRisk(riskLevel: number) {
        if (riskLevel <= 50) {
            this.risk = 'Highest Risk';
        } else if (riskLevel > 50 && riskLevel <= 60) {
            this.risk = 'Very High Risk';
        } else if (riskLevel > 60 && riskLevel <= 70) {
            this.risk = 'High Risk';
        } else if (riskLevel > 70 && riskLevel <= 75) {
            this.risk = 'Medium Risk';
        } else if (riskLevel > 75 && riskLevel <= 85) {
            this.risk = 'Low Risk';
        } else if (riskLevel > 85) {
            this.risk = 'Very Low Risk ';
        }
    }
}