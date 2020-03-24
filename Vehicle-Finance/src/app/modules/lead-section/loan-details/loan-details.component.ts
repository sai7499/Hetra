import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {

  @ViewChild('LosModal', {static: true}) LosModal: ElementRef;


  constructor(private renderer: Renderer2, private router: Router) { }

  ngOnInit() {
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
