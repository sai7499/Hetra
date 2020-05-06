import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './dde.component.html',
    styleUrls: ['./dde.component.css']
})
export class DdeComponent implements OnInit {
    constructor(public router: Router) { }

    ngOnInit() {

    }

    hasRoute(route: string) {
        return this.router.url.includes(route);
    }
}
