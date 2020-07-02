import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api.service';
import { ScoreCardService } from '../services/score-card.service';

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

    constructor(
        private apiService: ApiService,
        private scoreCardService: ScoreCardService
    ) { }

    ngOnInit() {
        this.getCreditScoreCard();
    }

    getCreditScoreCard() {
        this.scoreCardService.getCreditScoreCard().subscribe((res: any) => {
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
