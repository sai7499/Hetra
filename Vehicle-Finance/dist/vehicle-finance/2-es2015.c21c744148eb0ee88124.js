(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{"5pZN":function(e,t,n){"use strict";n.d(t,"a",function(){return r});var i=n("8Y7J"),a=n("IheW");const r=(()=>{class e{constructor(e){this.http=e,this.labelsurl="assets/labels/labels.json",this.labelDDEsurl="assets/labels/label_credit_vehicle_details.json",this.labelFleetUrl="assets/labels/labelFleetDetails.json",this.languageLabelsurl="assets/labels/labels-hindi.json"}getLabelsData(){return this.http.get(this.labelsurl)}getLabelsOfDDEData(){return this.http.get(this.labelDDEsurl)}getLabelsFleetData(){return this.http.get(this.labelFleetUrl)}getLanguageLabelData(){return this.http.get(this.languageLabelsurl)}}return e.ngInjectableDef=i.Ob({factory:function(){return new e(i.Sb(a.c))},token:e,providedIn:"root"}),e})()},xkgV:function(e,t,n){"use strict";function i(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}var a=n("8Y7J");n.d(t,"a",function(){return f}),n.d(t,"e",function(){return r}),n.d(t,"c",function(){return g}),n.d(t,"d",function(){return h}),n.d(t,"b",function(){return o});var r=function(){function e(){this.change=new a.p,this.instances={},this.DEFAULT_ID="DEFAULT_PAGINATION_ID"}return e.prototype.defaultId=function(){return this.DEFAULT_ID},e.prototype.register=function(e){return null==e.id&&(e.id=this.DEFAULT_ID),this.instances[e.id]?this.updateInstance(e):(this.instances[e.id]=e,!0)},e.prototype.updateInstance=function(e){var t=!1;for(var n in this.instances[e.id])e[n]!==this.instances[e.id][n]&&(this.instances[e.id][n]=e[n],t=!0);return t},e.prototype.getCurrentPage=function(e){if(this.instances[e])return this.instances[e].currentPage},e.prototype.setCurrentPage=function(e,t){if(this.instances[e]){var n=this.instances[e];t<=Math.ceil(n.totalItems/n.itemsPerPage)&&1<=t&&(this.instances[e].currentPage=t,this.change.emit(e))}},e.prototype.setTotalItems=function(e,t){this.instances[e]&&0<=t&&(this.instances[e].totalItems=t,this.change.emit(e))},e.prototype.setItemsPerPage=function(e,t){this.instances[e]&&(this.instances[e].itemsPerPage=t,this.change.emit(e))},e.prototype.getInstance=function(e){return void 0===e&&(e=this.DEFAULT_ID),this.instances[e]?this.clone(this.instances[e]):{}},e.prototype.clone=function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t},e}(),s=Number.MAX_SAFE_INTEGER,o=function(){function e(e){this.service=e,this.state={}}return e.prototype.transform=function(e,t){if(!(e instanceof Array)){var n=t.id||this.service.defaultId();return this.state[n]?this.state[n].slice:e}var i,a,r=t.totalItems&&t.totalItems!==e.length,o=this.createInstance(e,t),c=o.id,p=o.itemsPerPage,l=this.service.register(o);if(!r&&e instanceof Array){if(this.stateIsIdentical(c,e,i=(o.currentPage-1)*(p=+p||s),a=i+p))return this.state[c].slice;var g=e.slice(i,a);return this.saveState(c,e,g,i,a),this.service.change.emit(c),g}return l&&this.service.change.emit(c),this.saveState(c,e,e,i,a),e},e.prototype.createInstance=function(e,t){return this.checkConfig(t),{id:null!=t.id?t.id:this.service.defaultId(),itemsPerPage:+t.itemsPerPage||0,currentPage:+t.currentPage||1,totalItems:+t.totalItems||e.length}},e.prototype.checkConfig=function(e){var t=["itemsPerPage","currentPage"].filter(function(t){return!(t in e)});if(0<t.length)throw new Error("PaginatePipe: Argument is missing the following required properties: "+t.join(", "))},e.prototype.saveState=function(e,t,n,i,a){this.state[e]={collection:t,size:t.length,slice:n,start:i,end:a}},e.prototype.stateIsIdentical=function(e,t,n,i){var a=this.state[e];return!!a&&!(a.size!==t.length||a.start!==n||a.end!==i)&&a.slice.every(function(e,i){return e===t[n+i]})},function(e,t,n,i){var a,r=arguments.length,s=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,i);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(s=(r<3?a(s):r>3?a(t,n,s):a(t,n))||s);return r>3&&s&&Object.defineProperty(t,n,s),s}([Object(a.G)({name:"paginate",pure:!1}),i("design:paramtypes",[r])],e)}(),c=function(e,t,n,i){var a,r=arguments.length,s=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,i);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(s=(r<3?a(s):r>3?a(t,n,s):a(t,n))||s);return r>3&&s&&Object.defineProperty(t,n,s),s},p=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};function l(e){return!!e&&"false"!==e}var g=function(){function e(){this.maxSize=7,this.previousLabel="Previous",this.nextLabel="Next",this.screenReaderPaginationLabel="Pagination",this.screenReaderPageLabel="page",this.screenReaderCurrentLabel="You're on page",this.pageChange=new a.p,this.pageBoundsCorrection=new a.p,this._directionLinks=!0,this._autoHide=!1,this._responsive=!1}return Object.defineProperty(e.prototype,"directionLinks",{get:function(){return this._directionLinks},set:function(e){this._directionLinks=l(e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"autoHide",{get:function(){return this._autoHide},set:function(e){this._autoHide=l(e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"responsive",{get:function(){return this._responsive},set:function(e){this._responsive=l(e)},enumerable:!0,configurable:!0}),c([Object(a.t)(),p("design:type",String)],e.prototype,"id",void 0),c([Object(a.t)(),p("design:type",Number)],e.prototype,"maxSize",void 0),c([Object(a.t)(),p("design:type",Boolean),p("design:paramtypes",[Boolean])],e.prototype,"directionLinks",null),c([Object(a.t)(),p("design:type",Boolean),p("design:paramtypes",[Boolean])],e.prototype,"autoHide",null),c([Object(a.t)(),p("design:type",Boolean),p("design:paramtypes",[Boolean])],e.prototype,"responsive",null),c([Object(a.t)(),p("design:type",String)],e.prototype,"previousLabel",void 0),c([Object(a.t)(),p("design:type",String)],e.prototype,"nextLabel",void 0),c([Object(a.t)(),p("design:type",String)],e.prototype,"screenReaderPaginationLabel",void 0),c([Object(a.t)(),p("design:type",String)],e.prototype,"screenReaderPageLabel",void 0),c([Object(a.t)(),p("design:type",String)],e.prototype,"screenReaderCurrentLabel",void 0),c([Object(a.D)(),p("design:type",a.p)],e.prototype,"pageChange",void 0),c([Object(a.D)(),p("design:type",a.p)],e.prototype,"pageBoundsCorrection",void 0),c([Object(a.k)({selector:"pagination-controls",template:'\n    <pagination-template  #p="paginationApi"\n                         [id]="id"\n                         [maxSize]="maxSize"\n                         (pageChange)="pageChange.emit($event)"\n                         (pageBoundsCorrection)="pageBoundsCorrection.emit($event)">\n    <ul class="ngx-pagination" \n        role="navigation" \n        [attr.aria-label]="screenReaderPaginationLabel" \n        [class.responsive]="responsive"\n        *ngIf="!(autoHide && p.pages.length <= 1)">\n\n        <li class="pagination-previous" [class.disabled]="p.isFirstPage()" *ngIf="directionLinks"> \n            <a tabindex="0" *ngIf="1 < p.getCurrent()" (keyup.enter)="p.previous()" (click)="p.previous()" [attr.aria-label]="previousLabel + \' \' + screenReaderPageLabel">\n                {{ previousLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>\n            </a>\n            <span *ngIf="p.isFirstPage()">\n                {{ previousLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>\n            </span>\n        </li> \n\n        <li class="small-screen">\n            {{ p.getCurrent() }} / {{ p.getLastPage() }}\n        </li>\n\n        <li [class.current]="p.getCurrent() === page.value" \n            [class.ellipsis]="page.label === \'...\'"\n            *ngFor="let page of p.pages">\n            <a tabindex="0" (keyup.enter)="p.setCurrent(page.value)" (click)="p.setCurrent(page.value)" *ngIf="p.getCurrent() !== page.value">\n                <span class="show-for-sr">{{ screenReaderPageLabel }} </span>\n                <span>{{ (page.label === \'...\') ? page.label : (page.label | number:\'\') }}</span>\n            </a>\n            <ng-container *ngIf="p.getCurrent() === page.value">\n                <span class="show-for-sr">{{ screenReaderCurrentLabel }} </span>\n                <span>{{ (page.label === \'...\') ? page.label : (page.label | number:\'\') }}</span> \n            </ng-container>\n        </li>\n\n        <li class="pagination-next" [class.disabled]="p.isLastPage()" *ngIf="directionLinks">\n            <a tabindex="0" *ngIf="!p.isLastPage()" (keyup.enter)="p.next()" (click)="p.next()" [attr.aria-label]="nextLabel + \' \' + screenReaderPageLabel">\n                 {{ nextLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>\n            </a>\n            <span *ngIf="p.isLastPage()">\n                 {{ nextLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>\n            </span>\n        </li>\n\n    </ul>\n    </pagination-template>\n    ',styles:["\n.ngx-pagination {\n  margin-left: 0;\n  margin-bottom: 1rem; }\n  .ngx-pagination::before, .ngx-pagination::after {\n    content: ' ';\n    display: table; }\n  .ngx-pagination::after {\n    clear: both; }\n  .ngx-pagination li {\n    -moz-user-select: none;\n    -webkit-user-select: none;\n    -ms-user-select: none;\n    margin-right: 0.0625rem;\n    border-radius: 0; }\n  .ngx-pagination li {\n    display: inline-block; }\n  .ngx-pagination a,\n  .ngx-pagination button {\n    color: #0a0a0a; \n    display: block;\n    padding: 0.1875rem 0.625rem;\n    border-radius: 0; }\n    .ngx-pagination a:hover,\n    .ngx-pagination button:hover {\n      background: #e6e6e6; }\n  .ngx-pagination .current {\n    padding: 0.1875rem 0.625rem;\n    background: #2199e8;\n    color: #fefefe;\n    cursor: default; }\n  .ngx-pagination .disabled {\n    padding: 0.1875rem 0.625rem;\n    color: #cacaca;\n    cursor: default; } \n    .ngx-pagination .disabled:hover {\n      background: transparent; }\n  .ngx-pagination a, .ngx-pagination button {\n    cursor: pointer; }\n\n.ngx-pagination .pagination-previous a::before,\n.ngx-pagination .pagination-previous.disabled::before { \n  content: '\xab';\n  display: inline-block;\n  margin-right: 0.5rem; }\n\n.ngx-pagination .pagination-next a::after,\n.ngx-pagination .pagination-next.disabled::after {\n  content: '\xbb';\n  display: inline-block;\n  margin-left: 0.5rem; }\n\n.ngx-pagination .show-for-sr {\n  position: absolute !important;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0); }\n.ngx-pagination .small-screen {\n  display: none; }\n@media screen and (max-width: 601px) {\n  .ngx-pagination.responsive .small-screen {\n    display: inline-block; } \n  .ngx-pagination.responsive li:not(.small-screen):not(.pagination-previous):not(.pagination-next) {\n    display: none; }\n}\n  "],changeDetection:a.h.OnPush,encapsulation:a.T.None})],e)}(),u=function(e,t,n,i){var a,r=arguments.length,s=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,i);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(s=(r<3?a(s):r>3?a(t,n,s):a(t,n))||s);return r>3&&s&&Object.defineProperty(t,n,s),s},d=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},h=function(){function e(e,t){var n=this;this.service=e,this.changeDetectorRef=t,this.maxSize=7,this.pageChange=new a.p,this.pageBoundsCorrection=new a.p,this.pages=[],this.changeSub=this.service.change.subscribe(function(e){n.id===e&&(n.updatePageLinks(),n.changeDetectorRef.markForCheck(),n.changeDetectorRef.detectChanges())})}return e.prototype.ngOnInit=function(){void 0===this.id&&(this.id=this.service.defaultId()),this.updatePageLinks()},e.prototype.ngOnChanges=function(e){this.updatePageLinks()},e.prototype.ngOnDestroy=function(){this.changeSub.unsubscribe()},e.prototype.previous=function(){this.checkValidId(),this.setCurrent(this.getCurrent()-1)},e.prototype.next=function(){this.checkValidId(),this.setCurrent(this.getCurrent()+1)},e.prototype.isFirstPage=function(){return 1===this.getCurrent()},e.prototype.isLastPage=function(){return this.getLastPage()===this.getCurrent()},e.prototype.setCurrent=function(e){this.pageChange.emit(e)},e.prototype.getCurrent=function(){return this.service.getCurrentPage(this.id)},e.prototype.getLastPage=function(){var e=this.service.getInstance(this.id);return e.totalItems<1?1:Math.ceil(e.totalItems/e.itemsPerPage)},e.prototype.getTotalItems=function(){return this.service.getInstance(this.id).totalItems},e.prototype.checkValidId=function(){null==this.service.getInstance(this.id).id&&console.warn('PaginationControlsDirective: the specified id "'+this.id+'" does not match any registered PaginationInstance')},e.prototype.updatePageLinks=function(){var e=this,t=this.service.getInstance(this.id),n=this.outOfBoundCorrection(t);n!==t.currentPage?setTimeout(function(){e.pageBoundsCorrection.emit(n),e.pages=e.createPageArray(t.currentPage,t.itemsPerPage,t.totalItems,e.maxSize)}):this.pages=this.createPageArray(t.currentPage,t.itemsPerPage,t.totalItems,this.maxSize)},e.prototype.outOfBoundCorrection=function(e){var t=Math.ceil(e.totalItems/e.itemsPerPage);return t<e.currentPage&&0<t?t:e.currentPage<1?1:e.currentPage},e.prototype.createPageArray=function(e,t,n,i){i=+i;for(var a=[],r=Math.ceil(n/t),s=Math.ceil(i/2),o=e<=s,c=r-s<e,p=!o&&!c,l=i<r,g=1;g<=r&&g<=i;){var u=this.calculatePageNumber(g,e,i,r);a.push({label:l&&(2===g&&(p||c)||g===i-1&&(p||o))?"...":u,value:u}),g++}return a},e.prototype.calculatePageNumber=function(e,t,n,i){var a=Math.ceil(n/2);return e===n?i:1===e?e:n<i?i-a<t?i-n+e:a<t?t-a+e:e:e},u([Object(a.t)(),d("design:type",String)],e.prototype,"id",void 0),u([Object(a.t)(),d("design:type",Number)],e.prototype,"maxSize",void 0),u([Object(a.D)(),d("design:type",a.p)],e.prototype,"pageChange",void 0),u([Object(a.D)(),d("design:type",a.p)],e.prototype,"pageBoundsCorrection",void 0),u([Object(a.m)({selector:"pagination-template,[pagination-template]",exportAs:"paginationApi"}),d("design:paramtypes",[r,a.i])],e)}(),f=function(){return function(){}}()}}]);