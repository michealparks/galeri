import"./index.b2ecc98e.js";import{S as t,i as e,s as a,e as n,o as l,a as i,c as s,d as r,p as o,f as c,h as d,j as h,k,l as f,m as p,q as u,I as v,J as g,n as m,K as E}from"./vendor.32db8f2e.js";function L(t,e,a){const n=t.slice();return n[4]=e[a],n}function w(t,e){let a,v,g,m,E,L,w,j,x,H,I,b,y,M,N,S=e[4].title+"",T=e[4].artist+"",q=e[4].provider+"";return{key:t,first:null,c(){a=n("section"),v=n("h2"),g=l(S),E=i(),L=n("h3"),w=l(T),x=i(),H=n("p"),I=l(q),y=i(),this.h()},l(t){a=s(t,"SECTION",{class:!0});var e=r(a);v=s(e,"H2",{"data-link":!0});var n=r(v);g=o(n,S),n.forEach(c),E=d(e),L=s(e,"H3",{"data-link":!0});var l=r(L);w=o(l,T),l.forEach(c),x=d(e),H=s(e,"P",{"data-link":!0});var i=r(H);I=o(i,q),i.forEach(c),y=d(e),e.forEach(c),this.h()},h(){h(v,"data-link",m=e[4].titleLink),h(L,"data-link",j=e[4].artistLink),h(H,"data-link",b=e[4].providerLink),h(a,"class","svelte-8hi0me"),this.first=a},m(t,n){k(t,a,n),f(a,v),f(v,g),f(a,E),f(a,L),f(L,w),f(a,x),f(a,H),f(H,I),f(a,y),M||(N=p(a,"click",e[1]),M=!0)},p(t,a){e=t,1&a&&S!==(S=e[4].title+"")&&u(g,S),1&a&&m!==(m=e[4].titleLink)&&h(v,"data-link",m),1&a&&T!==(T=e[4].artist+"")&&u(w,T),1&a&&j!==(j=e[4].artistLink)&&h(L,"data-link",j),1&a&&q!==(q=e[4].provider+"")&&u(I,q),1&a&&b!==(b=e[4].providerLink)&&h(H,"data-link",b)},d(t){t&&c(a),M=!1,N()}}}function j(t){let e,a=[],n=new Map,l=t[0];const i=t=>t[4].titleLink;for(let s=0;s<l.length;s+=1){let e=L(t,l,s),r=i(e);n.set(r,a[s]=w(r,e))}return{c(){for(let t=0;t<a.length;t+=1)a[t].c();e=v()},l(t){for(let e=0;e<a.length;e+=1)a[e].l(t);e=v()},m(t,n){for(let e=0;e<a.length;e+=1)a[e].m(t,n);k(t,e,n)},p(t,[s]){3&s&&(l=t[0],a=g(a,s,i,1,t,l,n,e.parentNode,E,w,e,L))},i:m,o:m,d(t){for(let e=0;e<a.length;e+=1)a[e].d(t);t&&c(e)}}}function x(t,e,a){const{ipcRenderer:n,shell:l}=window;let i=[];n.on("update",(t=>{console.log(t),a(0,i=t)}));return[i,t=>{var e;console.log(t),t.target instanceof HTMLElement&&(null===(e=t.target.dataset)||void 0===e?void 0:e.link)&&l.openExternal(t.target.dataset.link)}]}const H=document.getElementById("app");if(null===H)throw new Error("App root element is null.");new class extends t{constructor(t){super(),e(this,t,x,j,a,{})}}({target:H});
