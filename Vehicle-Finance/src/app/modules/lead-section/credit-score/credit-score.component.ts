import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-credit-score',
  templateUrl: './credit-score.component.html',
  styleUrls: ['./credit-score.component.css']
})
export class CreditScoreComponent implements OnInit {
leadId;
  constructor(private aRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.aRoute.parent.params.
      subscribe((val:any)=> {
                      this.leadId = Number(val.leadId)
                      console.log("leadId",this.leadId);})
        
  }

  navigateUrl(){
    this.router.navigateByUrl(`/pages/terms-condition/${this.leadId}`)
  }

}
