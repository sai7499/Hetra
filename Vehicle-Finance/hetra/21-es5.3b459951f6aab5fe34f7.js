(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{S2Df:function(n,l,t){"use strict";t.r(l);var o=t("CcnG"),e=function(){return function(){}}(),a=t("pMnS"),u=t("X8a+"),i=t("ypJA"),r=t("p8Xo"),s=t("A1CT"),c=t("/4Kq"),b=t("Ppt2"),p=t("ZYCi"),d=t("bkm/"),g=t("Qmey"),h=t("wd/R"),f=function(){function n(n,l,t){var o=this;this.loginStoreService=n,this.dashboardService=l,this.route=t,this.searchDiv=!1,this.roles=[],this.activityList=[],this.bodyClickEvent=function(n){o.openProfile="profileDropDown"===n.target.id}}return n.prototype.ngOnInit=function(){var n=this.loginStoreService.getRolesAndUserDetails();this.userName=n.userDetails.firstName,this.firstLetter=this.userName.slice(0,1),this.branchName=n.userDetails.branchName,this.roles=n.roles,this.activityList=n.activityList,document.querySelector("body").addEventListener("click",this.bodyClickEvent)},n.prototype.getvalue=function(n){var l=this;this.dropDown=""!==n,this.searchLead=this.activityList.filter(function(t){if(n=n.toLowerCase(),t.name.toLowerCase().includes(n))return t;l.dropDown=!0})},n.prototype.getRoute=function(n,l){this.searchText=l,this.routingId=n,this.dropDown=!1},n.prototype.navigateToModule=function(){var n=this;g.a.map(function(l){l.routeId===n.routingId&&n.route.navigateByUrl(l.routeUrl)})},n.prototype.ngOnDestroy=function(){document.querySelector("body").removeEventListener("click",this.bodyClickEvent)},n.prototype.initIdenti5=function(){var n=this;this.pid="",device.getInfo(function(l){console.log("Result&&&&"+l),n.pid=l.model,console.log("base64Data"+n.pid),alert(n.pid),n.prepareKYCRequest(n.pid)},function(n){console.log("Result&&&&"+n),alert("error"+n)})},n.prototype.prepareKYCRequest=function(n){var l=Math.floor(1e5+9e5*Math.random());console.log(l);var t=h().format("MMDDhhmmss"),o=h().format("MMDD"),e=h().format("hhmmss"),a=n;console.log("pId"+a),console.log("now"+t),console.log("localDate"+o);var u='<KycRequest><TransactionInfo><UID type="U">802172334890</UID><Transm_Date_time>'+t+"</Transm_Date_time><Local_Trans_Time>"+e+"</Local_Trans_Time><Local_date>"+o+"</Local_date><CA_TID>11205764</CA_TID><CA_ID>EQT000000001441</CA_ID><CA_TA>Equitas Bank Chennai TNIN</CA_TA><Stan>"+l+"</Stan></TransactionInfo>"+a+"</KycRequest>";console.log("kycRequest"+u),this.dashboardService.getKycDetails({ekycRequest:u}).subscribe(function(n){console.log("KYC result"+JSON.stringify(n))})},n}(),v=o.xb({encapsulation:0,styles:[[".search[_ngcontent-%COMP%]{position:relative;display:inline-block}.dropdown-content[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{text-align:left;font-size:15px;color:#000;padding:12px 16px;text-decoration:none;display:block;width:540px}.dropdown-content[_ngcontent-%COMP%]{margin-left:10px;border-radius:20px;display:none;position:absolute;background-color:#f1f1f1;min-width:160px;box-shadow:0 8px 16px 0 rgba(0,0,0,.2);z-index:1}.dropdown-content[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{background-color:#ddd}.search[_ngcontent-%COMP%]:hover   .dropdown-content[_ngcontent-%COMP%]{display:block}.search[_ngcontent-%COMP%]:hover   #selectbox[_ngcontent-%COMP%]{background-color:#fff}.option[_ngcontent-%COMP%]{border-radius:50px}.form-control[_ngcontent-%COMP%]{height:44px}.vertical-middle[_ngcontent-%COMP%]{position:absolute;top:23%;left:0;right:0;margin:0 auto}"]],data:{}});function H(n){return o.Tb(0,[(n()(),o.zb(0,0,null,null,10,"header",[["class","navbar navbar-static-top"]],null,null,null,null,null)),(n()(),o.zb(1,0,null,null,9,"div",[["class","container-fluid"]],null,null,null,null,null)),(n()(),o.zb(2,0,null,null,6,"div",[["class","navbar-header"]],null,null,null,null,null)),(n()(),o.zb(3,0,null,null,5,"button",[["class","navbar-toggle collapsed"],["data-target","#bs-navbar"],["data-toggle","collapse"],["type","button"]],null,null,null,null,null)),(n()(),o.zb(4,0,null,null,1,"span",[["class","sr-only"]],null,null,null,null,null)),(n()(),o.Rb(-1,null,["Toggle navigation"])),(n()(),o.zb(6,0,null,null,0,"span",[["class","icon-bar"]],null,null,null,null,null)),(n()(),o.zb(7,0,null,null,0,"span",[["class","icon-bar"]],null,null,null,null,null)),(n()(),o.zb(8,0,null,null,0,"span",[["class","icon-bar"]],null,null,null,null,null)),(n()(),o.zb(9,0,null,null,1,"app-profile",[],null,null,null,u.b,u.a)),o.yb(10,245760,null,0,i.a,[r.a,s.a],null,null),(n()(),o.zb(11,0,null,null,5,"main",[],null,null,null,null,null)),(n()(),o.zb(12,0,null,null,4,"div",[["class","container"]],null,null,null,null,null)),(n()(),o.zb(13,0,null,null,3,"div",[["class","vertical-middle text-center"]],null,null,null,null,null)),(n()(),o.zb(14,0,null,null,0,"img",[["alt","[Image: Hetra Logo]"],["class","logo"],["src","assets/images/hetra_logo.png"],["title","Hetra"]],null,null,null,null,null)),(n()(),o.zb(15,0,null,null,1,"app-search-bar",[],null,null,null,c.b,c.a)),o.yb(16,114688,null,0,b.a,[p.o,r.a],null,null)],function(n,l){n(l,10,0),n(l,16,0)},null)}function m(n){return o.Tb(0,[(n()(),o.zb(0,0,null,null,1,"app-dashboard",[],null,null,null,H,v)),o.yb(1,245760,null,0,f,[r.a,d.a,p.o],null,null)],function(n,l){n(l,1,0)},null)}var y=o.vb("app-dashboard",f,m,{},{},[]),C=t("atuK"),_=t("P3h3"),D=t("Ip0R"),M=t("gIcY"),w=t("xkgV"),z=t("+3l6"),x=t("Hz84"),I=t("5cgW"),T=t("06BB"),P=t("NJnL"),k=t("lqqz"),L=t("ARl4"),O=function(){return function(){}}(),q=t("P1eI"),R=t("FpXt"),S=t("BNTI");t.d(l,"ActivitySearchModuleNgFactory",function(){return A});var A=o.wb(e,[],function(n){return o.Gb([o.Hb(512,o.l,o.jb,[[8,[a.a,y,C.a,C.c,C.b,C.d,_.a]],[3,o.l],o.C]),o.Hb(4608,D.o,D.n,[o.z,[2,D.F]]),o.Hb(4608,M.E,M.E,[]),o.Hb(4608,M.g,M.g,[]),o.Hb(4608,w.e,w.e,[]),o.Hb(4608,z.e,z.e,[]),o.Hb(4608,z.j,z.j,[]),o.Hb(4608,z.F,z.F,[]),o.Hb(4608,z.P,z.P,[x.b]),o.Hb(4608,z.rb,z.rb,[x.b]),o.Hb(4608,z.qb,z.qb,[x.b]),o.Hb(135680,I.f,I.f,[o.E]),o.Hb(4608,T.g,T.g,[o.g,o.l,o.v,[2,T.d]]),o.Hb(4608,P.a,P.a,[o.E,o.M,o.H]),o.Hb(4608,k.a,k.a,[o.l,o.E,o.v,P.a,o.g]),o.Hb(4608,L.r,L.r,[]),o.Hb(4608,L.t,L.t,[]),o.Hb(4608,L.a,L.a,[]),o.Hb(4608,L.f,L.f,[]),o.Hb(4608,L.c,L.c,[]),o.Hb(4608,L.h,L.h,[]),o.Hb(4608,L.j,L.j,[]),o.Hb(4608,L.s,L.s,[L.t,L.j]),o.Hb(1073742336,D.c,D.c,[]),o.Hb(1073742336,p.s,p.s,[[2,p.x],[2,p.o]]),o.Hb(1073742336,O,O,[]),o.Hb(1073742336,M.D,M.D,[]),o.Hb(1073742336,M.m,M.m,[]),o.Hb(1073742336,L.e,L.e,[]),o.Hb(1073742336,M.z,M.z,[]),o.Hb(1073742336,q.a,q.a,[]),o.Hb(1073742336,w.a,w.a,[]),o.Hb(1073742336,x.a,x.a,[]),o.Hb(1073742336,I.b,I.b,[]),o.Hb(1073742336,z.p,z.p,[]),o.Hb(1073742336,z.b,z.b,[]),o.Hb(1073742336,z.bb,z.bb,[]),o.Hb(1073742336,z.pb,z.pb,[]),o.Hb(1073742336,z.h,z.h,[]),o.Hb(1073742336,I.h,I.h,[]),o.Hb(1073742336,T.f,T.f,[]),o.Hb(1073742336,z.v,z.v,[]),o.Hb(1073742336,R.a,R.a,[]),o.Hb(1073742336,e,e,[]),o.Hb(1024,p.m,function(){return[[{path:"",component:f}]]},[]),o.Hb(256,z.ab,S.a,[])])})}}]);