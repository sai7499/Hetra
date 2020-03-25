import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

import { LeadSectionService } from 'src/app/services/lead-section.service';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {
  public label:any = [];
  public errorMsg;
  public lov = [];

  @ViewChild('LosModal', {static: true}) LosModal: ElementRef;

  constructor(private renderer: Renderer2, 
              private router: Router, 
              private leadSectionService: LeadSectionService) { }

 ngOnInit() {
    this.getLabel();
    this.getLov();
  }

  public getLabel() {
    this.leadSectionService.getLabels().subscribe(
      data => {
        this.label = data;
      },
      error => {
        this.errorMsg = error;
      }
    );
  }

  public getLov() {
    this.leadSectionService.getLovs().subscribe(
      lovData => {
        // Assign the JSONlov to local variables
        this.lov = lovData[0].loanDetails[0];
      },
      error => {
        this.errorMsg = error;
      }
    );
  }

  openLOSPopup(myModal) {
    this.renderer.addClass(myModal, 'fadeIn');
  }

  closeLosPopup(myModal) {
    console.log(myModal)
    this.renderer.removeClass(myModal, 'fadeIn');
  }

  onNavigateTerms() {
    // /pages/terms-conditions
    this.router.navigate(['/'])
  }

}
