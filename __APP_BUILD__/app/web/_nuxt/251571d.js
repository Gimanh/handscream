(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{644:function(t,e,n){"use strict";n.r(e);n(24),n(15),n(1),n(4),n(62);var r=n(12),o=n(8),c=n(14),l=n(11),f=n(13),v=n(3),h=n(7),d=n(5);function y(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Object(v.a)(t);if(e){var o=Object(v.a)(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Object(f.a)(this,n)}}var m=function(t,e,n,desc){var r,o=arguments.length,c=o<3?e:null===desc?desc=Object.getOwnPropertyDescriptor(e,n):desc;if("object"===("undefined"==typeof Reflect?"undefined":Object(h.a)(Reflect))&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,n,desc);else for(var i=t.length-1;i>=0;i--)(r=t[i])&&(c=(o<3?r(c):o>3?r(e,n,c):r(e,n))||c);return o>3&&c&&Object.defineProperty(e,n,c),c},O=function(t){Object(l.a)(f,t);var e,n=y(f);function f(){return Object(o.a)(this,f),n.apply(this,arguments)}return Object(c.a)(f,[{key:"cols",get:function(){return this.$vuetify.breakpoint.sm||this.$vuetify.breakpoint.xs?12:7}},{key:"colClass",get:function(){return this.smallScreen?"pa-1":"pl-1"}},{key:"goToLists",value:(e=Object(r.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.$router.push({name:"user-goals-id",params:{id:this.$route.params.id.toString()}});case 2:case"end":return t.stop()}}),t,this)}))),function(){return e.apply(this,arguments)})}]),f}(n(18).a),j=O=m([d.a],O),k=n(17),w=n(19),R=n.n(w),$=n(199),_=n(623),x=n(282),component=Object(k.a)(j,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-col",{class:t.colClass,attrs:{cols:t.cols}},[t.smallScreen?n("v-btn",{attrs:{fab:"",dark:"",small:"",absolute:"",bottom:"",left:""},on:{click:t.goToLists}},[n("v-icon",[t._v("mdi-arrow-left")])],1):t._e(),t._v(" "),n("tasks",{attrs:{"component-id":t.$route.params.list}}),t._v(" "),n("router-view")],1)}),[],!1,null,null,null);e.default=component.exports;R()(component,{VBtn:$.a,VCol:_.a,VIcon:x.a})}}]);