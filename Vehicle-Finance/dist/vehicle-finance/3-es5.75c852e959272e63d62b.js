(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{"5pZN":function(l,n,u){"use strict";u.d(n,"a",function(){return a});var t=u("CcnG"),e=u("t/Na"),a=function(){function l(l){this.http=l,this.labelsurl="assets/labels/labels.json",this.labelDDEsurl="assets/labels/label_credit_vehicle_details.json",this.labelFleetUrl="assets/labels/labelFleetDetails.json",this.languageLabelsurl="assets/labels/labels-hindi.json"}return l.prototype.getLabelsData=function(){return this.http.get(this.labelsurl)},l.prototype.getLabelsOfDDEData=function(){return this.http.get(this.labelDDEsurl)},l.prototype.getLabelsFleetData=function(){return this.http.get(this.labelFleetUrl)},l.prototype.getLanguageLabelData=function(){return this.http.get(this.languageLabelsurl)},l.ngInjectableDef=t.Ob({factory:function(){return new l(t.Sb(e.c))},token:l,providedIn:"root"}),l}()},GGN0:function(l,n,u){"use strict";u.r(n);var t=u("CcnG"),e=function(){return function(){}}(),a=u("pMnS"),o=u("ZYCi"),i=u("5pZN"),s=function(){function l(l){this.labelsData=l,this.labels={}}return l.prototype.ngOnInit=function(){var l=this;this.labelsData.getLabelsData().subscribe(function(n){l.labels=n},function(l){console.log(l)})},l}(),r=t.sb({encapsulation:0,styles:[[".cus-offer-cred[_ngcontent-%COMP%]{margin:10px 0}.text-center[_ngcontent-%COMP%]{text-align:center}.box_shadow[_ngcontent-%COMP%]{box-shadow:0 8px 6px -9px #000}.img-container[_ngcontent-%COMP%]{margin-left:auto;margin-right:auto;display:block}.modal_title[_ngcontent-%COMP%]{font-size:16px;font-family:fantasy;text-align:center;color:#1d1a4b;font-weight:700}.modal_content[_ngcontent-%COMP%]{font-size:18px;font-family:fantasy;text-align:center;color:#494e50}.modal-body[_ngcontent-%COMP%]{text-align:center}.modal-body.modal_coapp[_ngcontent-%COMP%]{text-align:left!important}#credit_score_tag10[_ngcontent-%COMP%]{margin-top:10px}#row1[_ngcontent-%COMP%], #row2[_ngcontent-%COMP%], #row3[_ngcontent-%COMP%]{margin-left:-20px}#col[_ngcontent-%COMP%]{padding-top:10px}#col1[_ngcontent-%COMP%]{padding-top:13px}#col2[_ngcontent-%COMP%]{padding-top:7px}#sales_credit_score[_ngcontent-%COMP%]{padding:10px}"]],data:{}});function c(l){return t.Mb(0,[(l()(),t.ub(0,0,null,null,93,"div",[["class","mar-top90"]],null,null,null,null,null)),(l()(),t.ub(1,0,null,null,85,"div",[["class","container overflow-hidden"]],null,null,null,null,null)),(l()(),t.ub(2,0,null,null,84,"div",[["class","content"]],null,null,null,null,null)),(l()(),t.ub(3,0,null,null,51,"div",[["class","col-12"]],null,null,null,null,null)),(l()(),t.ub(4,0,null,null,1,"h3",[["class","margin_zero"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["In Principle Offer"])),(l()(),t.ub(6,0,null,null,0,"hr",[],null,null,null,null,null)),(l()(),t.ub(7,0,null,null,32,"div",[["class","container"],["id","sales_credit_score"]],null,null,null,null,null)),(l()(),t.ub(8,0,null,null,28,"div",[["class","row"],["id","sales_credit_score_sec"]],null,null,null,null,null)),(l()(),t.ub(9,0,null,null,10,"div",[["class","col-lg-4"]],null,null,null,null,null)),(l()(),t.ub(10,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.ub(11,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Product Offered"])),(l()(),t.ub(13,0,null,null,1,"span",[["id","credit_score_tag1"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Used CV"])),(l()(),t.ub(15,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.ub(16,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Customer Segment"])),(l()(),t.ub(18,0,null,null,1,"span",[["id","credit_score_tag2"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Salaried"])),(l()(),t.ub(20,0,null,null,5,"div",[["class","col-lg-4"]],null,null,null,null,null)),(l()(),t.ub(21,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.ub(22,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Requested Loan Amount"])),(l()(),t.ub(24,0,null,null,1,"span",[["id","credit_score_tag4"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["1000000"])),(l()(),t.ub(26,0,null,null,10,"div",[["class","col-lg-4"]],null,null,null,null,null)),(l()(),t.ub(27,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.ub(28,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Loan Tenor"])),(l()(),t.ub(30,0,null,null,1,"span",[["id","credit_score_tag3"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["24 Months"])),(l()(),t.ub(32,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.ub(33,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Age of the car at the end of tenor"])),(l()(),t.ub(35,0,null,null,1,"span",[["id","credit_score_tag5"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,[" 60 Months"])),(l()(),t.ub(37,0,null,null,1,"p",[["class","text-center"],["id","credit_score_tag10"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Eligible Loan Amount : 1000000"])),(l()(),t.ub(39,0,null,null,0,"hr",[],null,null,null,null,null)),(l()(),t.ub(40,0,null,null,8,"div",[["id","termsnconditions"]],null,null,null,null,null)),(l()(),t.ub(41,0,null,null,2,"h4",[],null,null,null,null,null)),(l()(),t.ub(42,0,null,null,1,"b",[],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Disclaimer"])),(l()(),t.ub(44,0,null,null,4,"ul",[],null,null,null,null,null)),(l()(),t.ub(45,0,null,null,1,"li",[],null,null,null,null,null)),(l()(),t.Kb(-1,null,["I / We declare that all the particulars and information given in the application form are true, correct, complete and up to date in all respects and I / we have not with-held any information whatsoever. 1/We confirm that I /We have no insolvency proceeding initiated against me/us nor have 1/we have ever been adjudicated insolvent / bankrupt. I /We have read the application from and brochures and are agreeable to all the terms /conditions of availing financial assistance from bank / Its Group Companies/its agents to make references and enquiries relevant to information in this application form which Equitas/its Group companies/its Agents consider necessary'. 1/we undertake to inform Equitas/group companies/its Agents regarding the change in the residential addresses to provide any further information that that Equitas/its Group Companies/its Agents may require "])),(l()(),t.ub(47,0,null,null,1,"li",[],null,null,null,null,null)),(l()(),t.Kb(-1,null,[" I/We further declare and confirm that the credit facilities/ financial assistance if any enjoyed by me/us with other banks has been disclosed herein above. I/We declare the we have read the application form and brochure and are agreeable to the terms/ conditions of availing the credit facilities/financial assistance mentioned herein from Equitas. "])),(l()(),t.ub(49,0,null,null,5,"div",[["class","row"]],null,null,null,null,null)),(l()(),t.ub(50,0,null,null,4,"div",[["class","button submit_button text-center"]],null,null,null,null,null)),(l()(),t.ub(51,0,null,null,1,"button",[["class","btn btn-success mar-right8"],["data-target","#myModal"],["data-toggle","modal"],["type","button"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Customer Accpeted Offer"])),(l()(),t.ub(53,0,null,null,1,"button",[["class","btn btn-danger"],["data-target","#myModal_cancel"],["data-toggle","modal"],["type","button"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Customer Rejected Offer"])),(l()(),t.ub(55,0,null,null,15,"div",[["class","modal"],["id","myModal"]],null,null,null,null,null)),(l()(),t.ub(56,0,null,null,14,"div",[["class","modal-dialog"]],null,null,null,null,null)),(l()(),t.ub(57,0,null,null,13,"div",[["class","modal-content"]],null,null,null,null,null)),(l()(),t.ub(58,0,null,null,4,"div",[["class","modal-header"]],null,null,null,null,null)),(l()(),t.ub(59,0,null,null,1,"h4",[["class","modal-title text-center"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Congrats! You have got a prospective lead"])),(l()(),t.ub(61,0,null,null,1,"button",[["class","close"],["data-dismiss","modal"],["type","button"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["\xd7"])),(l()(),t.ub(63,0,null,null,4,"div",[["class","modal-body"]],null,null,null,null,null)),(l()(),t.ub(64,0,null,null,1,"span",[["class","img-container"]],null,null,null,null,null)),(l()(),t.ub(65,0,null,null,0,"img",[["src","/assets/images/tick-mark.png"],["width","90px;"]],null,null,null,null,null)),(l()(),t.ub(66,0,null,null,1,"p",[["id","model_p_size"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Please proceed to collect additional details"])),(l()(),t.ub(68,0,null,null,2,"div",[["class","modal-footer text-center"]],null,null,null,null,null)),(l()(),t.ub(69,0,null,null,1,"button",[["class","btn btn-success"],["data-dismiss","modal"],["id","ok_co_applicant"],["type","button"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["OK"])),(l()(),t.ub(71,0,null,null,15,"div",[["class","modal"],["id","myModal_cancel"]],null,null,null,null,null)),(l()(),t.ub(72,0,null,null,14,"div",[["class","modal-dialog"]],null,null,null,null,null)),(l()(),t.ub(73,0,null,null,13,"div",[["class","modal-content"]],null,null,null,null,null)),(l()(),t.ub(74,0,null,null,4,"div",[["class","modal-header"]],null,null,null,null,null)),(l()(),t.ub(75,0,null,null,1,"h4",[["class","modal-title text-center"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["Oops! You have lost a lead"])),(l()(),t.ub(77,0,null,null,1,"button",[["class","close"],["data-dismiss","modal"],["type","button"]],null,null,null,null,null)),(l()(),t.Kb(-1,null,["\xd7"])),(l()(),t.ub(79,0,null,null,2,"div",[["class","modal-body"]],null,null,null,null,null)),(l()(),t.ub(80,0,null,null,1,"span",[["class","img-container"]],null,null,null,null,null)),(l()(),t.ub(81,0,null,null,0,"img",[["src","/assets/images/wrong.png"],["width","90px;"]],null,null,null,null,null)),(l()(),t.ub(82,0,null,null,4,"div",[["class","modal-footer text-center"]],null,null,null,null,null)),(l()(),t.ub(83,0,null,null,3,"button",[["class","btn btn-danger"],["data-dismiss","modal"],["id","ok_co_applicant"],["type","button"]],null,[[null,"click"]],function(l,n,u){var e=!0;return"click"===n&&(e=!1!==t.Db(l,84).onClick()&&e),e},null,null)),t.tb(84,16384,null,0,o.m,[o.l,o.a,[8,null],t.I,t.n],{routerLink:[0,"routerLink"]},null),t.Eb(85,1),(l()(),t.Kb(-1,null,["Reject"])),(l()(),t.ub(87,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t.ub(88,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t.ub(89,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t.ub(90,0,null,null,3,"footer",[["class","footer pf"]],null,null,null,null,null)),(l()(),t.ub(91,0,null,null,2,"div",[["class","container"]],null,null,null,null,null)),(l()(),t.ub(92,0,null,null,1,"p",[],null,null,null,null,null)),(l()(),t.Kb(-1,null,["\xa9 Equitas Small Finance Bank Limited. All Rights Reserved."]))],function(l,n){var u=l(n,85,0,"/activity-search");l(n,84,0,u)},null)}function b(l){return t.Mb(0,[(l()(),t.ub(0,0,null,null,1,"app-terms-conditions",[],null,null,null,c,r)),t.tb(1,114688,null,0,s,[i.a],null,null)],function(l,n){l(n,1,0)},null)}var d=t.qb("app-terms-conditions",s,b,{},{},[]),p=u("gIcY"),g=u("Ip0R"),m=function(){return function(){}}();u.d(n,"TermsConditionsModuleNgFactory",function(){return h});var h=t.rb(e,[],function(l){return t.Bb([t.Cb(512,t.l,t.eb,[[8,[a.a,d]],[3,t.l],t.A]),t.Cb(4608,p.B,p.B,[]),t.Cb(4608,g.m,g.l,[t.x,[2,g.u]]),t.Cb(1073742336,p.A,p.A,[]),t.Cb(1073742336,p.l,p.l,[]),t.Cb(1073742336,g.b,g.b,[]),t.Cb(1073742336,o.o,o.o,[[2,o.t],[2,o.l]]),t.Cb(1073742336,m,m,[]),t.Cb(1073742336,e,e,[]),t.Cb(1024,o.j,function(){return[[{path:"",component:s}]]},[])])})}}]);