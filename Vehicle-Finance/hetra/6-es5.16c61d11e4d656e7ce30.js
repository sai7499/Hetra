(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{GGN0:function(l,n,u){"use strict";u.r(n);var t=u("CcnG"),e=function(){return function(){}}(),a=u("pMnS"),o=u("ZYCi"),i=u("5pZN"),s=u("V+VW"),c=function(){function l(l,n,u){this.labelsData=l,this.createLeadDataService=n,this.router=u,this.labels={}}return l.prototype.ngOnInit=function(){var l=this;this.labelsData.getLabelsData().subscribe(function(n){l.labels=n},function(l){console.log(l)}),this.leadId=this.getLeadId()},l.prototype.getLeadId=function(){return this.createLeadDataService.getLeadSectionData().leadId},l.prototype.navigateToSales=function(){this.router.navigateByUrl("/pages/sales/"+this.leadId+"/lead-details")},l}(),r=t.ub({encapsulation:0,styles:[[".cus-offer-cred[_ngcontent-%COMP%]{margin:10px 0}.text-center[_ngcontent-%COMP%]{text-align:center}.box_shadow[_ngcontent-%COMP%]{box-shadow:0 8px 6px -9px #000}.img-container[_ngcontent-%COMP%]{margin-left:auto;margin-right:auto;display:block}.modal_title[_ngcontent-%COMP%]{font-size:16px;font-family:fantasy;text-align:center;color:#1d1a4b;font-weight:700}.modal_content[_ngcontent-%COMP%]{font-size:18px;font-family:fantasy;text-align:center;color:#494e50}.modal-body[_ngcontent-%COMP%]{text-align:center}.modal-body.modal_coapp[_ngcontent-%COMP%]{text-align:left!important}#credit_score_tag10[_ngcontent-%COMP%]{margin-top:10px}#row1[_ngcontent-%COMP%], #row2[_ngcontent-%COMP%], #row3[_ngcontent-%COMP%]{margin-left:-20px}#col[_ngcontent-%COMP%]{padding-top:10px}#col1[_ngcontent-%COMP%]{padding-top:13px}#col2[_ngcontent-%COMP%]{padding-top:7px}#sales_credit_score[_ngcontent-%COMP%]{padding:10px}.margin_zero[_ngcontent-%COMP%]{margin-top:0}.content[_ngcontent-%COMP%]{margin-bottom:50px}li[_ngcontent-%COMP%]{line-height:30px;font-weight:500}#termsnconditions[_ngcontent-%COMP%]{margin-top:-20px}"]],data:{}});function d(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,93,"div",[["class","mar-top90"]],null,null,null,null,null)),(l()(),t.wb(1,0,null,null,85,"div",[["class","container-fluid"]],null,null,null,null,null)),(l()(),t.wb(2,0,null,null,84,"div",[["class","content"]],null,null,null,null,null)),(l()(),t.wb(3,0,null,null,51,"div",[["class","col-12"]],null,null,null,null,null)),(l()(),t.wb(4,0,null,null,1,"h3",[["class","margin_zero"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,["In Principle Offer"])),(l()(),t.wb(6,0,null,null,0,"hr",[],null,null,null,null,null)),(l()(),t.wb(7,0,null,null,32,"div",[["class","container-fluid"],["id","sales_credit_score"]],null,null,null,null,null)),(l()(),t.wb(8,0,null,null,28,"div",[["class","row"],["id","sales_credit_score_sec"]],null,null,null,null,null)),(l()(),t.wb(9,0,null,null,10,"div",[["class","col-lg-4"]],null,null,null,null,null)),(l()(),t.wb(10,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.wb(11,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Ob(-1,null,["Product Offered"])),(l()(),t.wb(13,0,null,null,1,"span",[["id","credit_score_tag1"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,["Used CV"])),(l()(),t.wb(15,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.wb(16,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Ob(-1,null,["Customer Segment"])),(l()(),t.wb(18,0,null,null,1,"span",[["id","credit_score_tag2"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,["Salaried"])),(l()(),t.wb(20,0,null,null,5,"div",[["class","col-lg-4"]],null,null,null,null,null)),(l()(),t.wb(21,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.wb(22,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Ob(-1,null,["Requested Loan Amount"])),(l()(),t.wb(24,0,null,null,1,"span",[["id","credit_score_tag4"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,["1000000"])),(l()(),t.wb(26,0,null,null,10,"div",[["class","col-lg-4"]],null,null,null,null,null)),(l()(),t.wb(27,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.wb(28,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Ob(-1,null,["Loan Tenor"])),(l()(),t.wb(30,0,null,null,1,"span",[["id","credit_score_tag3"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,["24 Months"])),(l()(),t.wb(32,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.wb(33,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Ob(-1,null,["Age of the car at the end of tenor"])),(l()(),t.wb(35,0,null,null,1,"span",[["id","credit_score_tag5"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,[" 60 Months"])),(l()(),t.wb(37,0,null,null,1,"p",[["class","text-center"],["id","credit_score_tag10"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,[" Eligible Loan Amount : 1000000 "])),(l()(),t.wb(39,0,null,null,0,"hr",[],null,null,null,null,null)),(l()(),t.wb(40,0,null,null,8,"div",[["id","termsnconditions"]],null,null,null,null,null)),(l()(),t.wb(41,0,null,null,2,"h4",[],null,null,null,null,null)),(l()(),t.wb(42,0,null,null,1,"b",[],null,null,null,null,null)),(l()(),t.Ob(-1,null,["Disclaimer"])),(l()(),t.wb(44,0,null,null,4,"ul",[],null,null,null,null,null)),(l()(),t.wb(45,0,null,null,1,"li",[],null,null,null,null,null)),(l()(),t.Ob(-1,null,[" I / We declare that all the particulars and information given in the application form are true, correct, complete and up to date in all respects and I / we have not with-held any information whatsoever. 1/We confirm that I /We have no insolvency proceeding initiated against me/us nor have 1/we have ever been adjudicated insolvent / bankrupt. I /We have read the application from and brochures and are agreeable to all the terms /conditions of availing financial assistance from bank / Its Group Companies/its agents to make references and enquiries relevant to information in this application form which Equitas/its Group companies/its Agents consider necessary'. 1/we undertake to inform Equitas/group companies/its Agents regarding the change in the residential addresses to provide any further information that that Equitas/its Group Companies/its Agents may require "])),(l()(),t.wb(47,0,null,null,1,"li",[],null,null,null,null,null)),(l()(),t.Ob(-1,null,[" I/We further declare and confirm that the credit facilities/ financial assistance if any enjoyed by me/us with other banks has been disclosed herein above. I/We declare the we have read the application form and brochure and are agreeable to the terms/ conditions of availing the credit facilities/financial assistance mentioned herein from Equitas. "])),(l()(),t.wb(49,0,null,null,5,"div",[["class","row"]],null,null,null,null,null)),(l()(),t.wb(50,0,null,null,4,"div",[["class","button submit_button text-center"]],null,null,null,null,null)),(l()(),t.wb(51,0,null,null,1,"button",[["class","btn btn-success mar-right8"],["data-target","#myModal"],["data-toggle","modal"],["type","button"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,[" Customer Accpeted Offer "])),(l()(),t.wb(53,0,null,null,1,"button",[["class","btn btn-danger"],["data-target","#myModal_cancel"],["data-toggle","modal"],["type","button"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,[" Customer Rejected Offer "])),(l()(),t.wb(55,0,null,null,15,"div",[["class","modal"],["id","myModal"]],null,null,null,null,null)),(l()(),t.wb(56,0,null,null,14,"div",[["class","modal-dialog"]],null,null,null,null,null)),(l()(),t.wb(57,0,null,null,13,"div",[["class","modal-content"]],null,null,null,null,null)),(l()(),t.wb(58,0,null,null,4,"div",[["class","modal-header"]],null,null,null,null,null)),(l()(),t.wb(59,0,null,null,1,"h4",[["class","modal-title text-center"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,[" Congrats! You have got a prospective lead "])),(l()(),t.wb(61,0,null,null,1,"button",[["class","close"],["data-dismiss","modal"],["type","button"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,[" \xd7 "])),(l()(),t.wb(63,0,null,null,4,"div",[["class","modal-body"]],null,null,null,null,null)),(l()(),t.wb(64,0,null,null,1,"span",[["class","img-container"]],null,null,null,null,null)),(l()(),t.wb(65,0,null,null,0,"img",[["src","/assets/images/tick-mark.png"],["width","90px;"]],null,null,null,null,null)),(l()(),t.wb(66,0,null,null,1,"p",[["id","model_p_size"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,[" Please proceed to collect additional details "])),(l()(),t.wb(68,0,null,null,2,"div",[["class","modal-footer text-center"]],null,null,null,null,null)),(l()(),t.wb(69,0,null,null,1,"button",[["class","btn btn-success"],["data-dismiss","modal"],["id","ok_co_applicant"],["type","button"]],null,[[null,"click"]],function(l,n,u){var t=!0;return"click"===n&&(t=!1!==l.component.navigateToSales()&&t),t},null,null)),(l()(),t.Ob(-1,null,[" OK "])),(l()(),t.wb(71,0,null,null,15,"div",[["class","modal"],["id","myModal_cancel"]],null,null,null,null,null)),(l()(),t.wb(72,0,null,null,14,"div",[["class","modal-dialog"]],null,null,null,null,null)),(l()(),t.wb(73,0,null,null,13,"div",[["class","modal-content"]],null,null,null,null,null)),(l()(),t.wb(74,0,null,null,4,"div",[["class","modal-header"]],null,null,null,null,null)),(l()(),t.wb(75,0,null,null,1,"h4",[["class","modal-title text-center"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,[" Oops! You have lost a lead "])),(l()(),t.wb(77,0,null,null,1,"button",[["class","close"],["data-dismiss","modal"],["type","button"]],null,null,null,null,null)),(l()(),t.Ob(-1,null,[" \xd7 "])),(l()(),t.wb(79,0,null,null,2,"div",[["class","modal-body"]],null,null,null,null,null)),(l()(),t.wb(80,0,null,null,1,"span",[["class","img-container"]],null,null,null,null,null)),(l()(),t.wb(81,0,null,null,0,"img",[["src","/assets/images/wrong.png"],["width","90px;"]],null,null,null,null,null)),(l()(),t.wb(82,0,null,null,4,"div",[["class","modal-footer text-center"]],null,null,null,null,null)),(l()(),t.wb(83,0,null,null,3,"button",[["class","btn btn-danger"],["data-dismiss","modal"],["id","ok_co_applicant"],["type","button"]],null,[[null,"click"]],function(l,n,u){var e=!0;return"click"===n&&(e=!1!==t.Gb(l,84).onClick()&&e),e},null,null)),t.vb(84,16384,null,0,o.p,[o.o,o.a,[8,null],t.K,t.n],{routerLink:[0,"routerLink"]},null),t.Hb(85,1),(l()(),t.Ob(-1,null,[" Reject "])),(l()(),t.wb(87,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t.wb(88,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t.wb(89,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t.wb(90,0,null,null,3,"footer",[["class","footer pf"]],null,null,null,null,null)),(l()(),t.wb(91,0,null,null,2,"div",[["class","container"]],null,null,null,null,null)),(l()(),t.wb(92,0,null,null,1,"p",[],null,null,null,null,null)),(l()(),t.Ob(-1,null,["\xa9 Equitas Small Finance Bank Limited. All Rights Reserved."]))],function(l,n){var u=l(n,85,0,"/activity-search");l(n,84,0,u)},null)}function b(l){return t.Qb(0,[(l()(),t.wb(0,0,null,null,1,"app-terms-conditions",[],null,null,null,d,r)),t.vb(1,114688,null,0,c,[i.a,s.a,o.o],null,null)],function(l,n){l(n,1,0)},null)}var p=t.sb("app-terms-conditions",c,b,{},{},[]),g=u("gIcY"),m=u("Ip0R"),w=function(){return function(){}}();u.d(n,"TermsConditionsModuleNgFactory",function(){return h});var h=t.tb(e,[],function(l){return t.Db([t.Eb(512,t.l,t.gb,[[8,[a.a,p]],[3,t.l],t.B]),t.Eb(4608,g.D,g.D,[]),t.Eb(4608,m.n,m.m,[t.y,[2,m.x]]),t.Eb(1073742336,g.C,g.C,[]),t.Eb(1073742336,g.m,g.m,[]),t.Eb(1073742336,m.b,m.b,[]),t.Eb(1073742336,o.s,o.s,[[2,o.x],[2,o.o]]),t.Eb(1073742336,w,w,[]),t.Eb(1073742336,e,e,[]),t.Eb(1024,o.m,function(){return[[{path:"",component:c}]]},[])])})},"V+VW":function(l,n,u){"use strict";u.d(n,"a",function(){return e});var t=u("CcnG"),e=function(){function l(){this.leadData={},this.leadSectionData={},this.proceedAsNewLeadData={},this.proceedWithSelectedLead={}}return l.prototype.setLeadData=function(l,n){this.leadData={loanLeadDetails:l,applicantDetails:n}},l.prototype.getLeadData=function(){return this.leadData},l.prototype.setLeadSectionData=function(l){this.leadSectionData=l},l.prototype.getLeadSectionData=function(){return this.leadSectionData},l.prototype.setProceedAsNewLead=function(l){this.proceedAsNewLeadData=l},l.prototype.getProceedAsNewLead=function(){return this.proceedAsNewLeadData},l.prototype.setProceedWithSelectedLead=function(l){this.proceedWithSelectedLead=l},l.prototype.getProceedWithSelectedLead=function(){return this.proceedWithSelectedLead},l.ngInjectableDef=t.Sb({factory:function(){return new l},token:l,providedIn:"root"}),l}()}}]);