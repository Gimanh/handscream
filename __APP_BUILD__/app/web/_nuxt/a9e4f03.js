(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{643:function(t,e,n){"use strict";n.r(e);n(15),n(1),n(4),n(45),n(60),n(39);var r=n(8),o=n(14),c=n(11),l=n(13),f=n(3),d=n(7),h=n(5);function v(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Object(f.a)(t);if(e){var o=Object(f.a)(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Object(l.a)(this,n)}}var y=function(t,e,n,desc){var r,o=arguments.length,c=o<3?e:null===desc?desc=Object.getOwnPropertyDescriptor(e,n):desc;if("object"===("undefined"==typeof Reflect?"undefined":Object(d.a)(Reflect))&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,n,desc);else for(var i=t.length-1;i>=0;i--)(r=t[i])&&(c=(o<3?r(c):o>3?r(e,n,c):r(e,n))||c);return o>3&&c&&Object.defineProperty(e,n,c),c},k=function(t){Object(c.a)(n,t);var e=v(n);function n(){var t;return Object(r.a)(this,n),(t=e.apply(this,arguments)).routes=["user-goals-id-list","user-goals-id-list-task","user-goals-id-list-task-details","user-goals-id-list-task-subtask","user-goals-id-list-task-subtask-details"],t}return Object(o.a)(n,[{key:"cols",get:function(){return this.$vuetify.breakpoint.sm||this.$vuetify.breakpoint.xs?12:5}},{key:"canShowLeftColumn",get:function(){return!this.routes.includes(this.$route.name+"")||!this.$vuetify.breakpoint.sm&&!this.$vuetify.breakpoint.xs}}]),n}(n(18).a),O=k=y([h.a],k),j=n(17),w=n(19),R=n.n(w),m=n(623),$=n(625),component=Object(j.a)(O,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-row",[t.canShowLeftColumn?n("v-col",{staticClass:"pr-1",attrs:{cols:t.cols}},[n("goal-components")],1):t._e(),t._v(" "),n("nuxt-child")],1)}),[],!1,null,null,null);e.default=component.exports;R()(component,{VCol:m.a,VRow:$.a})}}]);