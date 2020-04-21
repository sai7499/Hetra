import { Component, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: './dde.component.html',
    styleUrls: [ './dde.component.css']
})
export class DdeComponent {
    constructor(private router: Router) {}
    routerUrl: any = false;
    // tslint:disable-next-line: use-lifecycle-interface
    ngOnInit() {
        // this.routerUrl = this.router.url;
        console.log('router', this.router);
        this.getRouterUrl('lead-details');
    }
 // tslint:disable-next-line:use-lifecycle-interface
 ngOnChanges(changes: SimpleChanges): void {
        // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        // Add '${implements OnChanges}' to the class.
        // if (this.router.url === '/pages/dde/lead-details') {
            this.routerUrl = changes;
            console.log('changes', this.routerUrl);
        // }
            this.getRouterUrl();
    }
    getRouterUrl(e?: any) {
        console.log('event' , e);

        if ( this.router.url === '/pages/dde/lead-details' && e === 'lead-details' ) {
            this.routerUrl = true;
        }
    }
}
