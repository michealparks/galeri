function e(){}function n(e,n){for(const t in n)e[t]=n[t];return e}function t(e){return e()}function r(){return Object.create(null)}function o(e){e.forEach(t)}function i(e){return"function"==typeof e}function a(e,n){return e!=e?n==n:e!==n||e&&"object"==typeof e||"function"==typeof e}function u(n,...t){if(null==n)return e;const r=n.subscribe(...t);return r.unsubscribe?()=>r.unsubscribe():r}function c(e){let n;return u(e,(e=>n=e))(),n}function f(e,n,t){e.$$.on_destroy.push(u(n,t))}function s(e,n){e.appendChild(n)}function l(e,n,t){e.insertBefore(n,t||null)}function d(e){e.parentNode.removeChild(e)}function h(e){return document.createElement(e)}function v(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function p(e){return document.createTextNode(e)}function y(){return p(" ")}function b(e,n,t,r){return e.addEventListener(n,t,r),()=>e.removeEventListener(n,t,r)}function m(e,n,t){null==t?e.removeAttribute(n):e.getAttribute(n)!==t&&e.setAttribute(n,t)}function g(e){return Array.from(e.childNodes)}function _(e,n,t,r){for(let o=0;o<e.length;o+=1){const r=e[o];if(r.nodeName===n){let n=0;const i=[];for(;n<r.attributes.length;){const e=r.attributes[n++];t[e.name]||i.push(e.name)}for(let e=0;e<i.length;e++)r.removeAttribute(i[e]);return e.splice(o,1)[0]}}return r?v(n):h(n)}function w(e,n){for(let t=0;t<e.length;t+=1){const r=e[t];if(3===r.nodeType)return r.data=""+n,e.splice(t,1)[0]}return p(n)}function I(e){return w(e," ")}function S(e,n){n=""+n,e.wholeText!==n&&(e.data=n)}function E(e,n,t){e.classList[t?"add":"remove"](n)}let N;function j(e){N=e}function x(e){(function(){if(!N)throw new Error("Function called outside component initialization");return N})().$$.on_mount.push(e)}const A=[],O=[],R=[],D=[],k=Promise.resolve();let B=!1;function T(e){R.push(e)}let C=!1;const $=new Set;function F(){if(!C){C=!0;do{for(let e=0;e<A.length;e+=1){const n=A[e];j(n),L(n.$$)}for(j(null),A.length=0;O.length;)O.pop()();for(let e=0;e<R.length;e+=1){const n=R[e];$.has(n)||($.add(n),n())}R.length=0}while(A.length);for(;D.length;)D.pop()();B=!1,C=!1,$.clear()}}function L(e){if(null!==e.fragment){e.update(),o(e.before_update);const n=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,n),e.after_update.forEach(T)}}const M=new Set;let z;function P(){z={r:0,c:[],p:z}}function q(){z.r||o(z.c),z=z.p}function U(e,n){e&&e.i&&(M.delete(e),e.i(n))}function W(e,n,t,r){if(e&&e.o){if(M.has(e))return;M.add(e),z.c.push((()=>{M.delete(e),r&&(t&&e.d(1),r())})),e.o(n)}}function H(e,n){const t={},r={},o={$$scope:1};let i=e.length;for(;i--;){const a=e[i],u=n[i];if(u){for(const e in a)e in u||(r[e]=1);for(const e in u)o[e]||(t[e]=u[e],o[e]=1);e[i]=u}else for(const e in a)o[e]=1}for(const a in r)a in t||(t[a]=void 0);return t}function K(e){return"object"==typeof e&&null!==e?e:{}}function Q(e){e&&e.c()}function G(e,n){e&&e.l(n)}function X(e,n,r,a){const{fragment:u,on_mount:c,on_destroy:f,after_update:s}=e.$$;u&&u.m(n,r),a||T((()=>{const n=c.map(t).filter(i);f?f.push(...n):o(n),e.$$.on_mount=[]})),s.forEach(T)}function J(e,n){const t=e.$$;null!==t.fragment&&(o(t.on_destroy),t.fragment&&t.fragment.d(n),t.on_destroy=t.fragment=null,t.ctx=[])}function V(e,n){-1===e.$$.dirty[0]&&(A.push(e),B||(B=!0,k.then(F)),e.$$.dirty.fill(0)),e.$$.dirty[n/31|0]|=1<<n%31}function Y(n,t,i,a,u,c,f=[-1]){const s=N;j(n);const l=n.$$={fragment:null,ctx:null,props:c,update:e,not_equal:u,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(s?s.$$.context:t.context||[]),callbacks:r(),dirty:f,skip_bound:!1};let h=!1;if(l.ctx=i?i(n,t.props||{},((e,t,...r)=>{const o=r.length?r[0]:t;return l.ctx&&u(l.ctx[e],l.ctx[e]=o)&&(!l.skip_bound&&l.bound[e]&&l.bound[e](o),h&&V(n,e)),t})):[],l.update(),h=!0,o(l.before_update),l.fragment=!!a&&a(l.ctx),t.target){if(t.hydrate){const e=g(t.target);l.fragment&&l.fragment.l(e),e.forEach(d)}else l.fragment&&l.fragment.c();t.intro&&U(n.$$.fragment),X(n,t.target,t.anchor,t.customElement),F()}j(s)}class Z{$destroy(){J(this,1),this.$destroy=e}$on(e,n){const t=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return t.push(n),()=>{const e=t.indexOf(n);-1!==e&&t.splice(e,1)}}$set(e){var n;this.$$set&&(n=e,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const ee=[];function ne(n,t=e){let r;const o=[];function i(e){if(a(n,e)&&(n=e,r)){const e=!ee.length;for(let t=0;t<o.length;t+=1){const e=o[t];e[1](),ee.push(e,n)}if(e){for(let e=0;e<ee.length;e+=2)ee[e][0](ee[e+1]);ee.length=0}}}return{set:i,update:function(e){i(e(n))},subscribe:function(a,u=e){const c=[a,u];return o.push(c),1===o.length&&(r=t(i)||e),a(n),()=>{const e=o.indexOf(c);-1!==e&&o.splice(e,1),0===o.length&&(r(),r=null)}}}}var te="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function re(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.')}
/*!
    localForage -- Offline Storage, Improved
    Version 1.9.0
    https://localforage.github.io/localForage
    (c) 2013-2017 Mozilla, Apache License 2.0
*/var oe,ie=(function(e,n){e.exports=function e(n,t,r){function o(a,u){if(!t[a]){if(!n[a]){if(!u&&re)return re(a);if(i)return i(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var f=t[a]={exports:{}};n[a][0].call(f.exports,(function(e){var t=n[a][1][e];return o(t||e)}),f,f.exports,e,n,t,r)}return t[a].exports}for(var i=re,a=0;a<r.length;a++)o(r[a]);return o}({1:[function(e,n,t){(function(e){var t,r,o=e.MutationObserver||e.WebKitMutationObserver;if(o){var i=0,a=new o(s),u=e.document.createTextNode("");a.observe(u,{characterData:!0}),t=function(){u.data=i=++i%2}}else if(e.setImmediate||void 0===e.MessageChannel)t="document"in e&&"onreadystatechange"in e.document.createElement("script")?function(){var n=e.document.createElement("script");n.onreadystatechange=function(){s(),n.onreadystatechange=null,n.parentNode.removeChild(n),n=null},e.document.documentElement.appendChild(n)}:function(){setTimeout(s,0)};else{var c=new e.MessageChannel;c.port1.onmessage=s,t=function(){c.port2.postMessage(0)}}var f=[];function s(){var e,n;r=!0;for(var t=f.length;t;){for(n=f,f=[],e=-1;++e<t;)n[e]();t=f.length}r=!1}function l(e){1!==f.push(e)||r||t()}n.exports=l}).call(this,void 0!==te?te:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(e,n,t){var r=e(1);function o(){}var i={},a=["REJECTED"],u=["FULFILLED"],c=["PENDING"];function f(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=c,this.queue=[],this.outcome=void 0,e!==o&&h(this,e)}function s(e,n,t){this.promise=e,"function"==typeof n&&(this.onFulfilled=n,this.callFulfilled=this.otherCallFulfilled),"function"==typeof t&&(this.onRejected=t,this.callRejected=this.otherCallRejected)}function l(e,n,t){r((function(){var r;try{r=n(t)}catch(o){return i.reject(e,o)}r===e?i.reject(e,new TypeError("Cannot resolve promise with itself")):i.resolve(e,r)}))}function d(e){var n=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof n)return function(){n.apply(e,arguments)}}function h(e,n){var t=!1;function r(n){t||(t=!0,i.reject(e,n))}function o(n){t||(t=!0,i.resolve(e,n))}function a(){n(o,r)}var u=v(a);"error"===u.status&&r(u.value)}function v(e,n){var t={};try{t.value=e(n),t.status="success"}catch(r){t.status="error",t.value=r}return t}function p(e){return e instanceof this?e:i.resolve(new this(o),e)}function y(e){var n=new this(o);return i.reject(n,e)}function b(e){var n=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var t=e.length,r=!1;if(!t)return this.resolve([]);for(var a=new Array(t),u=0,c=-1,f=new this(o);++c<t;)s(e[c],c);return f;function s(e,o){function c(e){a[o]=e,++u!==t||r||(r=!0,i.resolve(f,a))}n.resolve(e).then(c,(function(e){r||(r=!0,i.reject(f,e))}))}}function m(e){var n=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var t=e.length,r=!1;if(!t)return this.resolve([]);for(var a=-1,u=new this(o);++a<t;)c(e[a]);return u;function c(e){n.resolve(e).then((function(e){r||(r=!0,i.resolve(u,e))}),(function(e){r||(r=!0,i.reject(u,e))}))}}n.exports=f,f.prototype.catch=function(e){return this.then(null,e)},f.prototype.then=function(e,n){if("function"!=typeof e&&this.state===u||"function"!=typeof n&&this.state===a)return this;var t=new this.constructor(o);return this.state!==c?l(t,this.state===u?e:n,this.outcome):this.queue.push(new s(t,e,n)),t},s.prototype.callFulfilled=function(e){i.resolve(this.promise,e)},s.prototype.otherCallFulfilled=function(e){l(this.promise,this.onFulfilled,e)},s.prototype.callRejected=function(e){i.reject(this.promise,e)},s.prototype.otherCallRejected=function(e){l(this.promise,this.onRejected,e)},i.resolve=function(e,n){var t=v(d,n);if("error"===t.status)return i.reject(e,t.value);var r=t.value;if(r)h(e,r);else{e.state=u,e.outcome=n;for(var o=-1,a=e.queue.length;++o<a;)e.queue[o].callFulfilled(n)}return e},i.reject=function(e,n){e.state=a,e.outcome=n;for(var t=-1,r=e.queue.length;++t<r;)e.queue[t].callRejected(n);return e},f.resolve=p,f.reject=y,f.all=b,f.race=m},{1:1}],3:[function(e,n,t){(function(n){"function"!=typeof n.Promise&&(n.Promise=e(2))}).call(this,void 0!==te?te:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{2:2}],4:[function(e,n,t){var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function i(){try{if("undefined"!=typeof indexedDB)return indexedDB;if("undefined"!=typeof webkitIndexedDB)return webkitIndexedDB;if("undefined"!=typeof mozIndexedDB)return mozIndexedDB;if("undefined"!=typeof OIndexedDB)return OIndexedDB;if("undefined"!=typeof msIndexedDB)return msIndexedDB}catch(e){return}}var a=i();function u(){try{if(!a||!a.open)return!1;var e="undefined"!=typeof openDatabase&&/(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent)&&!/BlackBerry/.test(navigator.platform),n="function"==typeof fetch&&-1!==fetch.toString().indexOf("[native code");return(!e||n)&&"undefined"!=typeof indexedDB&&"undefined"!=typeof IDBKeyRange}catch(t){return!1}}function c(e,n){e=e||[],n=n||{};try{return new Blob(e,n)}catch(o){if("TypeError"!==o.name)throw o;for(var t=new("undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:WebKitBlobBuilder),r=0;r<e.length;r+=1)t.append(e[r]);return t.getBlob(n.type)}}"undefined"==typeof Promise&&e(3);var f=Promise;function s(e,n){n&&e.then((function(e){n(null,e)}),(function(e){n(e)}))}function l(e,n,t){"function"==typeof n&&e.then(n),"function"==typeof t&&e.catch(t)}function d(e){return"string"!=typeof e&&(console.warn(e+" used as a key, but it is not a string."),e=String(e)),e}function h(){if(arguments.length&&"function"==typeof arguments[arguments.length-1])return arguments[arguments.length-1]}var v="local-forage-detect-blob-support",p=void 0,y={},b=Object.prototype.toString,m="readonly",g="readwrite";function _(e){for(var n=e.length,t=new ArrayBuffer(n),r=new Uint8Array(t),o=0;o<n;o++)r[o]=e.charCodeAt(o);return t}function w(e){return new f((function(n){var t=e.transaction(v,g),r=c([""]);t.objectStore(v).put(r,"key"),t.onabort=function(e){e.preventDefault(),e.stopPropagation(),n(!1)},t.oncomplete=function(){var e=navigator.userAgent.match(/Chrome\/(\d+)/),t=navigator.userAgent.match(/Edge\//);n(t||!e||parseInt(e[1],10)>=43)}})).catch((function(){return!1}))}function I(e){return"boolean"==typeof p?f.resolve(p):w(e).then((function(e){return p=e}))}function S(e){var n=y[e.name],t={};t.promise=new f((function(e,n){t.resolve=e,t.reject=n})),n.deferredOperations.push(t),n.dbReady?n.dbReady=n.dbReady.then((function(){return t.promise})):n.dbReady=t.promise}function E(e){var n=y[e.name].deferredOperations.pop();if(n)return n.resolve(),n.promise}function N(e,n){var t=y[e.name].deferredOperations.pop();if(t)return t.reject(n),t.promise}function j(e,n){return new f((function(t,r){if(y[e.name]=y[e.name]||$(),e.db){if(!n)return t(e.db);S(e),e.db.close()}var o=[e.name];n&&o.push(e.version);var i=a.open.apply(a,o);n&&(i.onupgradeneeded=function(n){var t=i.result;try{t.createObjectStore(e.storeName),n.oldVersion<=1&&t.createObjectStore(v)}catch(r){if("ConstraintError"!==r.name)throw r;console.warn('The database "'+e.name+'" has been upgraded from version '+n.oldVersion+" to version "+n.newVersion+', but the storage "'+e.storeName+'" already exists.')}}),i.onerror=function(e){e.preventDefault(),r(i.error)},i.onsuccess=function(){t(i.result),E(e)}}))}function x(e){return j(e,!1)}function A(e){return j(e,!0)}function O(e,n){if(!e.db)return!0;var t=!e.db.objectStoreNames.contains(e.storeName),r=e.version<e.db.version,o=e.version>e.db.version;if(r&&(e.version!==n&&console.warn('The database "'+e.name+"\" can't be downgraded from version "+e.db.version+" to version "+e.version+"."),e.version=e.db.version),o||t){if(t){var i=e.db.version+1;i>e.version&&(e.version=i)}return!0}return!1}function R(e){return new f((function(n,t){var r=new FileReader;r.onerror=t,r.onloadend=function(t){var r=btoa(t.target.result||"");n({__local_forage_encoded_blob:!0,data:r,type:e.type})},r.readAsBinaryString(e)}))}function D(e){return c([_(atob(e.data))],{type:e.type})}function k(e){return e&&e.__local_forage_encoded_blob}function B(e){var n=this,t=n._initReady().then((function(){var e=y[n._dbInfo.name];if(e&&e.dbReady)return e.dbReady}));return l(t,e,e),t}function T(e){S(e);for(var n=y[e.name],t=n.forages,r=0;r<t.length;r++){var o=t[r];o._dbInfo.db&&(o._dbInfo.db.close(),o._dbInfo.db=null)}return e.db=null,x(e).then((function(n){return e.db=n,O(e)?A(e):n})).then((function(r){e.db=n.db=r;for(var o=0;o<t.length;o++)t[o]._dbInfo.db=r})).catch((function(n){throw N(e,n),n}))}function C(e,n,t,r){void 0===r&&(r=1);try{var o=e.db.transaction(e.storeName,n);t(null,o)}catch(i){if(r>0&&(!e.db||"InvalidStateError"===i.name||"NotFoundError"===i.name))return f.resolve().then((function(){if(!e.db||"NotFoundError"===i.name&&!e.db.objectStoreNames.contains(e.storeName)&&e.version<=e.db.version)return e.db&&(e.version=e.db.version+1),A(e)})).then((function(){return T(e).then((function(){C(e,n,t,r-1)}))})).catch(t);t(i)}}function $(){return{forages:[],db:null,dbReady:null,deferredOperations:[]}}function F(e){var n=this,t={db:null};if(e)for(var r in e)t[r]=e[r];var o=y[t.name];o||(o=$(),y[t.name]=o),o.forages.push(n),n._initReady||(n._initReady=n.ready,n.ready=B);var i=[];function a(){return f.resolve()}for(var u=0;u<o.forages.length;u++){var c=o.forages[u];c!==n&&i.push(c._initReady().catch(a))}var s=o.forages.slice(0);return f.all(i).then((function(){return t.db=o.db,x(t)})).then((function(e){return t.db=e,O(t,n._defaultConfig.version)?A(t):e})).then((function(e){t.db=o.db=e,n._dbInfo=t;for(var r=0;r<s.length;r++){var i=s[r];i!==n&&(i._dbInfo.db=t.db,i._dbInfo.version=t.version)}}))}function L(e,n){var t=this;e=d(e);var r=new f((function(n,r){t.ready().then((function(){C(t._dbInfo,m,(function(o,i){if(o)return r(o);try{var a=i.objectStore(t._dbInfo.storeName).get(e);a.onsuccess=function(){var e=a.result;void 0===e&&(e=null),k(e)&&(e=D(e)),n(e)},a.onerror=function(){r(a.error)}}catch(u){r(u)}}))})).catch(r)}));return s(r,n),r}function M(e,n){var t=this,r=new f((function(n,r){t.ready().then((function(){C(t._dbInfo,m,(function(o,i){if(o)return r(o);try{var a=i.objectStore(t._dbInfo.storeName).openCursor(),u=1;a.onsuccess=function(){var t=a.result;if(t){var r=t.value;k(r)&&(r=D(r));var o=e(r,t.key,u++);void 0!==o?n(o):t.continue()}else n()},a.onerror=function(){r(a.error)}}catch(c){r(c)}}))})).catch(r)}));return s(r,n),r}function z(e,n,t){var r=this;e=d(e);var o=new f((function(t,o){var i;r.ready().then((function(){return i=r._dbInfo,"[object Blob]"===b.call(n)?I(i.db).then((function(e){return e?n:R(n)})):n})).then((function(n){C(r._dbInfo,g,(function(i,a){if(i)return o(i);try{var u=a.objectStore(r._dbInfo.storeName);null===n&&(n=void 0);var c=u.put(n,e);a.oncomplete=function(){void 0===n&&(n=null),t(n)},a.onabort=a.onerror=function(){var e=c.error?c.error:c.transaction.error;o(e)}}catch(f){o(f)}}))})).catch(o)}));return s(o,t),o}function P(e,n){var t=this;e=d(e);var r=new f((function(n,r){t.ready().then((function(){C(t._dbInfo,g,(function(o,i){if(o)return r(o);try{var a=i.objectStore(t._dbInfo.storeName).delete(e);i.oncomplete=function(){n()},i.onerror=function(){r(a.error)},i.onabort=function(){var e=a.error?a.error:a.transaction.error;r(e)}}catch(u){r(u)}}))})).catch(r)}));return s(r,n),r}function q(e){var n=this,t=new f((function(e,t){n.ready().then((function(){C(n._dbInfo,g,(function(r,o){if(r)return t(r);try{var i=o.objectStore(n._dbInfo.storeName).clear();o.oncomplete=function(){e()},o.onabort=o.onerror=function(){var e=i.error?i.error:i.transaction.error;t(e)}}catch(a){t(a)}}))})).catch(t)}));return s(t,e),t}function U(e){var n=this,t=new f((function(e,t){n.ready().then((function(){C(n._dbInfo,m,(function(r,o){if(r)return t(r);try{var i=o.objectStore(n._dbInfo.storeName).count();i.onsuccess=function(){e(i.result)},i.onerror=function(){t(i.error)}}catch(a){t(a)}}))})).catch(t)}));return s(t,e),t}function W(e,n){var t=this,r=new f((function(n,r){e<0?n(null):t.ready().then((function(){C(t._dbInfo,m,(function(o,i){if(o)return r(o);try{var a=i.objectStore(t._dbInfo.storeName),u=!1,c=a.openKeyCursor();c.onsuccess=function(){var t=c.result;t?0===e||u?n(t.key):(u=!0,t.advance(e)):n(null)},c.onerror=function(){r(c.error)}}catch(f){r(f)}}))})).catch(r)}));return s(r,n),r}function H(e){var n=this,t=new f((function(e,t){n.ready().then((function(){C(n._dbInfo,m,(function(r,o){if(r)return t(r);try{var i=o.objectStore(n._dbInfo.storeName).openKeyCursor(),a=[];i.onsuccess=function(){var n=i.result;n?(a.push(n.key),n.continue()):e(a)},i.onerror=function(){t(i.error)}}catch(u){t(u)}}))})).catch(t)}));return s(t,e),t}function K(e,n){n=h.apply(this,arguments);var t=this.config();(e="function"!=typeof e&&e||{}).name||(e.name=e.name||t.name,e.storeName=e.storeName||t.storeName);var r,o=this;if(e.name){var i=e.name===t.name&&o._dbInfo.db?f.resolve(o._dbInfo.db):x(e).then((function(n){var t=y[e.name],r=t.forages;t.db=n;for(var o=0;o<r.length;o++)r[o]._dbInfo.db=n;return n}));r=e.storeName?i.then((function(n){if(n.objectStoreNames.contains(e.storeName)){var t=n.version+1;S(e);var r=y[e.name],o=r.forages;n.close();for(var i=0;i<o.length;i++){var u=o[i];u._dbInfo.db=null,u._dbInfo.version=t}return new f((function(n,r){var o=a.open(e.name,t);o.onerror=function(e){o.result.close(),r(e)},o.onupgradeneeded=function(){o.result.deleteObjectStore(e.storeName)},o.onsuccess=function(){var e=o.result;e.close(),n(e)}})).then((function(e){r.db=e;for(var n=0;n<o.length;n++){var t=o[n];t._dbInfo.db=e,E(t._dbInfo)}})).catch((function(n){throw(N(e,n)||f.resolve()).catch((function(){})),n}))}})):i.then((function(n){S(e);var t=y[e.name],r=t.forages;n.close();for(var o=0;o<r.length;o++)r[o]._dbInfo.db=null;return new f((function(n,t){var r=a.deleteDatabase(e.name);r.onerror=r.onblocked=function(e){var n=r.result;n&&n.close(),t(e)},r.onsuccess=function(){var e=r.result;e&&e.close(),n(e)}})).then((function(e){t.db=e;for(var n=0;n<r.length;n++)E(r[n]._dbInfo)})).catch((function(n){throw(N(e,n)||f.resolve()).catch((function(){})),n}))}))}else r=f.reject("Invalid arguments");return s(r,n),r}var Q={_driver:"asyncStorage",_initStorage:F,_support:u(),iterate:M,getItem:L,setItem:z,removeItem:P,clear:q,length:U,key:W,keys:H,dropInstance:K};function G(){return"function"==typeof openDatabase}var X="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",J="~~local_forage_type~",V=/^~~local_forage_type~([^~]+)~/,Y="__lfsc__:",Z=Y.length,ee="arbf",ne="blob",te="si08",re="ui08",oe="uic8",ie="si16",ae="si32",ue="ur16",ce="ui32",fe="fl32",se="fl64",le=Z+ee.length,de=Object.prototype.toString;function he(e){var n,t,r,o,i,a=.75*e.length,u=e.length,c=0;"="===e[e.length-1]&&(a--,"="===e[e.length-2]&&a--);var f=new ArrayBuffer(a),s=new Uint8Array(f);for(n=0;n<u;n+=4)t=X.indexOf(e[n]),r=X.indexOf(e[n+1]),o=X.indexOf(e[n+2]),i=X.indexOf(e[n+3]),s[c++]=t<<2|r>>4,s[c++]=(15&r)<<4|o>>2,s[c++]=(3&o)<<6|63&i;return f}function ve(e){var n,t=new Uint8Array(e),r="";for(n=0;n<t.length;n+=3)r+=X[t[n]>>2],r+=X[(3&t[n])<<4|t[n+1]>>4],r+=X[(15&t[n+1])<<2|t[n+2]>>6],r+=X[63&t[n+2]];return t.length%3==2?r=r.substring(0,r.length-1)+"=":t.length%3==1&&(r=r.substring(0,r.length-2)+"=="),r}function pe(e,n){var t="";if(e&&(t=de.call(e)),e&&("[object ArrayBuffer]"===t||e.buffer&&"[object ArrayBuffer]"===de.call(e.buffer))){var r,o=Y;e instanceof ArrayBuffer?(r=e,o+=ee):(r=e.buffer,"[object Int8Array]"===t?o+=te:"[object Uint8Array]"===t?o+=re:"[object Uint8ClampedArray]"===t?o+=oe:"[object Int16Array]"===t?o+=ie:"[object Uint16Array]"===t?o+=ue:"[object Int32Array]"===t?o+=ae:"[object Uint32Array]"===t?o+=ce:"[object Float32Array]"===t?o+=fe:"[object Float64Array]"===t?o+=se:n(new Error("Failed to get type for BinaryArray"))),n(o+ve(r))}else if("[object Blob]"===t){var i=new FileReader;i.onload=function(){var t=J+e.type+"~"+ve(this.result);n(Y+ne+t)},i.readAsArrayBuffer(e)}else try{n(JSON.stringify(e))}catch(a){console.error("Couldn't convert value into a JSON string: ",e),n(null,a)}}function ye(e){if(e.substring(0,Z)!==Y)return JSON.parse(e);var n,t=e.substring(le),r=e.substring(Z,le);if(r===ne&&V.test(t)){var o=t.match(V);n=o[1],t=t.substring(o[0].length)}var i=he(t);switch(r){case ee:return i;case ne:return c([i],{type:n});case te:return new Int8Array(i);case re:return new Uint8Array(i);case oe:return new Uint8ClampedArray(i);case ie:return new Int16Array(i);case ue:return new Uint16Array(i);case ae:return new Int32Array(i);case ce:return new Uint32Array(i);case fe:return new Float32Array(i);case se:return new Float64Array(i);default:throw new Error("Unkown type: "+r)}}var be={serialize:pe,deserialize:ye,stringToBuffer:he,bufferToString:ve};function me(e,n,t,r){e.executeSql("CREATE TABLE IF NOT EXISTS "+n.storeName+" (id INTEGER PRIMARY KEY, key unique, value)",[],t,r)}function ge(e){var n=this,t={db:null};if(e)for(var r in e)t[r]="string"!=typeof e[r]?e[r].toString():e[r];var o=new f((function(e,r){try{t.db=openDatabase(t.name,String(t.version),t.description,t.size)}catch(o){return r(o)}t.db.transaction((function(o){me(o,t,(function(){n._dbInfo=t,e()}),(function(e,n){r(n)}))}),r)}));return t.serializer=be,o}function _e(e,n,t,r,o,i){e.executeSql(t,r,o,(function(e,a){a.code===a.SYNTAX_ERR?e.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?",[n.storeName],(function(e,u){u.rows.length?i(e,a):me(e,n,(function(){e.executeSql(t,r,o,i)}),i)}),i):i(e,a)}),i)}function we(e,n){var t=this;e=d(e);var r=new f((function(n,r){t.ready().then((function(){var o=t._dbInfo;o.db.transaction((function(t){_e(t,o,"SELECT * FROM "+o.storeName+" WHERE key = ? LIMIT 1",[e],(function(e,t){var r=t.rows.length?t.rows.item(0).value:null;r&&(r=o.serializer.deserialize(r)),n(r)}),(function(e,n){r(n)}))}))})).catch(r)}));return s(r,n),r}function Ie(e,n){var t=this,r=new f((function(n,r){t.ready().then((function(){var o=t._dbInfo;o.db.transaction((function(t){_e(t,o,"SELECT * FROM "+o.storeName,[],(function(t,r){for(var i=r.rows,a=i.length,u=0;u<a;u++){var c=i.item(u),f=c.value;if(f&&(f=o.serializer.deserialize(f)),void 0!==(f=e(f,c.key,u+1)))return void n(f)}n()}),(function(e,n){r(n)}))}))})).catch(r)}));return s(r,n),r}function Se(e,n,t,r){var o=this;e=d(e);var i=new f((function(i,a){o.ready().then((function(){void 0===n&&(n=null);var u=n,c=o._dbInfo;c.serializer.serialize(n,(function(n,f){f?a(f):c.db.transaction((function(t){_e(t,c,"INSERT OR REPLACE INTO "+c.storeName+" (key, value) VALUES (?, ?)",[e,n],(function(){i(u)}),(function(e,n){a(n)}))}),(function(n){if(n.code===n.QUOTA_ERR){if(r>0)return void i(Se.apply(o,[e,u,t,r-1]));a(n)}}))}))})).catch(a)}));return s(i,t),i}function Ee(e,n,t){return Se.apply(this,[e,n,t,1])}function Ne(e,n){var t=this;e=d(e);var r=new f((function(n,r){t.ready().then((function(){var o=t._dbInfo;o.db.transaction((function(t){_e(t,o,"DELETE FROM "+o.storeName+" WHERE key = ?",[e],(function(){n()}),(function(e,n){r(n)}))}))})).catch(r)}));return s(r,n),r}function je(e){var n=this,t=new f((function(e,t){n.ready().then((function(){var r=n._dbInfo;r.db.transaction((function(n){_e(n,r,"DELETE FROM "+r.storeName,[],(function(){e()}),(function(e,n){t(n)}))}))})).catch(t)}));return s(t,e),t}function xe(e){var n=this,t=new f((function(e,t){n.ready().then((function(){var r=n._dbInfo;r.db.transaction((function(n){_e(n,r,"SELECT COUNT(key) as c FROM "+r.storeName,[],(function(n,t){var r=t.rows.item(0).c;e(r)}),(function(e,n){t(n)}))}))})).catch(t)}));return s(t,e),t}function Ae(e,n){var t=this,r=new f((function(n,r){t.ready().then((function(){var o=t._dbInfo;o.db.transaction((function(t){_e(t,o,"SELECT key FROM "+o.storeName+" WHERE id = ? LIMIT 1",[e+1],(function(e,t){var r=t.rows.length?t.rows.item(0).key:null;n(r)}),(function(e,n){r(n)}))}))})).catch(r)}));return s(r,n),r}function Oe(e){var n=this,t=new f((function(e,t){n.ready().then((function(){var r=n._dbInfo;r.db.transaction((function(n){_e(n,r,"SELECT key FROM "+r.storeName,[],(function(n,t){for(var r=[],o=0;o<t.rows.length;o++)r.push(t.rows.item(o).key);e(r)}),(function(e,n){t(n)}))}))})).catch(t)}));return s(t,e),t}function Re(e){return new f((function(n,t){e.transaction((function(r){r.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'",[],(function(t,r){for(var o=[],i=0;i<r.rows.length;i++)o.push(r.rows.item(i).name);n({db:e,storeNames:o})}),(function(e,n){t(n)}))}),(function(e){t(e)}))}))}function De(e,n){n=h.apply(this,arguments);var t=this.config();(e="function"!=typeof e&&e||{}).name||(e.name=e.name||t.name,e.storeName=e.storeName||t.storeName);var r,o=this;return s(r=e.name?new f((function(n){var r;r=e.name===t.name?o._dbInfo.db:openDatabase(e.name,"","",0),e.storeName?n({db:r,storeNames:[e.storeName]}):n(Re(r))})).then((function(e){return new f((function(n,t){e.db.transaction((function(r){function o(e){return new f((function(n,t){r.executeSql("DROP TABLE IF EXISTS "+e,[],(function(){n()}),(function(e,n){t(n)}))}))}for(var i=[],a=0,u=e.storeNames.length;a<u;a++)i.push(o(e.storeNames[a]));f.all(i).then((function(){n()})).catch((function(e){t(e)}))}),(function(e){t(e)}))}))})):f.reject("Invalid arguments"),n),r}var ke={_driver:"webSQLStorage",_initStorage:ge,_support:G(),iterate:Ie,getItem:we,setItem:Ee,removeItem:Ne,clear:je,length:xe,key:Ae,keys:Oe,dropInstance:De};function Be(){try{return"undefined"!=typeof localStorage&&"setItem"in localStorage&&!!localStorage.setItem}catch(e){return!1}}function Te(e,n){var t=e.name+"/";return e.storeName!==n.storeName&&(t+=e.storeName+"/"),t}function Ce(){var e="_localforage_support_test";try{return localStorage.setItem(e,!0),localStorage.removeItem(e),!1}catch(n){return!0}}function $e(){return!Ce()||localStorage.length>0}function Fe(e){var n=this,t={};if(e)for(var r in e)t[r]=e[r];return t.keyPrefix=Te(e,n._defaultConfig),$e()?(n._dbInfo=t,t.serializer=be,f.resolve()):f.reject()}function Le(e){var n=this,t=n.ready().then((function(){for(var e=n._dbInfo.keyPrefix,t=localStorage.length-1;t>=0;t--){var r=localStorage.key(t);0===r.indexOf(e)&&localStorage.removeItem(r)}}));return s(t,e),t}function Me(e,n){var t=this;e=d(e);var r=t.ready().then((function(){var n=t._dbInfo,r=localStorage.getItem(n.keyPrefix+e);return r&&(r=n.serializer.deserialize(r)),r}));return s(r,n),r}function ze(e,n){var t=this,r=t.ready().then((function(){for(var n=t._dbInfo,r=n.keyPrefix,o=r.length,i=localStorage.length,a=1,u=0;u<i;u++){var c=localStorage.key(u);if(0===c.indexOf(r)){var f=localStorage.getItem(c);if(f&&(f=n.serializer.deserialize(f)),void 0!==(f=e(f,c.substring(o),a++)))return f}}}));return s(r,n),r}function Pe(e,n){var t=this,r=t.ready().then((function(){var n,r=t._dbInfo;try{n=localStorage.key(e)}catch(o){n=null}return n&&(n=n.substring(r.keyPrefix.length)),n}));return s(r,n),r}function qe(e){var n=this,t=n.ready().then((function(){for(var e=n._dbInfo,t=localStorage.length,r=[],o=0;o<t;o++){var i=localStorage.key(o);0===i.indexOf(e.keyPrefix)&&r.push(i.substring(e.keyPrefix.length))}return r}));return s(t,e),t}function Ue(e){var n=this.keys().then((function(e){return e.length}));return s(n,e),n}function We(e,n){var t=this;e=d(e);var r=t.ready().then((function(){var n=t._dbInfo;localStorage.removeItem(n.keyPrefix+e)}));return s(r,n),r}function He(e,n,t){var r=this;e=d(e);var o=r.ready().then((function(){void 0===n&&(n=null);var t=n;return new f((function(o,i){var a=r._dbInfo;a.serializer.serialize(n,(function(n,r){if(r)i(r);else try{localStorage.setItem(a.keyPrefix+e,n),o(t)}catch(u){"QuotaExceededError"!==u.name&&"NS_ERROR_DOM_QUOTA_REACHED"!==u.name||i(u),i(u)}}))}))}));return s(o,t),o}function Ke(e,n){if(n=h.apply(this,arguments),!(e="function"!=typeof e&&e||{}).name){var t=this.config();e.name=e.name||t.name,e.storeName=e.storeName||t.storeName}var r,o=this;return s(r=e.name?new f((function(n){e.storeName?n(Te(e,o._defaultConfig)):n(e.name+"/")})).then((function(e){for(var n=localStorage.length-1;n>=0;n--){var t=localStorage.key(n);0===t.indexOf(e)&&localStorage.removeItem(t)}})):f.reject("Invalid arguments"),n),r}var Qe={_driver:"localStorageWrapper",_initStorage:Fe,_support:Be(),iterate:ze,getItem:Me,setItem:He,removeItem:We,clear:Le,length:Ue,key:Pe,keys:qe,dropInstance:Ke},Ge=function(e,n){return e===n||"number"==typeof e&&"number"==typeof n&&isNaN(e)&&isNaN(n)},Xe=function(e,n){for(var t=e.length,r=0;r<t;){if(Ge(e[r],n))return!0;r++}return!1},Je=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},Ve={},Ye={},Ze={INDEXEDDB:Q,WEBSQL:ke,LOCALSTORAGE:Qe},en=[Ze.INDEXEDDB._driver,Ze.WEBSQL._driver,Ze.LOCALSTORAGE._driver],nn=["dropInstance"],tn=["clear","getItem","iterate","key","keys","length","removeItem","setItem"].concat(nn),rn={description:"",driver:en.slice(),name:"localforage",size:4980736,storeName:"keyvaluepairs",version:1};function on(e,n){e[n]=function(){var t=arguments;return e.ready().then((function(){return e[n].apply(e,t)}))}}function an(){for(var e=1;e<arguments.length;e++){var n=arguments[e];if(n)for(var t in n)n.hasOwnProperty(t)&&(Je(n[t])?arguments[0][t]=n[t].slice():arguments[0][t]=n[t])}return arguments[0]}var un=new(function(){function e(n){for(var t in o(this,e),Ze)if(Ze.hasOwnProperty(t)){var r=Ze[t],i=r._driver;this[t]=i,Ve[i]||this.defineDriver(r)}this._defaultConfig=an({},rn),this._config=an({},this._defaultConfig,n),this._driverSet=null,this._initDriver=null,this._ready=!1,this._dbInfo=null,this._wrapLibraryMethodsWithReady(),this.setDriver(this._config.driver).catch((function(){}))}return e.prototype.config=function(e){if("object"===(void 0===e?"undefined":r(e))){if(this._ready)return new Error("Can't call config() after localforage has been used.");for(var n in e){if("storeName"===n&&(e[n]=e[n].replace(/\W/g,"_")),"version"===n&&"number"!=typeof e[n])return new Error("Database version must be a number.");this._config[n]=e[n]}return!("driver"in e)||!e.driver||this.setDriver(this._config.driver)}return"string"==typeof e?this._config[e]:this._config},e.prototype.defineDriver=function(e,n,t){var r=new f((function(n,t){try{var r=e._driver,o=new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");if(!e._driver)return void t(o);for(var i=tn.concat("_initStorage"),a=0,u=i.length;a<u;a++){var c=i[a];if((!Xe(nn,c)||e[c])&&"function"!=typeof e[c])return void t(o)}!function(){for(var n=function(e){return function(){var n=new Error("Method "+e+" is not implemented by the current driver"),t=f.reject(n);return s(t,arguments[arguments.length-1]),t}},t=0,r=nn.length;t<r;t++){var o=nn[t];e[o]||(e[o]=n(o))}}();var l=function(t){Ve[r]&&console.info("Redefining LocalForage driver: "+r),Ve[r]=e,Ye[r]=t,n()};"_support"in e?e._support&&"function"==typeof e._support?e._support().then(l,t):l(!!e._support):l(!0)}catch(d){t(d)}}));return l(r,n,t),r},e.prototype.driver=function(){return this._driver||null},e.prototype.getDriver=function(e,n,t){var r=Ve[e]?f.resolve(Ve[e]):f.reject(new Error("Driver not found."));return l(r,n,t),r},e.prototype.getSerializer=function(e){var n=f.resolve(be);return l(n,e),n},e.prototype.ready=function(e){var n=this,t=n._driverSet.then((function(){return null===n._ready&&(n._ready=n._initDriver()),n._ready}));return l(t,e,e),t},e.prototype.setDriver=function(e,n,t){var r=this;Je(e)||(e=[e]);var o=this._getSupportedDrivers(e);function i(){r._config.driver=r.driver()}function a(e){return r._extend(e),i(),r._ready=r._initStorage(r._config),r._ready}function u(e){return function(){var n=0;function t(){for(;n<e.length;){var o=e[n];return n++,r._dbInfo=null,r._ready=null,r.getDriver(o).then(a).catch(t)}i();var u=new Error("No available storage method found.");return r._driverSet=f.reject(u),r._driverSet}return t()}}var c=null!==this._driverSet?this._driverSet.catch((function(){return f.resolve()})):f.resolve();return this._driverSet=c.then((function(){var e=o[0];return r._dbInfo=null,r._ready=null,r.getDriver(e).then((function(e){r._driver=e._driver,i(),r._wrapLibraryMethodsWithReady(),r._initDriver=u(o)}))})).catch((function(){i();var e=new Error("No available storage method found.");return r._driverSet=f.reject(e),r._driverSet})),l(this._driverSet,n,t),this._driverSet},e.prototype.supports=function(e){return!!Ye[e]},e.prototype._extend=function(e){an(this,e)},e.prototype._getSupportedDrivers=function(e){for(var n=[],t=0,r=e.length;t<r;t++){var o=e[t];this.supports(o)&&n.push(o)}return n},e.prototype._wrapLibraryMethodsWithReady=function(){for(var e=0,n=tn.length;e<n;e++)on(this,tn[e])},e.prototype.createInstance=function(n){return new e(n)},e}());n.exports=un},{3:3}]},{},[4])(4)}(oe={exports:{}},oe.exports),oe.exports);export{U as A,W as B,J as C,q as D,f as E,x as F,n as G,P as H,Z as S,y as a,v as b,_ as c,g as d,h as e,d as f,c as g,I as h,Y as i,m as j,l as k,s as l,b as m,e as n,p as o,w as p,S as q,ie as r,a as s,E as t,Q as u,G as v,ne as w,X as x,H as y,K as z};
