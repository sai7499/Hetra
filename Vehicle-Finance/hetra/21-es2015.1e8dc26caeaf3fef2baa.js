(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{S2Df:function(l,n,t){"use strict";t.r(n);var u=t("8Y7J");class e{}var o=t("pMnS"),a=t("SVse"),i=t("X8a+"),r=t("ypJA"),s=t("p8Xo"),c=t("A1CT"),d=t("s7LF"),b=t("bkm/");const g=[{routeId:"2",routeUrl:"/pages/lead-creation",routingPage:"Create New Lead"},{routeId:"21",routeUrl:"/pages/dashboard/leads-section/leads",routingPage:"Go To New Leads Dashboard"},{routeId:"41",routeUrl:"/pages/dashboard/leads-section/leads",routingPage:"Dashboard"},{routeId:"1",routeUrl:"/pages/",routingPage:"Sample Page"},{routeId:"4",routeUrl:"/pages/",routingPage:"Sample Page"},{routeId:"5",routeUrl:"/pages/",routingPage:"Sample Page"}];class p{constructor(l,n,t){this.loginStoreService=l,this.dashboardService=n,this.route=t,this.searchDiv=!1,this.roles=[],this.activityList=[],this.bodyClickEvent=(l=>{this.openProfile="profileDropDown"===l.target.id})}ngOnInit(){const l=this.loginStoreService.getRolesAndUserDetails();this.userName=l.userDetails.firstName,this.firstLetter=this.userName.slice(0,1),this.branchName=l.userDetails.branchName,this.roles=l.roles,this.activityList=l.activityList,document.querySelector("body").addEventListener("click",this.bodyClickEvent)}getvalue(l){this.dropDown=""!==l,this.searchLead=this.activityList.filter(n=>{if(l=l.toLowerCase(),n.name.toLowerCase().includes(l))return n;this.dropDown=!0})}getRoute(l,n){this.searchText=n,this.routingId=l,this.dropDown=!1}navigateToModule(){g.map(l=>{l.routeId===this.routingId&&this.route.navigateByUrl(l.routeUrl)})}ngOnDestroy(){document.querySelector("body").removeEventListener("click",this.bodyClickEvent)}}var v=t("iInd"),h=u.tb({encapsulation:0,styles:[[".search[_ngcontent-%COMP%]{position:relative;display:inline-block}.dropdown-content[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-align:left;font-size:15px;color:#000;padding:12px 16px;text-decoration:none;display:block;width:540px}.dropdown-content[_ngcontent-%COMP%]{margin-left:10px;border-radius:20px;display:none;position:absolute;background-color:#f1f1f1;min-width:160px;box-shadow:0 8px 16px 0 rgba(0,0,0,.2);z-index:1}.dropdown-content[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{background-color:#ddd}.search[_ngcontent-%COMP%]:hover   .dropdown-content[_ngcontent-%COMP%]{display:block}.search[_ngcontent-%COMP%]:hover   #selectbox[_ngcontent-%COMP%]{background-color:#fff}.option[_ngcontent-%COMP%]{border-radius:50px}.form-control[_ngcontent-%COMP%]{height:44px}.vertical-middle[_ngcontent-%COMP%]{position:absolute;top:23%;left:0;right:0;margin:0 auto}"]],data:{}});function f(l){return u.Pb(0,[(l()(),u.vb(0,0,null,null,2,"div",[],null,null,null,null,null)),(l()(),u.vb(1,0,null,null,1,"a",[],null,[[null,"click"]],function(l,n,t){var u=!0;return"click"===n&&(u=!1!==l.component.getRoute(l.context.$implicit.id,l.context.$implicit.name)&&u),u},null,null)),(l()(),u.Nb(2,null,["",""]))],null,function(l,n){l(n,2,0,n.context.$implicit.name)})}function m(l){return u.Pb(0,[(l()(),u.vb(0,0,null,null,2,"div",[["class","dropdown-content"]],null,null,null,null,null)),(l()(),u.kb(16777216,null,null,1,null,f)),u.ub(2,278528,null,0,a.k,[u.U,u.R,u.v],{ngForOf:[0,"ngForOf"]},null)],function(l,n){l(n,2,0,n.component.searchLead)},null)}function C(l){return u.Pb(0,[(l()(),u.vb(0,0,null,null,10,"header",[["class","navbar navbar-static-top"]],null,null,null,null,null)),(l()(),u.vb(1,0,null,null,9,"div",[["class","container-fluid"]],null,null,null,null,null)),(l()(),u.vb(2,0,null,null,6,"div",[["class","navbar-header"]],null,null,null,null,null)),(l()(),u.vb(3,0,null,null,5,"button",[["class","navbar-toggle collapsed"],["data-target","#bs-navbar"],["data-toggle","collapse"],["type","button"]],null,null,null,null,null)),(l()(),u.vb(4,0,null,null,1,"span",[["class","sr-only"]],null,null,null,null,null)),(l()(),u.Nb(-1,null,["Toggle navigation"])),(l()(),u.vb(6,0,null,null,0,"span",[["class","icon-bar"]],null,null,null,null,null)),(l()(),u.vb(7,0,null,null,0,"span",[["class","icon-bar"]],null,null,null,null,null)),(l()(),u.vb(8,0,null,null,0,"span",[["class","icon-bar"]],null,null,null,null,null)),(l()(),u.vb(9,0,null,null,1,"app-profile",[],null,null,null,i.b,i.a)),u.ub(10,245760,null,0,r.a,[s.a,c.a],null,null),(l()(),u.vb(11,0,null,null,15,"main",[],null,null,null,null,null)),(l()(),u.vb(12,0,null,null,14,"div",[["class","container"]],null,null,null,null,null)),(l()(),u.vb(13,0,null,null,13,"div",[["class","vertical-middle text-center"]],null,null,null,null,null)),(l()(),u.vb(14,0,null,null,0,"img",[["alt","[Image: Hetra Logo]"],["class","logo"],["src","assets/images/hetra_logo.png"],["title","Hetra"]],null,null,null,null,null)),(l()(),u.vb(15,0,null,null,11,"div",[["class","search"]],null,null,null,null,null)),(l()(),u.vb(16,0,null,null,5,"input",[["autocomplete","off"],["class","form-control"],["type","text"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"keyup"],[null,"input"],[null,"blur"],[null,"compositionstart"],[null,"compositionend"]],function(l,n,t){var e=!0,o=l.component;return"input"===n&&(e=!1!==u.Fb(l,17)._handleInput(t.target.value)&&e),"blur"===n&&(e=!1!==u.Fb(l,17).onTouched()&&e),"compositionstart"===n&&(e=!1!==u.Fb(l,17)._compositionStart()&&e),"compositionend"===n&&(e=!1!==u.Fb(l,17)._compositionEnd(t.target.value)&&e),"ngModelChange"===n&&(e=!1!==(o.searchText=t)&&e),"keyup"===n&&(e=!1!==o.getvalue(t.target.value)&&e),e},null,null)),u.ub(17,16384,null,0,d.c,[u.J,u.n,[2,d.a]],null,null),u.Kb(1024,null,d.o,function(l){return[l]},[d.c]),u.ub(19,671744,null,0,d.t,[[8,null],[8,null],[8,null],[6,d.o]],{model:[0,"model"]},{update:"ngModelChange"}),u.Kb(2048,null,d.p,null,[d.t]),u.ub(21,16384,null,0,d.q,[[4,d.p]],null,null),(l()(),u.kb(16777216,null,null,1,null,m)),u.ub(23,16384,null,0,a.l,[u.U,u.R],{ngIf:[0,"ngIf"]},null),(l()(),u.vb(24,0,null,null,0,"span",[["class","search-icon-left"]],null,null,null,null,null)),(l()(),u.vb(25,0,null,null,1,"button",[["class","microphone-icon"],["title","Search by voice"]],null,[[null,"click"]],function(l,n,t){var u=!0;return"click"===n&&(u=!1!==l.component.navigateToModule()&&u),u},null,null)),(l()(),u.Nb(-1,null,["GO"]))],function(l,n){var t=n.component;l(n,10,0),l(n,19,0,t.searchText),l(n,23,0,t.dropDown)},function(l,n){l(n,16,0,u.Fb(n,21).ngClassUntouched,u.Fb(n,21).ngClassTouched,u.Fb(n,21).ngClassPristine,u.Fb(n,21).ngClassDirty,u.Fb(n,21).ngClassValid,u.Fb(n,21).ngClassInvalid,u.Fb(n,21).ngClassPending)})}function D(l){return u.Pb(0,[(l()(),u.vb(0,0,null,null,1,"app-dashboard",[],null,null,null,C,h)),u.ub(1,245760,null,0,p,[s.a,b.a,v.o],null,null)],function(l,n){l(n,1,0)},null)}var x=u.rb("app-dashboard",p,D,{},{},[]),P=t("xkgV");class y{}var k=t("P1eI"),w=t("FpXt");t.d(n,"ActivitySearchModuleNgFactory",function(){return M});var M=u.sb(e,[],function(l){return u.Cb([u.Db(512,u.l,u.fb,[[8,[o.a,x]],[3,u.l],u.A]),u.Db(4608,a.n,a.m,[u.x,[2,a.x]]),u.Db(4608,d.C,d.C,[]),u.Db(4608,d.f,d.f,[]),u.Db(4608,P.e,P.e,[]),u.Db(1073742336,a.b,a.b,[]),u.Db(1073742336,v.s,v.s,[[2,v.x],[2,v.o]]),u.Db(1073742336,y,y,[]),u.Db(1073742336,d.B,d.B,[]),u.Db(1073742336,d.l,d.l,[]),u.Db(1073742336,d.x,d.x,[]),u.Db(1073742336,k.a,k.a,[]),u.Db(1073742336,P.a,P.a,[]),u.Db(1073742336,w.a,w.a,[]),u.Db(1073742336,e,e,[]),u.Db(1024,v.m,function(){return[[{path:"",component:p}]]},[])])})}}]);