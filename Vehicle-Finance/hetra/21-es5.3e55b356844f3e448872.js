(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{ve5D:function(n,l,t){"use strict";t.r(l);var o=t("CcnG"),e=function(){return function(){}}(),a=t("pMnS"),i=t("9M96"),r=t("dh3B"),u=t("5pZN"),s=t("ZYCi"),c=t("p8Xo"),p=t("owZw"),d=t("V+VW"),b=t("Ip0R"),g=function(){function n(n){this.location=n}return n.prototype.ngOnInit=function(){var n=this,l=this.location.path();this.locationIndex=this.getLocationIndex(l),this.location.onUrlChange(function(l){n.locationIndex=n.getLocationIndex(l)})},n.prototype.getLocationIndex=function(n){return n.includes("lead-details")?0:n.includes("applicant-list")?1:n.includes("vehicle-details")?2:n.includes("document-upload")?3:void 0},n}(),m=o.wb({encapsulation:0,styles:[["h3.dedupe_head[_ngcontent-%COMP%], h3.margin_zero[_ngcontent-%COMP%]{margin-top:0}.ok_footer[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;padding:1rem;border-top:1px solid #e9ecef}.text-center[_ngcontent-%COMP%]{text-align:center}.box_shadow[_ngcontent-%COMP%]{box-shadow:0 8px 6px -9px #000}.img-container[_ngcontent-%COMP%]{margin-left:auto;margin-right:auto;display:block}.modal_title[_ngcontent-%COMP%]{font-size:25px;font-family:fantasy;text-align:center;color:#1d1a4b}.modal_content[_ngcontent-%COMP%]{font-size:18px;font-family:fantasy;text-align:center;color:#494e50}.modal-body[_ngcontent-%COMP%]{text-align:center}.modal-body.modal_coapp[_ngcontent-%COMP%]{text-align:left!important}.dedupe_head[_ngcontent-%COMP%]{font-size:14px;font-weight:700}#proceed_reason[_ngcontent-%COMP%], #reject_reason[_ngcontent-%COMP%]{width:350px;border-radius:1.5em;margin:auto auto 12px;border:1px solid #1d1a4b47}.reject_reason[_ngcontent-%COMP%]{color:#f58733;font-weight:bolder}.approve_reason[_ngcontent-%COMP%], .pending_reason[_ngcontent-%COMP%]{color:#1d1a4b;font-weight:bolder}.content[_ngcontent-%COMP%]{background:#fff;padding:25px 30px;border-radius:8px;border:1px solid #ddd;margin-bottom:20px}label.col-form-label[_ngcontent-%COMP%]{width:50%;padding-right:20px;padding-left:20px;font-weight:bolder;font-size:14px}.col-md-6.col-lg-6.col-sm-12.p-0[_ngcontent-%COMP%]{padding:0!important}label.col-form-label-two[_ngcontent-%COMP%]{width:50%;padding-right:20px;padding-left:20px;font-weight:bolder;font-size:14px;float:right}.col-lg-12.col-md-12.col-sm-12.lead_top[_ngcontent-%COMP%], .p-0[_ngcontent-%COMP%]{padding:0}.pr-0[_ngcontent-%COMP%]{padding-right:0}.form-group.col-sm-6.col-md-2.col-lg-2.mobile_otp[_ngcontent-%COMP%]{width:20%}.back_color[_ngcontent-%COMP%]{color:#fff}#scroll_starts_here[_ngcontent-%COMP%]{height:400px;overflow-y:scroll;overflow-x:hidden}#nagative_list_results[_ngcontent-%COMP%]{background:#fff;padding:20px;border:1px solid #ddd;text-align:center}select#select_main_button_match[_ngcontent-%COMP%]{background-color:#6c757d;padding:6px;color:#fff;margin-bottom:1%}#apc_details[_ngcontent-%COMP%]{background:#dfdfdf;padding:10px;border:1px solid silver}#apc_result_text[_ngcontent-%COMP%]{color:#4d1d0c;font-weight:700}#apc_found_nl[_ngcontent-%COMP%]{width:14%;margin-left:35px;text-align:center}#apc_found_trnl[_ngcontent-%COMP%]{width:14%;text-align:center}#apc_exact_details[_ngcontent-%COMP%]{background-image:linear-gradient(141deg,#fff 0,#e5b69a 51%,#fff 95%);border:1px solid #cccc;padding:10px;margin-top:5px;box-shadow:0 10px 10px -11px #561ba3cc}.input_box[_ngcontent-%COMP%]{width:184px}.date_caps[_ngcontent-%COMP%]{text-transform:uppercase}.row.top_bar[_ngcontent-%COMP%]{margin:0;border:1px solid #ddd;font-weight:100;border-radius:6px;padding-top:15px;padding-bottom:10px;background:#fff}.form-group.mb-0[_ngcontent-%COMP%]{margin-bottom:3px}.basic_scroll[_ngcontent-%COMP%]{overflow-y:auto;max-height:400px;overflow-x:hidden}.multisteps-form__progress[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));margin:15px 0}.multisteps-form__progress-btn[_ngcontent-%COMP%]{position:relative;padding-top:20px;color:rgba(108,117,125,.7);text-indent:-9999px;border:none;background-color:transparent;outline:0!important;cursor:pointer;transition:.15s linear}@media (min-width:500px){.multisteps-form__progress-btn[_ngcontent-%COMP%]{text-indent:0}}@media (min-width:1200px){.container[_ngcontent-%COMP%]{width:1300px}}.multisteps-form__progress-btn[_ngcontent-%COMP%]:before{position:absolute;top:0;left:50%;display:block;width:13px;height:13px;content:'';-webkit-transform:translateX(-50%);transform:translateX(-50%);transition:all .15s linear 0s,-webkit-transform .15s cubic-bezier(.05,1.09,.16,1.4) 0s;transition:all .15s linear 0s,transform .15s cubic-bezier(.05,1.09,.16,1.4) 0s;transition:all .15s linear 0s,transform .15s cubic-bezier(.05,1.09,.16,1.4) 0s,-webkit-transform .15s cubic-bezier(.05,1.09,.16,1.4) 0s;border:2px solid currentColor;border-radius:50%;background-color:#fff;box-sizing:border-box;z-index:3}.multisteps-form__progress-btn[_ngcontent-%COMP%]:after{position:absolute;top:5px;left:calc(-50% - 13px / 2);display:block;width:100%;height:2px;content:'';background-color:currentColor;z-index:1;transition:.15s linear}.multisteps-form__progress-btn[_ngcontent-%COMP%]:first-child:after{display:none}.multisteps-form__progress-btn.js-active[_ngcontent-%COMP%]{color:#272264;font-weight:600}.multisteps-form__progress-btn.js-active[_ngcontent-%COMP%]:before{-webkit-transform:translateX(-50%) scale(1.2);transform:translateX(-50%) scale(1.2);background-color:currentColor}.multisteps-form__form[_ngcontent-%COMP%]{position:relative}.multisteps-form__panel[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:0;opacity:0;visibility:hidden}.multisteps-form__panel.js-active[_ngcontent-%COMP%]{height:auto;opacity:1;visibility:visible}.multisteps-form__panel[data-animation=scaleOut][_ngcontent-%COMP%]{-webkit-transform:scale(1.1);transform:scale(1.1)}.multisteps-form__panel[data-animation=scaleOut].js-active[_ngcontent-%COMP%]{-webkit-transform:scale(1);transform:scale(1);transition:.2s linear}.multisteps-form__panel[data-animation=slideHorz][_ngcontent-%COMP%]{left:50px}.multisteps-form__panel[data-animation=slideHorz].js-active[_ngcontent-%COMP%]{left:0;transition:.25s cubic-bezier(.2,1.13,.38,1.43)}.multisteps-form__panel[data-animation=slideVert][_ngcontent-%COMP%]{top:30px}.multisteps-form__panel[data-animation=slideVert].js-active[_ngcontent-%COMP%]{top:0;transition:.2s linear}.multisteps-form__panel[data-animation=fadeIn].js-active[_ngcontent-%COMP%]{transition:.3s linear}.multisteps-form__panel[data-animation=scaleIn][_ngcontent-%COMP%]{-webkit-transform:scale(.9);transform:scale(.9)}.multisteps-form__panel[data-animation=scaleIn].js-active[_ngcontent-%COMP%]{-webkit-transform:scale(1);transform:scale(1);transition:.2s linear}.multisteps-form__form[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{font-weight:600;margin-bottom:20px;margin-top:4px}"]],data:{}});function f(n){return o.Sb(0,[(n()(),o.yb(0,0,null,null,32,"main",[["class","mar-top90"]],null,null,null,null,null)),(n()(),o.yb(1,0,null,null,31,"div",[["class","container overflow-hidden"]],null,null,null,null,null)),(n()(),o.yb(2,0,null,null,1,"h3",[["class","dashboard"]],null,null,null,null,null)),(n()(),o.Qb(-1,null,["QDE - Reference"])),(n()(),o.yb(4,0,null,null,1,"app-lead-section-header",[],null,null,null,i.b,i.a)),o.xb(5,114688,null,0,r.a,[u.a,s.o,c.a,p.a,d.a],null,null),(n()(),o.yb(6,0,null,null,26,"div",[["class","multisteps-form"]],null,null,null,null,null)),(n()(),o.yb(7,0,null,null,23,"div",[["class","multisteps-form__progress"]],null,null,null,null,null)),(n()(),o.yb(8,0,null,null,6,"button",[["class","multisteps-form__progress-btn js-active"],["id","sales_sourcinginfo"],["type","button"]],null,[[null,"click"]],function(n,l,t){var e=!0;return"click"===l&&(e=!1!==o.Ib(n,9).onClick()&&e),e},null,null)),o.xb(9,16384,null,0,s.p,[s.o,s.a,[8,null],o.K,o.n],{routerLink:[0,"routerLink"]},null),o.Jb(10,1),o.Nb(512,null,b.x,b.y,[o.w,o.x,o.n,o.K]),o.xb(12,278528,null,0,b.k,[b.x],{klass:[0,"klass"],ngClass:[1,"ngClass"]},null),o.Lb(13,{"js-active":0}),(n()(),o.Qb(-1,null,[" Lead Details "])),(n()(),o.yb(15,0,null,null,6,"button",[["class","multisteps-form__progress-btn"],["id","sales_applicant_details"],["type","button"]],null,[[null,"click"]],function(n,l,t){var e=!0;return"click"===l&&(e=!1!==o.Ib(n,16).onClick()&&e),e},null,null)),o.xb(16,16384,null,0,s.p,[s.o,s.a,[8,null],o.K,o.n],{routerLink:[0,"routerLink"]},null),o.Jb(17,1),o.Nb(512,null,b.x,b.y,[o.w,o.x,o.n,o.K]),o.xb(19,278528,null,0,b.k,[b.x],{klass:[0,"klass"],ngClass:[1,"ngClass"]},null),o.Lb(20,{"js-active":0}),(n()(),o.Qb(-1,null,[" Applicant Details "])),(n()(),o.yb(22,0,null,null,6,"button",[["class","multisteps-form__progress-btn"],["id","sales_vechicle_details"],["type","button"]],null,[[null,"click"]],function(n,l,t){var e=!0;return"click"===l&&(e=!1!==o.Ib(n,23).onClick()&&e),e},null,null)),o.xb(23,16384,null,0,s.p,[s.o,s.a,[8,null],o.K,o.n],{routerLink:[0,"routerLink"]},null),o.Jb(24,1),o.Nb(512,null,b.x,b.y,[o.w,o.x,o.n,o.K]),o.xb(26,278528,null,0,b.k,[b.x],{klass:[0,"klass"],ngClass:[1,"ngClass"]},null),o.Lb(27,{"js-active":0}),(n()(),o.Qb(-1,null,[" Vechical Details "])),(n()(),o.yb(29,0,null,null,1,"button",[["class","multisteps-form__progress-btn"],["id","sales_upload_documents"],["type","button"]],null,null,null,null,null)),(n()(),o.Qb(-1,null,[" Document Upload "])),(n()(),o.yb(31,16777216,null,null,1,"router-outlet",[],null,null,null,null,null)),o.xb(32,212992,null,0,s.t,[s.b,o.V,o.l,[8,null],o.i],null,null)],function(n,l){var t=l.component;n(l,5,0);var o=n(l,10,0,"./lead-details");n(l,9,0,o);var e=n(l,13,0,t.locationIndex>=0);n(l,12,0,"multisteps-form__progress-btn js-active",e);var a=n(l,17,0,"./applicant-list");n(l,16,0,a);var i=n(l,20,0,t.locationIndex>=1);n(l,19,0,"multisteps-form__progress-btn",i);var r=n(l,24,0,"./vehicle-details");n(l,23,0,r);var u=n(l,27,0,t.locationIndex>=2);n(l,26,0,"multisteps-form__progress-btn",u),n(l,32,0)},null)}function _(n){return o.Sb(0,[(n()(),o.yb(0,0,null,null,1,"ng-component",[],null,null,null,f,m)),o.xb(1,114688,null,0,g,[b.i],null,null)],function(n,l){n(l,1,0)},null)}var x=o.ub("ng-component",g,_,{},{},[]),h=t("vOfW"),C=t("GDRo"),v=t("zcu7"),O=t("m1Ie"),y=t("hm7B"),M=t("aH6+"),P=t("aWac"),k=function(){function n(){}return n.prototype.ngOnInit=function(){console.log("LeadDetailsComponent")},n.prototype.nextToApplicant=function(){console.log("nextToApplicant")},n}(),w=o.wb({encapsulation:0,styles:[[""]],data:{}});function G(n){return o.Sb(0,[(n()(),o.yb(0,0,null,null,1,"app-sourcing-details",[],null,null,null,h.c,h.a)),o.xb(1,114688,null,0,C.a,[v.a,O.a,s.o,y.a,u.a,M.a,d.a,c.a,P.a,p.a,s.a,b.i],null,null)],function(n,l){n(l,1,0)},null)}function I(n){return o.Sb(0,[(n()(),o.yb(0,0,null,null,1,"ng-component",[],null,null,null,G,w)),o.xb(1,114688,null,0,k,[],null,null)],function(n,l){n(l,1,0)},null)}var j=o.ub("ng-component",k,I,{},{},[]),z=t("E03k"),L=t("PLIQ"),D=t("BqBV"),S=t("vmSN"),Q=function(){function n(){}return n.prototype.ngOnInit=function(){},n}(),K=o.wb({encapsulation:0,styles:[[""]],data:{}});function J(n){return o.Sb(0,[(n()(),o.yb(0,0,null,null,2,"div",[["class","content"]],null,null,null,null,null)),(n()(),o.yb(1,0,null,null,1,"app-shared-vehicle-details",[],null,null,null,L.b,L.a)),o.xb(2,114688,null,0,D.a,[c.a,u.a,v.a,s.o,S.a,d.a,s.a],null,null),(n()(),o.yb(3,0,null,null,9,"div",[["class","btn-sec clear-both row"],["id","clickButton"]],null,null,null,null,null)),(n()(),o.yb(4,0,null,null,0,"div",[["class","col-sm-5"]],null,null,null,null,null)),(n()(),o.yb(5,0,null,null,7,"div",[["class","col-sm-7 text-right"]],null,null,null,null,null)),(n()(),o.yb(6,0,null,null,3,"button",[["class","btn btn-primary js-btn-prev"],["type","button"]],null,[[null,"click"]],function(n,l,t){var e=!0;return"click"===l&&(e=!1!==o.Ib(n,7).onClick()&&e),e},null,null)),o.xb(7,16384,null,0,s.p,[s.o,s.a,[8,null],o.K,o.n],{routerLink:[0,"routerLink"]},null),o.Jb(8,1),(n()(),o.Qb(-1,null,[" Back "])),(n()(),o.Qb(-1,null,[" \xa0 "])),(n()(),o.yb(11,0,null,null,1,"button",[["class","btn btn-primary js-btn-next"],["type","button"]],null,null,null,null,null)),(n()(),o.Qb(-1,null,["Next"]))],function(n,l){n(l,2,0);var t=n(l,8,0,"./applicant-list");n(l,7,0,t)},null)}function N(n){return o.Sb(0,[(n()(),o.yb(0,0,null,null,1,"app-vehicle-details",[],null,null,null,J,K)),o.xb(1,114688,null,0,Q,[],null,null)],function(n,l){n(l,1,0)},null)}var V=o.ub("app-vehicle-details",Q,N,{},{},[]),B=t("atuK"),A=t("YuwJ"),H=t("6D8i"),R=t("KQa7"),W=t("blED"),X=t("0sTW"),Z=t("ozF/"),F=t("VKg4"),q=t("ZAW4"),E=t("gIcY"),T=t("xkgV"),Y=t("NJnL"),U=t("lqqz"),$=t("ARl4"),nn=t("EIjh"),ln=t("N+K7"),tn=t("H+bZ"),on=t("V/I2"),en=function(){return function(){}}(),an=t("P1eI"),rn=t("FpXt"),un=t("J/W2"),sn=t("ppaR"),cn=t("qtC7"),pn=t("Tc9+"),dn=t("Sasb"),bn=t("71i7"),gn=t("8ZSH"),mn=t("BJNQ"),fn=t("H/zF"),_n=t("+31S");t.d(l,"SalesModuleNgFactory",function(){return xn});var xn=o.vb(e,[],function(n){return o.Fb([o.Gb(512,o.l,o.ib,[[8,[a.a,x,j,z.a,V,B.a,B.c,B.b,B.d,A.a,H.a,h.b,R.a,W.a,X.a,Z.a,F.a,q.a]],[3,o.l],o.B]),o.Gb(4608,E.D,E.D,[]),o.Gb(4608,E.g,E.g,[]),o.Gb(4608,b.o,b.n,[o.y,[2,b.A]]),o.Gb(4608,T.e,T.e,[]),o.Gb(4608,Y.a,Y.a,[o.D,o.L,o.G]),o.Gb(4608,U.a,U.a,[o.l,o.D,o.u,Y.a,o.g]),o.Gb(4608,$.t,$.t,[]),o.Gb(4608,$.v,$.v,[]),o.Gb(4608,$.a,$.a,[]),o.Gb(4608,$.h,$.h,[]),o.Gb(4608,$.d,$.d,[]),o.Gb(4608,$.j,$.j,[]),o.Gb(4608,$.l,$.l,[]),o.Gb(4608,$.u,$.u,[$.v,$.l]),o.Gb(4608,nn.a,nn.a,[ln.a,tn.a]),o.Gb(1073742336,s.s,s.s,[[2,s.x],[2,s.o]]),o.Gb(1073742336,en,en,[]),o.Gb(1073742336,an.a,an.a,[]),o.Gb(1073742336,E.C,E.C,[]),o.Gb(1073742336,E.m,E.m,[]),o.Gb(1073742336,E.y,E.y,[]),o.Gb(1073742336,b.c,b.c,[]),o.Gb(1073742336,$.g,$.g,[]),o.Gb(1073742336,T.a,T.a,[]),o.Gb(1073742336,rn.a,rn.a,[]),o.Gb(1073742336,un.a,un.a,[]),o.Gb(1073742336,sn.a,sn.a,[]),o.Gb(1073742336,e,e,[]),o.Gb(1024,s.m,function(){return[[{path:":leadId",component:g,resolve:{LeadDataResolverService:nn.a},children:[{path:"lead-details",component:k},{path:"applicant-list",component:on.a},{path:"vehicle-details",component:Q}]}],[{path:"co-applicant",component:cn.a},{path:":leadId",component:pn.a,resolve:{leadData:nn.a},children:[{path:"",component:C.a},{path:"vehicle-details",component:dn.a},{path:"applicant-details",component:bn.a},{path:"co-applicant",component:cn.a},{path:"add-vehicle",component:gn.a},{path:"credit-score",component:mn.a},{path:"exact-match",component:fn.a},{path:"otp-section",component:_n.a}]}]]},[])])})}}]);