(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{"5pZN":function(l,n,u){"use strict";u.d(n,"a",function(){return a});var t=u("8Y7J"),e=u("IheW");const a=(()=>{class l{constructor(l){this.http=l,this.labelsurl="assets/labels/labels.json",this.labelDDEsurl="assets/labels/label_credit_vehicle_details.json",this.labelFleetUrl="assets/labels/labelFleetDetails.json",this.languageLabelsurl="assets/labels/labels-hindi.json"}getLabelsData(){return this.http.get(this.labelsurl)}getLabelsOfDDEData(){return this.http.get(this.labelDDEsurl)}getLabelsFleetData(){return this.http.get(this.labelFleetUrl)}getLanguageLabelData(){return this.http.get(this.languageLabelsurl)}}return l.ngInjectableDef=t.Nb({factory:function(){return new l(t.Rb(e.c))},token:l,providedIn:"root"}),l})()},GGN0:function(l,n,u){"use strict";u.r(n);var t=u("8Y7J");class e{}var a=u("pMnS"),s=u("iInd"),i=u("5pZN");class o{constructor(l){this.labelsData=l,this.labels={}}ngOnInit(){this.labelsData.getLabelsData().subscribe(l=>{this.labels=l},l=>{console.log(l)})}}var r=t.rb({encapsulation:0,styles:[[".cus-offer-cred[_ngcontent-%COMP%]{margin:10px 0}.text-center[_ngcontent-%COMP%]{text-align:center}.box_shadow[_ngcontent-%COMP%]{box-shadow:0 8px 6px -9px #000}.img-container[_ngcontent-%COMP%]{margin-left:auto;margin-right:auto;display:block}.modal_title[_ngcontent-%COMP%]{font-size:16px;font-family:fantasy;text-align:center;color:#1d1a4b;font-weight:700}.modal_content[_ngcontent-%COMP%]{font-size:18px;font-family:fantasy;text-align:center;color:#494e50}.modal-body[_ngcontent-%COMP%]{text-align:center}.modal-body.modal_coapp[_ngcontent-%COMP%]{text-align:left!important}#credit_score_tag10[_ngcontent-%COMP%]{margin-top:10px}#row1[_ngcontent-%COMP%], #row2[_ngcontent-%COMP%], #row3[_ngcontent-%COMP%]{margin-left:-20px}#col[_ngcontent-%COMP%]{padding-top:10px}#col1[_ngcontent-%COMP%]{padding-top:13px}#col2[_ngcontent-%COMP%]{padding-top:7px}#sales_credit_score[_ngcontent-%COMP%]{padding:10px}"]],data:{}});function c(l){return t.Lb(0,[(l()(),t.tb(0,0,null,null,93,"div",[["class","mar-top90"]],null,null,null,null,null)),(l()(),t.tb(1,0,null,null,85,"div",[["class","container overflow-hidden"]],null,null,null,null,null)),(l()(),t.tb(2,0,null,null,84,"div",[["class","content"]],null,null,null,null,null)),(l()(),t.tb(3,0,null,null,51,"div",[["class","col-12"]],null,null,null,null,null)),(l()(),t.tb(4,0,null,null,1,"h3",[["class","margin_zero"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["In Principle Offer"])),(l()(),t.tb(6,0,null,null,0,"hr",[],null,null,null,null,null)),(l()(),t.tb(7,0,null,null,32,"div",[["class","container"],["id","sales_credit_score"]],null,null,null,null,null)),(l()(),t.tb(8,0,null,null,28,"div",[["class","row"],["id","sales_credit_score_sec"]],null,null,null,null,null)),(l()(),t.tb(9,0,null,null,10,"div",[["class","col-lg-4"]],null,null,null,null,null)),(l()(),t.tb(10,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.tb(11,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Product Offered"])),(l()(),t.tb(13,0,null,null,1,"span",[["id","credit_score_tag1"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Used CV"])),(l()(),t.tb(15,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.tb(16,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Customer Segment"])),(l()(),t.tb(18,0,null,null,1,"span",[["id","credit_score_tag2"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Salaried"])),(l()(),t.tb(20,0,null,null,5,"div",[["class","col-lg-4"]],null,null,null,null,null)),(l()(),t.tb(21,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.tb(22,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Requested Loan Amount"])),(l()(),t.tb(24,0,null,null,1,"span",[["id","credit_score_tag4"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["1000000"])),(l()(),t.tb(26,0,null,null,10,"div",[["class","col-lg-4"]],null,null,null,null,null)),(l()(),t.tb(27,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.tb(28,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Loan Tenor"])),(l()(),t.tb(30,0,null,null,1,"span",[["id","credit_score_tag3"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["24 Months"])),(l()(),t.tb(32,0,null,null,4,"p",[["id",""]],null,null,null,null,null)),(l()(),t.tb(33,0,null,null,1,"span",[["id",""]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Age of the car at the end of tenor"])),(l()(),t.tb(35,0,null,null,1,"span",[["id","credit_score_tag5"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,[" 60 Months"])),(l()(),t.tb(37,0,null,null,1,"p",[["class","text-center"],["id","credit_score_tag10"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Eligible Loan Amount : 1000000"])),(l()(),t.tb(39,0,null,null,0,"hr",[],null,null,null,null,null)),(l()(),t.tb(40,0,null,null,8,"div",[["id","termsnconditions"]],null,null,null,null,null)),(l()(),t.tb(41,0,null,null,2,"h4",[],null,null,null,null,null)),(l()(),t.tb(42,0,null,null,1,"b",[],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Disclaimer"])),(l()(),t.tb(44,0,null,null,4,"ul",[],null,null,null,null,null)),(l()(),t.tb(45,0,null,null,1,"li",[],null,null,null,null,null)),(l()(),t.Jb(-1,null,["I / We declare that all the particulars and information given in the application form are true, correct, complete and up to date in all respects and I / we have not with-held any information whatsoever. 1/We confirm that I /We have no insolvency proceeding initiated against me/us nor have 1/we have ever been adjudicated insolvent / bankrupt. I /We have read the application from and brochures and are agreeable to all the terms /conditions of availing financial assistance from bank / Its Group Companies/its agents to make references and enquiries relevant to information in this application form which Equitas/its Group companies/its Agents consider necessary'. 1/we undertake to inform Equitas/group companies/its Agents regarding the change in the residential addresses to provide any further information that that Equitas/its Group Companies/its Agents may require "])),(l()(),t.tb(47,0,null,null,1,"li",[],null,null,null,null,null)),(l()(),t.Jb(-1,null,[" I/We further declare and confirm that the credit facilities/ financial assistance if any enjoyed by me/us with other banks has been disclosed herein above. I/We declare the we have read the application form and brochure and are agreeable to the terms/ conditions of availing the credit facilities/financial assistance mentioned herein from Equitas. "])),(l()(),t.tb(49,0,null,null,5,"div",[["class","row"]],null,null,null,null,null)),(l()(),t.tb(50,0,null,null,4,"div",[["class","button submit_button text-center"]],null,null,null,null,null)),(l()(),t.tb(51,0,null,null,1,"button",[["class","btn btn-success mar-right8"],["data-target","#myModal"],["data-toggle","modal"],["type","button"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Customer Accpeted Offer"])),(l()(),t.tb(53,0,null,null,1,"button",[["class","btn btn-danger"],["data-target","#myModal_cancel"],["data-toggle","modal"],["type","button"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Customer Rejected Offer"])),(l()(),t.tb(55,0,null,null,15,"div",[["class","modal"],["id","myModal"]],null,null,null,null,null)),(l()(),t.tb(56,0,null,null,14,"div",[["class","modal-dialog"]],null,null,null,null,null)),(l()(),t.tb(57,0,null,null,13,"div",[["class","modal-content"]],null,null,null,null,null)),(l()(),t.tb(58,0,null,null,4,"div",[["class","modal-header"]],null,null,null,null,null)),(l()(),t.tb(59,0,null,null,1,"h4",[["class","modal-title text-center"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Congrats! You have got a prospective lead"])),(l()(),t.tb(61,0,null,null,1,"button",[["class","close"],["data-dismiss","modal"],["type","button"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["\xd7"])),(l()(),t.tb(63,0,null,null,4,"div",[["class","modal-body"]],null,null,null,null,null)),(l()(),t.tb(64,0,null,null,1,"span",[["class","img-container"]],null,null,null,null,null)),(l()(),t.tb(65,0,null,null,0,"img",[["src","/assets/images/tick-mark.png"],["width","90px;"]],null,null,null,null,null)),(l()(),t.tb(66,0,null,null,1,"p",[["id","model_p_size"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Please proceed to collect additional details"])),(l()(),t.tb(68,0,null,null,2,"div",[["class","modal-footer text-center"]],null,null,null,null,null)),(l()(),t.tb(69,0,null,null,1,"button",[["class","btn btn-success"],["data-dismiss","modal"],["id","ok_co_applicant"],["type","button"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["OK"])),(l()(),t.tb(71,0,null,null,15,"div",[["class","modal"],["id","myModal_cancel"]],null,null,null,null,null)),(l()(),t.tb(72,0,null,null,14,"div",[["class","modal-dialog"]],null,null,null,null,null)),(l()(),t.tb(73,0,null,null,13,"div",[["class","modal-content"]],null,null,null,null,null)),(l()(),t.tb(74,0,null,null,4,"div",[["class","modal-header"]],null,null,null,null,null)),(l()(),t.tb(75,0,null,null,1,"h4",[["class","modal-title text-center"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["Oops! You have lost a lead"])),(l()(),t.tb(77,0,null,null,1,"button",[["class","close"],["data-dismiss","modal"],["type","button"]],null,null,null,null,null)),(l()(),t.Jb(-1,null,["\xd7"])),(l()(),t.tb(79,0,null,null,2,"div",[["class","modal-body"]],null,null,null,null,null)),(l()(),t.tb(80,0,null,null,1,"span",[["class","img-container"]],null,null,null,null,null)),(l()(),t.tb(81,0,null,null,0,"img",[["src","/assets/images/wrong.png"],["width","90px;"]],null,null,null,null,null)),(l()(),t.tb(82,0,null,null,4,"div",[["class","modal-footer text-center"]],null,null,null,null,null)),(l()(),t.tb(83,0,null,null,3,"button",[["class","btn btn-danger"],["data-dismiss","modal"],["id","ok_co_applicant"],["type","button"]],null,[[null,"click"]],function(l,n,u){var e=!0;return"click"===n&&(e=!1!==t.Cb(l,84).onClick()&&e),e},null,null)),t.sb(84,16384,null,0,s.m,[s.l,s.a,[8,null],t.H,t.n],{routerLink:[0,"routerLink"]},null),t.Db(85,1),(l()(),t.Jb(-1,null,["Reject"])),(l()(),t.tb(87,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t.tb(88,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t.tb(89,0,null,null,0,"br",[],null,null,null,null,null)),(l()(),t.tb(90,0,null,null,3,"footer",[["class","footer pf"]],null,null,null,null,null)),(l()(),t.tb(91,0,null,null,2,"div",[["class","container"]],null,null,null,null,null)),(l()(),t.tb(92,0,null,null,1,"p",[],null,null,null,null,null)),(l()(),t.Jb(-1,null,["\xa9 Equitas Small Finance Bank Limited. All Rights Reserved."]))],function(l,n){var u=l(n,85,0,"/activity-search");l(n,84,0,u)},null)}function d(l){return t.Lb(0,[(l()(),t.tb(0,0,null,null,1,"app-terms-conditions",[],null,null,null,c,r)),t.sb(1,114688,null,0,o,[i.a],null,null)],function(l,n){l(n,1,0)},null)}var b=t.pb("app-terms-conditions",o,d,{},{},[]),p=u("s7LF"),g=u("SVse");class m{}u.d(n,"TermsConditionsModuleNgFactory",function(){return h});var h=t.qb(e,[],function(l){return t.Ab([t.Bb(512,t.l,t.db,[[8,[a.a,b]],[3,t.l],t.z]),t.Bb(4608,p.B,p.B,[]),t.Bb(4608,g.m,g.l,[t.w,[2,g.u]]),t.Bb(1073742336,p.A,p.A,[]),t.Bb(1073742336,p.l,p.l,[]),t.Bb(1073742336,g.b,g.b,[]),t.Bb(1073742336,s.o,s.o,[[2,s.t],[2,s.l]]),t.Bb(1073742336,m,m,[]),t.Bb(1073742336,e,e,[]),t.Bb(1024,s.j,function(){return[[{path:"",component:o}]]},[])])})}}]);