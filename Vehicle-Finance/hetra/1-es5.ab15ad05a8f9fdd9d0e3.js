(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{BqBV:function(l,n,e){"use strict";e.d(n,"a",function(){return t}),e("p8Xo"),e("5pZN"),e("zcu7"),e("V+VW");var t=function(){function l(l,n,e,t,a){this.loginStoreService=l,this.labelsData=n,this.vehicleDetailsService=e,this.router=t,this.createLeadDataService=a,this.roles=[],this.label={},this.vehicleArray=[],this.leadData={},this.vehicleListArray=[{registrationNum:"TN-04-SS-0292",make:"TATA",model:"SUMO"},{registrationNum:"KL-05-AG-1191",make:"TATA",model:"SUMO"}]}return l.prototype.ngOnInit=function(){var l=this,n=this.loginStoreService.getRolesAndUserDetails();this.roles=n.roles,this.roleId=this.roles[0].roleId,this.roleName=this.roles[0].name,this.roleType=this.roles[0].roleType,this.leadData=this.createLeadDataService.getLeadSectionData(),this.leadId=this.leadData.leadId,this.getVehicleDetails(this.leadId),this.labelsData.getLabelsData().subscribe(function(n){l.label=n},function(l){console.log("error",l)})},l.prototype.editVehicle=function(l){this.router.navigate(["pages/lead-section/"+this.leadId+"/add-vehicle",{vehicleId:l}])},l.prototype.getVehicleDetails=function(l){var n=this;this.vehicleDetailsService.getAllVehicleCollateralDetails(l).subscribe(function(l){l.ProcessVariables&&0===l.ProcessVariables.error.code?n.vehicleArray=l.ProcessVariables.vehicleDetails?l.ProcessVariables.vehicleDetails:[]:0!==l.ProcessVariables.error.code&&1===l.ProcessVariables.error.code&&alert(""+l.ProcessVariables.error.message)})},l.prototype.removeOtherIndex=function(l,n){n.length>1?n.splice(l,1):alert("Atleast One Row Required")},l}()},EUG0:function(l,n){},PLIQ:function(l,n,e){"use strict";var t=e("CcnG"),a=e("Ip0R"),u=e("ZYCi");e("BqBV"),e("p8Xo"),e("5pZN"),e("zcu7"),e("V+VW"),e.d(n,"a",function(){return i}),e.d(n,"b",function(){return b});var i=t.ub({encapsulation:0,styles:[[""]],data:{}});function r(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,1,"th",[],null,null,null,null,null)),(l()(),t.Ob(1,null,["",""]))],null,function(l,n){l(n,1,0,n.component.label.variant)})}function o(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,1,"th",[],null,null,null,null,null)),(l()(),t.Ob(1,null,["",""]))],null,function(l,n){l(n,1,0,n.component.label.finalAssetCost)})}function c(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,12,"tr",[["id","add_vhd_tabletr"]],null,null,null,null,null)),(l()(),t.wb(1,0,null,null,1,"td",[["data-title","Registration Number"]],null,null,null,null,null)),(l()(),t.Ob(2,null,[" "," "])),(l()(),t.wb(3,0,null,null,1,"td",[["data-title","Make"]],null,null,null,null,null)),(l()(),t.Ob(4,null,[" "," "])),(l()(),t.wb(5,0,null,null,1,"td",[["data-title","Model"]],null,null,null,null,null)),(l()(),t.Ob(6,null,[" "," "])),(l()(),t.wb(7,0,null,null,0,"td",[["data-title","Variant"]],null,null,null,null,null)),(l()(),t.wb(8,0,null,null,0,"td",[["data-title","FinalAssetCost"]],null,null,null,null,null)),(l()(),t.wb(9,0,null,null,3,"td",[["data-title","Action"]],null,null,null,null,null)),(l()(),t.wb(10,0,null,null,0,"i",[["aria-hidden","true"],["class","fa fa-pencil"]],null,[[null,"click"]],function(l,n,e){var t=!0;return"click"===n&&(t=!1!==l.component.editVehicle(l.context.$implicit.collateralId)&&t),t},null,null)),(l()(),t.Ob(-1,null,["\xa0"])),(l()(),t.wb(12,0,null,null,0,"i",[["aria-hidden","true"],["class","fa fa-minus"],["id","remove_item_applicant"]],null,[[null,"click"]],function(l,n,e){var t=!0,a=l.component;return"click"===n&&(t=!1!==a.removeOtherIndex(l.context.index,a.vehicleListArray)&&t),t},null,null))],null,function(l,n){l(n,2,0,n.context.$implicit.regNo),l(n,4,0,n.context.$implicit.make),l(n,6,0,n.context.$implicit.model)})}function s(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,2,"tbody",[],null,null,null,null,null)),(l()(),t.lb(16777216,null,null,1,null,c)),t.vb(2,278528,null,0,a.k,[t.V,t.S,t.w],{ngForOf:[0,"ngForOf"]},null)],function(l,n){l(n,2,0,n.component.vehicleArray)},null)}function p(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,12,"tr",[["class","text-center"],["id","applicant_row"]],null,null,null,null,null)),(l()(),t.wb(1,0,null,null,1,"td",[["data-title","Registration Number"]],null,null,null,null,null)),(l()(),t.Ob(2,null,[" "," "])),(l()(),t.wb(3,0,null,null,1,"td",[["data-title","Make"]],null,null,null,null,null)),(l()(),t.Ob(4,null,[" "," "])),(l()(),t.wb(5,0,null,null,1,"td",[["data-title","Model"]],null,null,null,null,null)),(l()(),t.Ob(6,null,[" "," "])),(l()(),t.wb(7,0,null,null,5,"td",[["data-title","Action"]],null,null,null,null,null)),(l()(),t.wb(8,0,null,null,2,"i",[["aria-hidden","true"],["class","fa fa-pencil"]],null,[[null,"click"]],function(l,n,e){var a=!0;return"click"===n&&(a=!1!==t.Gb(l,9).onClick()&&a),a},null,null)),t.vb(9,16384,null,0,u.p,[u.o,u.a,[8,null],t.K,t.n],{routerLink:[0,"routerLink"]},null),t.Hb(10,1),(l()(),t.Ob(-1,null,["\xa0"])),(l()(),t.wb(12,0,null,null,0,"i",[["aria-hidden","true"],["class","fa fa-minus"],["id","remove_item_applicant"]],null,[[null,"click"]],function(l,n,e){var t=!0,a=l.component;return"click"===n&&(t=!1!==a.removeOtherIndex(l.context.index,a.vehicleListArray)&&t),t},null,null))],function(l,n){var e=l(n,10,0,"/pages/vehicle-details");l(n,9,0,e)},function(l,n){l(n,2,0,n.context.$implicit.regNo),l(n,4,0,n.context.$implicit.make),l(n,6,0,n.context.$implicit.model)})}function d(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,2,"tbody",[],null,null,null,null,null)),(l()(),t.lb(16777216,null,null,1,null,p)),t.vb(2,278528,null,0,a.k,[t.V,t.S,t.w],{ngForOf:[0,"ngForOf"]},null)],function(l,n){l(n,2,0,n.component.vehicleArray)},null)}function b(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,31,"div",[["class","multisteps-form__form"]],null,null,null,null,null)),(l()(),t.wb(1,0,null,null,2,"h4",[["class","title"]],null,null,null,null,null)),(l()(),t.wb(2,0,null,null,1,"b",[],null,null,null,null,null)),(l()(),t.Ob(3,null,["",""])),(l()(),t.wb(4,0,null,null,7,"div",[["class","text-right"],["id","add_vehicle_details_btn"]],null,null,null,null,null)),(l()(),t.wb(5,0,null,null,6,"button",[["class","btn mar-right8"],["type","button"]],null,[[null,"click"]],function(l,n,e){var a=!0;return"click"===n&&(a=!1!==t.Gb(l,8).onClick()&&a),a},null,null)),t.Lb(512,null,a.u,a.v,[t.w,t.x,t.n,t.K]),t.vb(7,278528,null,0,a.j,[a.u],{klass:[0,"klass"],ngClass:[1,"ngClass"]},null),t.vb(8,16384,null,0,u.p,[u.o,u.a,[8,null],t.K,t.n],{routerLink:[0,"routerLink"]},null),t.Hb(9,1),t.Hb(10,1),(l()(),t.Ob(11,null,["",""])),(l()(),t.wb(12,0,null,null,19,"div",[["class","table-responsive"]],null,null,null,null,null)),(l()(),t.wb(13,0,null,null,18,"table",[["class","table"],["id","add_vhd_table"]],null,null,null,null,null)),(l()(),t.wb(14,0,null,null,13,"thead",[],null,null,null,null,null)),(l()(),t.wb(15,0,null,null,12,"tr",[["class"," table-head-bg "]],null,null,null,null,null)),(l()(),t.wb(16,0,null,null,1,"th",[],null,null,null,null,null)),(l()(),t.Ob(17,null,["",""])),(l()(),t.wb(18,0,null,null,1,"th",[],null,null,null,null,null)),(l()(),t.Ob(19,null,[""," "])),(l()(),t.wb(20,0,null,null,1,"th",[],null,null,null,null,null)),(l()(),t.Ob(21,null,["",""])),(l()(),t.lb(16777216,null,null,1,null,r)),t.vb(23,16384,null,0,a.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null),(l()(),t.lb(16777216,null,null,1,null,o)),t.vb(25,16384,null,0,a.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null),(l()(),t.wb(26,0,null,null,1,"th",[],null,null,null,null,null)),(l()(),t.Ob(27,null,["",""])),(l()(),t.lb(16777216,null,null,1,null,s)),t.vb(29,16384,null,0,a.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null),(l()(),t.lb(16777216,null,null,1,null,d)),t.vb(31,16384,null,0,a.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null)],function(l,n){var e=n.component;l(n,7,0,"btn mar-right8","Sales Officer"===e.roleName?"btn-primary":"btn-secondary");var t="Sales Officer"===e.roleName?l(n,9,0,"../add-vehicle"):l(n,10,0,"/pages/vehicle-details");l(n,8,0,t),l(n,23,0,"Sales Officer"===e.roleName),l(n,25,0,"Sales Officer"===e.roleName),l(n,29,0,"Sales Officer"===e.roleName),l(n,31,0,"Credit Officer"===e.roleName)},function(l,n){var e=n.component;l(n,3,0,"Sales Officer"===e.roleName?e.label.vehcileDetailsTitle:""),l(n,11,0,e.label.addVehicle),l(n,17,0,e.label.registrationNo),l(n,19,0,e.label.make),l(n,21,0,e.label.model),l(n,27,0,e.label.action)})}},"V+VW":function(l,n,e){"use strict";e.d(n,"a",function(){return a});var t=e("CcnG"),a=function(){function l(){this.leadData={},this.leadSectionData={},this.proceedAsNewLeadData={},this.proceedWithSelectedLead={}}return l.prototype.setLeadData=function(l,n){this.leadData={loanLeadDetails:l,applicantDetails:n}},l.prototype.getLeadData=function(){return this.leadData},l.prototype.setLeadSectionData=function(l){this.leadSectionData=l},l.prototype.getLeadSectionData=function(){return this.leadSectionData},l.prototype.setProceedAsNewLead=function(l){this.proceedAsNewLeadData=l},l.prototype.getProceedAsNewLead=function(){return this.proceedAsNewLeadData},l.prototype.setProceedWithSelectedLead=function(l){this.proceedWithSelectedLead=l},l.prototype.getProceedWithSelectedLead=function(){return this.proceedWithSelectedLead},l.ngInjectableDef=t.Sb({factory:function(){return new l},token:l,providedIn:"root"}),l}()},abRS:function(l,n,e){"use strict";e.d(n,"a",function(){return i}),e.d(n,"b",function(){return v});var t=e("CcnG"),a=e("xkgV"),u=e("Ip0R"),i=t.ub({encapsulation:2,styles:["\n.ngx-pagination {\n  margin-left: 0;\n  margin-bottom: 1rem; }\n  .ngx-pagination::before, .ngx-pagination::after {\n    content: ' ';\n    display: table; }\n  .ngx-pagination::after {\n    clear: both; }\n  .ngx-pagination li {\n    -moz-user-select: none;\n    -webkit-user-select: none;\n    -ms-user-select: none;\n    margin-right: 0.0625rem;\n    border-radius: 0; }\n  .ngx-pagination li {\n    display: inline-block; }\n  .ngx-pagination a,\n  .ngx-pagination button {\n    color: #0a0a0a; \n    display: block;\n    padding: 0.1875rem 0.625rem;\n    border-radius: 0; }\n    .ngx-pagination a:hover,\n    .ngx-pagination button:hover {\n      background: #e6e6e6; }\n  .ngx-pagination .current {\n    padding: 0.1875rem 0.625rem;\n    background: #2199e8;\n    color: #fefefe;\n    cursor: default; }\n  .ngx-pagination .disabled {\n    padding: 0.1875rem 0.625rem;\n    color: #cacaca;\n    cursor: default; } \n    .ngx-pagination .disabled:hover {\n      background: transparent; }\n  .ngx-pagination a, .ngx-pagination button {\n    cursor: pointer; }\n\n.ngx-pagination .pagination-previous a::before,\n.ngx-pagination .pagination-previous.disabled::before { \n  content: '\xab';\n  display: inline-block;\n  margin-right: 0.5rem; }\n\n.ngx-pagination .pagination-next a::after,\n.ngx-pagination .pagination-next.disabled::after {\n  content: '\xbb';\n  display: inline-block;\n  margin-left: 0.5rem; }\n\n.ngx-pagination .show-for-sr {\n  position: absolute !important;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0); }\n.ngx-pagination .small-screen {\n  display: none; }\n@media screen and (max-width: 601px) {\n  .ngx-pagination.responsive .small-screen {\n    display: inline-block; } \n  .ngx-pagination.responsive li:not(.small-screen):not(.pagination-previous):not(.pagination-next) {\n    display: none; }\n}\n  "],data:{}});function r(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,3,"a",[["tabindex","0"]],[[1,"aria-label",0]],[[null,"keyup.enter"],[null,"click"]],function(l,n,e){var a=!0;return"keyup.enter"===n&&(a=!1!==t.Gb(l.parent.parent.parent,2).previous()&&a),"click"===n&&(a=!1!==t.Gb(l.parent.parent.parent,2).previous()&&a),a},null,null)),(l()(),t.Ob(1,null,[" "," "])),(l()(),t.wb(2,0,null,null,1,"span",[["class","show-for-sr"]],null,null,null,null,null)),(l()(),t.Ob(3,null,["",""]))],null,function(l,n){var e=n.component;l(n,0,0,e.previousLabel+" "+e.screenReaderPageLabel),l(n,1,0,e.previousLabel),l(n,3,0,e.screenReaderPageLabel)})}function o(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,3,"span",[],null,null,null,null,null)),(l()(),t.Ob(1,null,[" "," "])),(l()(),t.wb(2,0,null,null,1,"span",[["class","show-for-sr"]],null,null,null,null,null)),(l()(),t.Ob(3,null,["",""]))],null,function(l,n){var e=n.component;l(n,1,0,e.previousLabel),l(n,3,0,e.screenReaderPageLabel)})}function c(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,4,"li",[["class","pagination-previous"]],[[2,"disabled",null]],null,null,null,null)),(l()(),t.lb(16777216,null,null,1,null,r)),t.vb(2,16384,null,0,u.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null),(l()(),t.lb(16777216,null,null,1,null,o)),t.vb(4,16384,null,0,u.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null)],function(l,n){l(n,2,0,1<t.Gb(n.parent.parent,2).getCurrent()),l(n,4,0,t.Gb(n.parent.parent,2).isFirstPage())},function(l,n){l(n,0,0,t.Gb(n.parent.parent,2).isFirstPage())})}function s(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,5,"a",[["tabindex","0"]],null,[[null,"keyup.enter"],[null,"click"]],function(l,n,e){var a=!0;return"keyup.enter"===n&&(a=!1!==t.Gb(l.parent.parent.parent,2).setCurrent(l.parent.context.$implicit.value)&&a),"click"===n&&(a=!1!==t.Gb(l.parent.parent.parent,2).setCurrent(l.parent.context.$implicit.value)&&a),a},null,null)),(l()(),t.wb(1,0,null,null,1,"span",[["class","show-for-sr"]],null,null,null,null,null)),(l()(),t.Ob(2,null,[""," "])),(l()(),t.wb(3,0,null,null,2,"span",[],null,null,null,null,null)),(l()(),t.Ob(4,null,["",""])),t.Kb(5,2)],null,function(l,n){l(n,2,0,n.component.screenReaderPageLabel);var e="..."===n.parent.context.$implicit.label?n.parent.context.$implicit.label:t.Pb(n,4,0,l(n,5,0,t.Gb(n.parent.parent.parent,0),n.parent.context.$implicit.label,""));l(n,4,0,e)})}function p(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,5,null,null,null,null,null,null,null)),(l()(),t.wb(1,0,null,null,1,"span",[["class","show-for-sr"]],null,null,null,null,null)),(l()(),t.Ob(2,null,[""," "])),(l()(),t.wb(3,0,null,null,2,"span",[],null,null,null,null,null)),(l()(),t.Ob(4,null,["",""])),t.Kb(5,2)],null,function(l,n){l(n,2,0,n.component.screenReaderCurrentLabel);var e="..."===n.parent.context.$implicit.label?n.parent.context.$implicit.label:t.Pb(n,4,0,l(n,5,0,t.Gb(n.parent.parent.parent,0),n.parent.context.$implicit.label,""));l(n,4,0,e)})}function d(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,4,"li",[],[[2,"current",null],[2,"ellipsis",null]],null,null,null,null)),(l()(),t.lb(16777216,null,null,1,null,s)),t.vb(2,16384,null,0,u.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null),(l()(),t.lb(16777216,null,null,1,null,p)),t.vb(4,16384,null,0,u.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null)],function(l,n){l(n,2,0,t.Gb(n.parent.parent,2).getCurrent()!==n.context.$implicit.value),l(n,4,0,t.Gb(n.parent.parent,2).getCurrent()===n.context.$implicit.value)},function(l,n){l(n,0,0,t.Gb(n.parent.parent,2).getCurrent()===n.context.$implicit.value,"..."===n.context.$implicit.label)})}function b(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,3,"a",[["tabindex","0"]],[[1,"aria-label",0]],[[null,"keyup.enter"],[null,"click"]],function(l,n,e){var a=!0;return"keyup.enter"===n&&(a=!1!==t.Gb(l.parent.parent.parent,2).next()&&a),"click"===n&&(a=!1!==t.Gb(l.parent.parent.parent,2).next()&&a),a},null,null)),(l()(),t.Ob(1,null,[" "," "])),(l()(),t.wb(2,0,null,null,1,"span",[["class","show-for-sr"]],null,null,null,null,null)),(l()(),t.Ob(3,null,["",""]))],null,function(l,n){var e=n.component;l(n,0,0,e.nextLabel+" "+e.screenReaderPageLabel),l(n,1,0,e.nextLabel),l(n,3,0,e.screenReaderPageLabel)})}function f(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,3,"span",[],null,null,null,null,null)),(l()(),t.Ob(1,null,[" "," "])),(l()(),t.wb(2,0,null,null,1,"span",[["class","show-for-sr"]],null,null,null,null,null)),(l()(),t.Ob(3,null,["",""]))],null,function(l,n){var e=n.component;l(n,1,0,e.nextLabel),l(n,3,0,e.screenReaderPageLabel)})}function g(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,4,"li",[["class","pagination-next"]],[[2,"disabled",null]],null,null,null,null)),(l()(),t.lb(16777216,null,null,1,null,b)),t.vb(2,16384,null,0,u.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null),(l()(),t.lb(16777216,null,null,1,null,f)),t.vb(4,16384,null,0,u.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null)],function(l,n){l(n,2,0,!t.Gb(n.parent.parent,2).isLastPage()),l(n,4,0,t.Gb(n.parent.parent,2).isLastPage())},function(l,n){l(n,0,0,t.Gb(n.parent.parent,2).isLastPage())})}function h(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,8,"ul",[["class","ngx-pagination"],["role","navigation"]],[[1,"aria-label",0],[2,"responsive",null]],null,null,null,null)),(l()(),t.lb(16777216,null,null,1,null,c)),t.vb(2,16384,null,0,u.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null),(l()(),t.wb(3,0,null,null,1,"li",[["class","small-screen"]],null,null,null,null,null)),(l()(),t.Ob(4,null,[" "," / "," "])),(l()(),t.lb(16777216,null,null,1,null,d)),t.vb(6,278528,null,0,u.k,[t.V,t.S,t.w],{ngForOf:[0,"ngForOf"]},null),(l()(),t.lb(16777216,null,null,1,null,g)),t.vb(8,16384,null,0,u.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null)],function(l,n){var e=n.component;l(n,2,0,e.directionLinks),l(n,6,0,t.Gb(n.parent,2).pages),l(n,8,0,e.directionLinks)},function(l,n){var e=n.component;l(n,0,0,e.screenReaderPaginationLabel,e.responsive),l(n,4,0,t.Gb(n.parent,2).getCurrent(),t.Gb(n.parent,2).getLastPage())})}function v(l){return t.Qb(2,[t.Ib(0,u.e,[t.y]),(l()(),t.wb(1,0,null,null,3,"pagination-template",[],null,[[null,"pageChange"],[null,"pageBoundsCorrection"]],function(l,n,e){var t=!0,a=l.component;return"pageChange"===n&&(t=!1!==a.pageChange.emit(e)&&t),"pageBoundsCorrection"===n&&(t=!1!==a.pageBoundsCorrection.emit(e)&&t),t},null,null)),t.vb(2,737280,[["p",4]],0,a.d,[a.e,t.i],{id:[0,"id"],maxSize:[1,"maxSize"]},{pageChange:"pageChange",pageBoundsCorrection:"pageBoundsCorrection"}),(l()(),t.lb(16777216,null,null,1,null,h)),t.vb(4,16384,null,0,u.l,[t.V,t.S],{ngIf:[0,"ngIf"]},null)],function(l,n){var e=n.component;l(n,2,0,e.id,e.maxSize),l(n,4,0,!(e.autoHide&&t.Gb(n,2).pages.length<=1))},null)}},e1tg:function(l,n,e){"use strict";e.d(n,"a",function(){return s});var t=e("mrSG"),a=e("N+K7"),u=e("AytR"),i=e("H+bZ"),r=e("V+VW"),o=e("eLB9"),c=e("CcnG"),s=function(){function l(l,n,e,t){this.httpService=l,this.apiService=n,this.createLeadDataService=e,this.leadStoreService=t,this.applicantList=this.apiService.api.getApplicantList,this.applicantDetail=this.apiService.api.getApplicantDetail,this.saveUpdateApplicant=this.apiService.api.saveUpdateApplicant,this.softDeleteDetail=this.apiService.api.softDeleteApplicant}return l.prototype.getApplicantList=function(l){var n=u.a.projectIds.salesProjectId,e=this.applicantList.processId,a=this.applicantList.workflowId,i=localStorage.getItem("userId"),r=(this.createLeadDataService.getLeadSectionData(),{projectId:n,processId:e,workflowId:a,ProcessVariables:t.a({},l,{userId:i})});return this.httpService.post(u.a.host+"d/workflows/"+a+"/"+u.a.apiVersion.api+"execute?projectId="+n,r)},l.prototype.getApplicantDetail=function(l){var n=u.a.projectIds.salesProjectId,e=this.applicantDetail.processId,a=this.applicantDetail.workflowId,i=localStorage.getItem("userId"),r={projectId:n,processId:e,workflowId:a,ProcessVariables:t.a({},l,{userId:i})};return this.httpService.post(u.a.host+"d/workflows/"+a+"/"+u.a.apiVersion.api+"execute?projectId="+n,r)},l.prototype.saveApplicant=function(l){var n=u.a.projectIds.salesProjectId,e=this.saveUpdateApplicant.processId,a=this.saveUpdateApplicant.workflowId,i=(localStorage.getItem("email"),localStorage.getItem("userId")),r=this.createLeadDataService.getLeadSectionData().leadId;r=r||this.leadStoreService.getLeadId();var o={processId:e,workflowId:a,projectId:n,ProcessVariables:t.a({userId:i,leadId:r},l)};return this.httpService.post(u.a.host+"d/workflows/"+a+"/"+u.a.apiVersion.api+"execute?projectId="+n,o)},l.prototype.softDeleteApplicant=function(l){var n=this.softDeleteDetail.projectId,e=this.softDeleteDetail.processId,a=this.softDeleteDetail.workflowId,i=(localStorage.getItem("email"),localStorage.getItem("userId")),r={processId:e,workflowId:a,projectId:n,ProcessVariables:t.a({userId:i},l)};return this.httpService.post(u.a.host+"d/workflows/"+a+"/"+u.a.apiVersion.api+"execute?projectId="+n,r)},l.ngInjectableDef=c.Sb({factory:function(){return new l(c.Wb(a.a),c.Wb(i.a),c.Wb(r.a),c.Wb(o.a))},token:l,providedIn:"root"}),l}()},eLB9:function(l,n,e){"use strict";e.d(n,"a",function(){return a});var t=e("CcnG"),a=function(){function l(){}return l.prototype.setLeadId=function(l){this.leadId=l},l.prototype.getLeadId=function(){return this.leadId},l.ngInjectableDef=t.Sb({factory:function(){return new l},token:l,providedIn:"root"}),l}()},m1Ie:function(l,n,e){"use strict";e.d(n,"a",function(){return a}),e("EUG0");var t=e("CcnG"),a=function(){function l(){this.applicantList=[],this.vehicleList=[]}return l.prototype.setLeadCreation=function(l){this.leadCreation=l},l.prototype.getLeadCreation=function(){return this.leadCreation},l.prototype.setSourcingDetails=function(l){this.leadCreation.sourcingDetails=l},l.prototype.getSourcingDetails=function(){return this.leadCreation?this.leadCreation.sourcingDetails:{}},l.prototype.setProductDetails=function(l){this.leadCreation.productDetails=l},l.prototype.getProductDetails=function(){return this.leadCreation?this.leadCreation.productDetails:{}},l.prototype.setVehicleDetails=function(l){this.vehicleList.push(l)},l.prototype.getVehicleDetails=function(){return this.vehicleList},l.prototype.getSelectedVehicle=function(l){return this.vehicleList[l]},l.prototype.updateVehicle=function(l,n){this.vehicleList[l]=n},l.prototype.deleteVehicle=function(l){this.vehicleList.splice(l,1)},l.prototype.setLoanDetails=function(l){this.leadCreation.loanDetails=l},l.prototype.getLoanDetails=function(){return this.leadCreation.loanDetails},l.prototype.setCoApplicantDetails=function(l){this.applicantList.push(l)},l.prototype.getSelectedApplicant=function(l){return this.applicantList[l]},l.prototype.updateApplicant=function(l,n){this.applicantList[l]=n},l.prototype.deleteApplicant=function(l){this.applicantList.splice(l,1)},l.prototype.getApplicantList=function(){return this.applicantList},l.prototype.setDedupeData=function(l){this.leadDedupeData=l},l.prototype.getDedupeData=function(){return this.leadDedupeData},l.ngInjectableDef=t.Sb({factory:function(){return new l},token:l,providedIn:"root"}),l}()}}]);