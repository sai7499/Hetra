(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{"5pZN":function(e,t,n){"use strict";n.d(t,"a",function(){return r});var i=n("CcnG"),a=n("t/Na"),r=function(){function e(e){this.http=e,this.labelsurl="assets/labels/labels.json",this.labelDDEsurl="assets/labels/label_credit_vehicle_details.json",this.labelFleetUrl="assets/labels/labelFleetDetails.json",this.languageLabelsurl="assets/labels/labels-hindi.json"}return e.prototype.getLabelsData=function(){return this.http.get(this.labelsurl)},e.prototype.getLabelsOfDDEData=function(){return this.http.get(this.labelDDEsurl)},e.prototype.getLabelsFleetData=function(){return this.http.get(this.labelFleetUrl)},e.prototype.getLanguageLabelData=function(){return this.http.get(this.languageLabelsurl)},e.ngInjectableDef=i.Qb({factory:function(){return new e(i.Ub(a.c))},token:e,providedIn:"root"}),e}()},EUG0:function(e,t){},ixF7:function(e,t,n){"use strict";n.d(t,"a",function(){return i}),n("nrvr");var i=function(){function e(e){this.lovDataService=e,this.className="form-control mandatory",this.defaultOption={key:"",value:"-- select one --"},this.onChange=function(){},this.onTouch=function(){}}return Object.defineProperty(e.prototype,"selectedOption",{get:function(){return this.val},set:function(e){this.val=e,this.onChange(this.val)},enumerable:!0,configurable:!0}),e.prototype.ngOnInit=function(){this.selectedOption=this.selectedOption||this.defaultOption.key},e.prototype.ngOnChanges=function(){this.selectedOption&&this.onChange(this.val)},e.prototype.writeValue=function(e){this.val=e},e.prototype.registerOnChange=function(e){this.onChange=e},e.prototype.registerOnTouched=function(e){this.onTouch=e},e.prototype.setDisabledState=function(e){this.isDisabled=e},e}()},m1Ie:function(e,t,n){"use strict";n.d(t,"a",function(){return a}),n("EUG0");var i=n("CcnG"),a=function(){function e(){this.applicantList=[],this.vehicleList=[]}return e.prototype.setLeadCreation=function(e){this.leadCreation=e},e.prototype.getLeadCreation=function(){return this.leadCreation},e.prototype.setSourcingDetails=function(e){this.leadCreation.sourcingDetails=e},e.prototype.getSourcingDetails=function(){return this.leadCreation?this.leadCreation.sourcingDetails:{}},e.prototype.setProductDetails=function(e){this.leadCreation.productDetails=e},e.prototype.getProductDetails=function(){return this.leadCreation?this.leadCreation.productDetails:{}},e.prototype.setVehicleDetails=function(e){this.vehicleList.push(e)},e.prototype.getVehicleDetails=function(){return this.vehicleList},e.prototype.getSelectedVehicle=function(e){return this.vehicleList[e]},e.prototype.updateVehicle=function(e,t){this.vehicleList[e]=t},e.prototype.deleteVehicle=function(e){this.vehicleList.splice(e,1)},e.prototype.setLoanDetails=function(e){this.leadCreation.loanDetails=e},e.prototype.getLoanDetails=function(){return this.leadCreation.loanDetails},e.prototype.setCoApplicantDetails=function(e){this.applicantList.push(e)},e.prototype.getSelectedApplicant=function(e){return this.applicantList[e]},e.prototype.updateApplicant=function(e,t){this.applicantList[e]=t},e.prototype.deleteApplicant=function(e){this.applicantList.splice(e,1)},e.prototype.getApplicantList=function(){return this.applicantList},e.prototype.setDedupeData=function(e){this.leadDedupeData=e},e.prototype.getDedupeData=function(){return this.leadDedupeData},e.ngInjectableDef=i.Qb({factory:function(){return new e},token:e,providedIn:"root"}),e}()},nrvr:function(e,t,n){"use strict";n.d(t,"a",function(){return r});var i=n("CcnG"),a=n("t/Na"),r=function(){function e(e){this.http=e,this.dataUrl="assets/jsonData/lov.json"}return e.prototype.getLovData=function(){return this.http.get(this.dataUrl)},e.ngInjectableDef=i.Qb({factory:function(){return new e(i.Ub(a.c))},token:e,providedIn:"root"}),e}()},rUT8:function(e,t,n){"use strict";var i=n("CcnG"),a=n("gIcY"),r=n("Ip0R");n("ixF7"),n("nrvr"),n.d(t,"a",function(){return o}),n.d(t,"b",function(){return l});var o=i.tb({encapsulation:0,styles:[[""]],data:{}});function s(e){return i.Ob(0,[(e()(),i.vb(0,0,null,null,3,"option",[],null,null,null,null,null)),i.ub(1,147456,null,0,a.u,[i.n,i.J,[2,a.y]],{value:[0,"value"]},null),i.ub(2,147456,null,0,a.D,[i.n,i.J,[8,null]],{value:[0,"value"]},null),(e()(),i.Mb(3,null,["",""]))],function(e,t){e(t,1,0,i.xb(1,"",t.context.$implicit.key,"")),e(t,2,0,i.xb(1,"",t.context.$implicit.key,""))},function(e,t){e(t,3,0,t.context.$implicit.value)})}function l(e){return i.Ob(0,[(e()(),i.vb(0,0,null,null,11,"select",[],[[8,"className",0],[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"change"],[null,"blur"]],function(e,t,n){var a=!0,r=e.component;return"change"===t&&(a=!1!==i.Fb(e,1).onChange(n.target.value)&&a),"blur"===t&&(a=!1!==i.Fb(e,1).onTouched()&&a),"ngModelChange"===t&&(a=!1!==(r.selectedOption=n)&&a),a},null,null)),i.ub(1,16384,null,0,a.y,[i.J,i.n],null,null),i.Kb(1024,null,a.o,function(e){return[e]},[a.y]),i.ub(3,671744,null,0,a.t,[[8,null],[8,null],[8,null],[6,a.o]],{isDisabled:[0,"isDisabled"],model:[1,"model"]},{update:"ngModelChange"}),i.Kb(2048,null,a.p,null,[a.t]),i.ub(5,16384,null,0,a.q,[[4,a.p]],null,null),(e()(),i.vb(6,0,null,null,3,"option",[["disabled",""]],null,null,null,null,null)),i.ub(7,147456,null,0,a.u,[i.n,i.J,[2,a.y]],{value:[0,"value"]},null),i.ub(8,147456,null,0,a.D,[i.n,i.J,[8,null]],{value:[0,"value"]},null),(e()(),i.Mb(9,null,["",""])),(e()(),i.kb(16777216,null,null,1,null,s)),i.ub(11,278528,null,0,r.j,[i.U,i.R,i.v],{ngForOf:[0,"ngForOf"]},null)],function(e,t){var n=t.component;e(t,3,0,n.isDisabled,n.selectedOption),e(t,7,0,i.xb(1,"",n.defaultOption.key,"")),e(t,8,0,i.xb(1,"",n.defaultOption.key,"")),e(t,11,0,n.values)},function(e,t){var n=t.component;e(t,0,0,n.className,i.Fb(t,5).ngClassUntouched,i.Fb(t,5).ngClassTouched,i.Fb(t,5).ngClassPristine,i.Fb(t,5).ngClassDirty,i.Fb(t,5).ngClassValid,i.Fb(t,5).ngClassInvalid,i.Fb(t,5).ngClassPending),e(t,9,0,n.defaultOption.value)})}},xkgV:function(e,t,n){"use strict";n.d(t,"a",function(){return f}),n.d(t,"e",function(){return r}),n.d(t,"c",function(){return p}),n.d(t,"d",function(){return h}),n.d(t,"b",function(){return s});var i=n("mrSG"),a=n("CcnG"),r=function(){function e(){this.change=new a.p,this.instances={},this.DEFAULT_ID="DEFAULT_PAGINATION_ID"}return e.prototype.defaultId=function(){return this.DEFAULT_ID},e.prototype.register=function(e){return null==e.id&&(e.id=this.DEFAULT_ID),this.instances[e.id]?this.updateInstance(e):(this.instances[e.id]=e,!0)},e.prototype.updateInstance=function(e){var t=!1;for(var n in this.instances[e.id])e[n]!==this.instances[e.id][n]&&(this.instances[e.id][n]=e[n],t=!0);return t},e.prototype.getCurrentPage=function(e){if(this.instances[e])return this.instances[e].currentPage},e.prototype.setCurrentPage=function(e,t){if(this.instances[e]){var n=this.instances[e];t<=Math.ceil(n.totalItems/n.itemsPerPage)&&1<=t&&(this.instances[e].currentPage=t,this.change.emit(e))}},e.prototype.setTotalItems=function(e,t){this.instances[e]&&0<=t&&(this.instances[e].totalItems=t,this.change.emit(e))},e.prototype.setItemsPerPage=function(e,t){this.instances[e]&&(this.instances[e].itemsPerPage=t,this.change.emit(e))},e.prototype.getInstance=function(e){return void 0===e&&(e=this.DEFAULT_ID),this.instances[e]?this.clone(this.instances[e]):{}},e.prototype.clone=function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t},e}(),o=Number.MAX_SAFE_INTEGER,s=function(){function e(e){this.service=e,this.state={}}return e.prototype.transform=function(e,t){if(!(e instanceof Array)){var n=t.id||this.service.defaultId();return this.state[n]?this.state[n].slice:e}var i,a,r=t.totalItems&&t.totalItems!==e.length,s=this.createInstance(e,t),l=s.id,c=s.itemsPerPage,u=this.service.register(s);if(!r&&e instanceof Array){if(this.stateIsIdentical(l,e,i=(s.currentPage-1)*(c=+c||o),a=i+c))return this.state[l].slice;var p=e.slice(i,a);return this.saveState(l,e,p,i,a),this.service.change.emit(l),p}return u&&this.service.change.emit(l),this.saveState(l,e,e,i,a),e},e.prototype.createInstance=function(e,t){return this.checkConfig(t),{id:null!=t.id?t.id:this.service.defaultId(),itemsPerPage:+t.itemsPerPage||0,currentPage:+t.currentPage||1,totalItems:+t.totalItems||e.length}},e.prototype.checkConfig=function(e){var t=["itemsPerPage","currentPage"].filter(function(t){return!(t in e)});if(0<t.length)throw new Error("PaginatePipe: Argument is missing the following required properties: "+t.join(", "))},e.prototype.saveState=function(e,t,n,i,a){this.state[e]={collection:t,size:t.length,slice:n,start:i,end:a}},e.prototype.stateIsIdentical=function(e,t,n,i){var a=this.state[e];return!!a&&!(a.size!==t.length||a.start!==n||a.end!==i)&&a.slice.every(function(e,i){return e===t[n+i]})},function(e,t,n,i){var a,r=arguments.length,o=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,n,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(o=(r<3?a(o):r>3?a(t,n,o):a(t,n))||o);return r>3&&o&&Object.defineProperty(t,n,o),o}([Object(a.H)({name:"paginate",pure:!1}),Object(i.f)("design:paramtypes",[r])],e)}(),l=function(e,t,n,i){var a,r=arguments.length,o=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,n,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(o=(r<3?a(o):r>3?a(t,n,o):a(t,n))||o);return r>3&&o&&Object.defineProperty(t,n,o),o},c=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};function u(e){return!!e&&"false"!==e}var p=function(){function e(){this.maxSize=7,this.previousLabel="Previous",this.nextLabel="Next",this.screenReaderPaginationLabel="Pagination",this.screenReaderPageLabel="page",this.screenReaderCurrentLabel="You're on page",this.pageChange=new a.p,this.pageBoundsCorrection=new a.p,this._directionLinks=!0,this._autoHide=!1,this._responsive=!1}return Object.defineProperty(e.prototype,"directionLinks",{get:function(){return this._directionLinks},set:function(e){this._directionLinks=u(e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"autoHide",{get:function(){return this._autoHide},set:function(e){this._autoHide=u(e)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"responsive",{get:function(){return this._responsive},set:function(e){this._responsive=u(e)},enumerable:!0,configurable:!0}),l([Object(a.u)(),c("design:type",String)],e.prototype,"id",void 0),l([Object(a.u)(),c("design:type",Number)],e.prototype,"maxSize",void 0),l([Object(a.u)(),c("design:type",Boolean),c("design:paramtypes",[Boolean])],e.prototype,"directionLinks",null),l([Object(a.u)(),c("design:type",Boolean),c("design:paramtypes",[Boolean])],e.prototype,"autoHide",null),l([Object(a.u)(),c("design:type",Boolean),c("design:paramtypes",[Boolean])],e.prototype,"responsive",null),l([Object(a.u)(),c("design:type",String)],e.prototype,"previousLabel",void 0),l([Object(a.u)(),c("design:type",String)],e.prototype,"nextLabel",void 0),l([Object(a.u)(),c("design:type",String)],e.prototype,"screenReaderPaginationLabel",void 0),l([Object(a.u)(),c("design:type",String)],e.prototype,"screenReaderPageLabel",void 0),l([Object(a.u)(),c("design:type",String)],e.prototype,"screenReaderCurrentLabel",void 0),l([Object(a.E)(),c("design:type",a.p)],e.prototype,"pageChange",void 0),l([Object(a.E)(),c("design:type",a.p)],e.prototype,"pageBoundsCorrection",void 0),l([Object(a.k)({selector:"pagination-controls",template:'\n    <pagination-template  #p="paginationApi"\n                         [id]="id"\n                         [maxSize]="maxSize"\n                         (pageChange)="pageChange.emit($event)"\n                         (pageBoundsCorrection)="pageBoundsCorrection.emit($event)">\n    <ul class="ngx-pagination" \n        role="navigation" \n        [attr.aria-label]="screenReaderPaginationLabel" \n        [class.responsive]="responsive"\n        *ngIf="!(autoHide && p.pages.length <= 1)">\n\n        <li class="pagination-previous" [class.disabled]="p.isFirstPage()" *ngIf="directionLinks"> \n            <a tabindex="0" *ngIf="1 < p.getCurrent()" (keyup.enter)="p.previous()" (click)="p.previous()" [attr.aria-label]="previousLabel + \' \' + screenReaderPageLabel">\n                {{ previousLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>\n            </a>\n            <span *ngIf="p.isFirstPage()">\n                {{ previousLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>\n            </span>\n        </li> \n\n        <li class="small-screen">\n            {{ p.getCurrent() }} / {{ p.getLastPage() }}\n        </li>\n\n        <li [class.current]="p.getCurrent() === page.value" \n            [class.ellipsis]="page.label === \'...\'"\n            *ngFor="let page of p.pages">\n            <a tabindex="0" (keyup.enter)="p.setCurrent(page.value)" (click)="p.setCurrent(page.value)" *ngIf="p.getCurrent() !== page.value">\n                <span class="show-for-sr">{{ screenReaderPageLabel }} </span>\n                <span>{{ (page.label === \'...\') ? page.label : (page.label | number:\'\') }}</span>\n            </a>\n            <ng-container *ngIf="p.getCurrent() === page.value">\n                <span class="show-for-sr">{{ screenReaderCurrentLabel }} </span>\n                <span>{{ (page.label === \'...\') ? page.label : (page.label | number:\'\') }}</span> \n            </ng-container>\n        </li>\n\n        <li class="pagination-next" [class.disabled]="p.isLastPage()" *ngIf="directionLinks">\n            <a tabindex="0" *ngIf="!p.isLastPage()" (keyup.enter)="p.next()" (click)="p.next()" [attr.aria-label]="nextLabel + \' \' + screenReaderPageLabel">\n                 {{ nextLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>\n            </a>\n            <span *ngIf="p.isLastPage()">\n                 {{ nextLabel }} <span class="show-for-sr">{{ screenReaderPageLabel }}</span>\n            </span>\n        </li>\n\n    </ul>\n    </pagination-template>\n    ',styles:["\n.ngx-pagination {\n  margin-left: 0;\n  margin-bottom: 1rem; }\n  .ngx-pagination::before, .ngx-pagination::after {\n    content: ' ';\n    display: table; }\n  .ngx-pagination::after {\n    clear: both; }\n  .ngx-pagination li {\n    -moz-user-select: none;\n    -webkit-user-select: none;\n    -ms-user-select: none;\n    margin-right: 0.0625rem;\n    border-radius: 0; }\n  .ngx-pagination li {\n    display: inline-block; }\n  .ngx-pagination a,\n  .ngx-pagination button {\n    color: #0a0a0a; \n    display: block;\n    padding: 0.1875rem 0.625rem;\n    border-radius: 0; }\n    .ngx-pagination a:hover,\n    .ngx-pagination button:hover {\n      background: #e6e6e6; }\n  .ngx-pagination .current {\n    padding: 0.1875rem 0.625rem;\n    background: #2199e8;\n    color: #fefefe;\n    cursor: default; }\n  .ngx-pagination .disabled {\n    padding: 0.1875rem 0.625rem;\n    color: #cacaca;\n    cursor: default; } \n    .ngx-pagination .disabled:hover {\n      background: transparent; }\n  .ngx-pagination a, .ngx-pagination button {\n    cursor: pointer; }\n\n.ngx-pagination .pagination-previous a::before,\n.ngx-pagination .pagination-previous.disabled::before { \n  content: '\xab';\n  display: inline-block;\n  margin-right: 0.5rem; }\n\n.ngx-pagination .pagination-next a::after,\n.ngx-pagination .pagination-next.disabled::after {\n  content: '\xbb';\n  display: inline-block;\n  margin-left: 0.5rem; }\n\n.ngx-pagination .show-for-sr {\n  position: absolute !important;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0); }\n.ngx-pagination .small-screen {\n  display: none; }\n@media screen and (max-width: 601px) {\n  .ngx-pagination.responsive .small-screen {\n    display: inline-block; } \n  .ngx-pagination.responsive li:not(.small-screen):not(.pagination-previous):not(.pagination-next) {\n    display: none; }\n}\n  "],changeDetection:a.h.OnPush,encapsulation:a.V.None})],e)}(),g=function(e,t,n,i){var a,r=arguments.length,o=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,n,i);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(o=(r<3?a(o):r>3?a(t,n,o):a(t,n))||o);return r>3&&o&&Object.defineProperty(t,n,o),o},d=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},h=function(){function e(e,t){var n=this;this.service=e,this.changeDetectorRef=t,this.maxSize=7,this.pageChange=new a.p,this.pageBoundsCorrection=new a.p,this.pages=[],this.changeSub=this.service.change.subscribe(function(e){n.id===e&&(n.updatePageLinks(),n.changeDetectorRef.markForCheck(),n.changeDetectorRef.detectChanges())})}return e.prototype.ngOnInit=function(){void 0===this.id&&(this.id=this.service.defaultId()),this.updatePageLinks()},e.prototype.ngOnChanges=function(e){this.updatePageLinks()},e.prototype.ngOnDestroy=function(){this.changeSub.unsubscribe()},e.prototype.previous=function(){this.checkValidId(),this.setCurrent(this.getCurrent()-1)},e.prototype.next=function(){this.checkValidId(),this.setCurrent(this.getCurrent()+1)},e.prototype.isFirstPage=function(){return 1===this.getCurrent()},e.prototype.isLastPage=function(){return this.getLastPage()===this.getCurrent()},e.prototype.setCurrent=function(e){this.pageChange.emit(e)},e.prototype.getCurrent=function(){return this.service.getCurrentPage(this.id)},e.prototype.getLastPage=function(){var e=this.service.getInstance(this.id);return e.totalItems<1?1:Math.ceil(e.totalItems/e.itemsPerPage)},e.prototype.getTotalItems=function(){return this.service.getInstance(this.id).totalItems},e.prototype.checkValidId=function(){null==this.service.getInstance(this.id).id&&console.warn('PaginationControlsDirective: the specified id "'+this.id+'" does not match any registered PaginationInstance')},e.prototype.updatePageLinks=function(){var e=this,t=this.service.getInstance(this.id),n=this.outOfBoundCorrection(t);n!==t.currentPage?setTimeout(function(){e.pageBoundsCorrection.emit(n),e.pages=e.createPageArray(t.currentPage,t.itemsPerPage,t.totalItems,e.maxSize)}):this.pages=this.createPageArray(t.currentPage,t.itemsPerPage,t.totalItems,this.maxSize)},e.prototype.outOfBoundCorrection=function(e){var t=Math.ceil(e.totalItems/e.itemsPerPage);return t<e.currentPage&&0<t?t:e.currentPage<1?1:e.currentPage},e.prototype.createPageArray=function(e,t,n,i){i=+i;for(var a=[],r=Math.ceil(n/t),o=Math.ceil(i/2),s=e<=o,l=r-o<e,c=!s&&!l,u=i<r,p=1;p<=r&&p<=i;){var g=this.calculatePageNumber(p,e,i,r);a.push({label:u&&(2===p&&(c||l)||p===i-1&&(c||s))?"...":g,value:g}),p++}return a},e.prototype.calculatePageNumber=function(e,t,n,i){var a=Math.ceil(n/2);return e===n?i:1===e?e:n<i?i-a<t?i-n+e:a<t?t-a+e:e:e},g([Object(a.u)(),d("design:type",String)],e.prototype,"id",void 0),g([Object(a.u)(),d("design:type",Number)],e.prototype,"maxSize",void 0),g([Object(a.E)(),d("design:type",a.p)],e.prototype,"pageChange",void 0),g([Object(a.E)(),d("design:type",a.p)],e.prototype,"pageBoundsCorrection",void 0),g([Object(a.m)({selector:"pagination-template,[pagination-template]",exportAs:"paginationApi"}),d("design:paramtypes",[r,a.i])],e)}(),f=function(){return function(){}}()}}]);