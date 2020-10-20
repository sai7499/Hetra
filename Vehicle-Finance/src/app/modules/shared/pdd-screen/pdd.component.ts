import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    templateUrl: './pdd.component.html',
    styleUrls: ['./pdd.component.css']
})
export class PddComponent implements OnInit {
    isSales: boolean;
    constructor(private location: Location) {}
    ngOnInit() {
        const currentUrl = this.location.path();
        if (currentUrl.includes('sales')) {
            this.isSales = true;
        }
    }
}
