import { Component, OnInit } from '@angular/core';
import { ScoreCardService } from '../services/score-card.service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

@Component({
    templateUrl: './score-card.component.html',
    styleUrls: ['./score-card.component.css']
})
export class ScoreCardComponent implements OnInit {

    borrowerAttributes: any;
    borrowerAssessments: any;
    fieldVerifications: any;
    repaymentAssessments: any;

    scoreCard: any;

    userId: string;
    leadId: number;

    constructor(
        private scoreCardService: ScoreCardService,
        private loginStoreService: LoginStoreService,
        private createLeadDataService: CreateLeadDataService
    ) { }

    ngOnInit() {
        const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
        this.userId = roleAndUserDetails.userDetails.userId;

        const leadData = this.createLeadDataService.getLeadSectionData();
        this.leadId = (leadData as any).leadId;
    }

    reInitiateCreditScore() {
        this.scoreCardService.reInitiateCreditScore(this.leadId, this.userId).subscribe((res: any) => {
            const response = res;
            const appiyoError = response.Error;
            const apiError = response.ProcessVariables.error.code;

            if (appiyoError === '0' && apiError === '0') {
                this.scoreCard = JSON.parse(response.ProcessVariables.resultJson);
                console.log('ScoreCard', this.scoreCard);
                this.borrowerAttributes = this.scoreCard.borrowerAttribute;
                this.borrowerAssessments = this.scoreCard.borrowerAssessment;
                this.fieldVerifications = this.scoreCard.fieldVerification;
                this.repaymentAssessments = this.scoreCard.repaymentAssessment;
            }
        });
    }
}
