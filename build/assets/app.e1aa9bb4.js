import"./index.b2ecc98e.js";import{w as e,g as t,S as r,i,s as o,e as a,a as n,b as l,c as s,d as _,f as c,h as u,j as d,t as p,k as g,l as h,m,n as v,o as f,p as j,q as k,r as w,u as y,v as b,x,y as A,z as C,A as P,B as M,C as L,D as G,E as T,F as I,G as $,H as F}from"./vendor.0d0943c1.js";const B=e=>e.json();globalThis.fetchJSON=(e,t)=>fetch(e,t).then(B);const S=e(1),E={rijks:e([]),rijksPage:S,met:e([]),wikipedia:e([]),current:e(void 0),next:e(void 0),currentImage:e(void 0),nextImage:e(void 0)},V=["wikipedia","met","rijks"],N="https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11|21",O="https://collectionapi.metmuseum.org/public/collection/v1/objects",R="https://www.rijksmuseum.nl/api/en/collection?format=json&ps=30&imgonly=True&type=painting&key=1KfM6MpD",z="https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=Wikipedia:Featured_pictures/Artwork/Paintings&format=json&origin=*",W=async()=>{const e=t(E.wikipedia);if(e.length>0)return e;try{const e=await globalThis.fetchJSON(z),t="window"in globalThis?J(e.parse.text["*"]):q(e.parse.text["*"]);return E.wikipedia.set(t),t}catch(r){return[]}},J=e=>{var t,r,i,o,a;const n=[],l=(new DOMParser).parseFromString(e,"text/html");for(const s of l.querySelectorAll(".gallerybox")){const e=s.querySelector("img"),l=s.querySelector(".gallerytext b"),_=s.querySelector(".gallerytext b a"),c=[...s.querySelectorAll(".gallerytext a")].pop(),u=null==(r=null==(t=null==e?void 0:e.src)?void 0:t.split("/"))?void 0:r.slice(0,-1),d=null==(i=null==u?void 0:u.join("/"))?void 0:i.replace("/thumb/","/"),p=null==(o=null==l?void 0:l.textContent)?void 0:o.trim(),g=null==(a=null==c?void 0:c.textContent)?void 0:a.trim(),h=null==c?void 0:c.href,m=null==_?void 0:_.href;void 0!==d&&n.push({src:`https://upload.wikimedia.org${d.split("//upload.wikimedia.org").pop()}`,title:p,artist:g,artistLink:h,titleLink:m?`https://wikipedia.org/wiki${m.split("/wiki").pop()}`:"",provider:"Wikipedia",providerLink:"https://wikipedia.org"})}return n},q=e=>{const{$:t}=globalThis,r=[];return t(".gallerybox",e).each(((e,i)=>{var o,a,n,l,s,_;const c=t("img",i),u=t(".gallerytext b",i),d=t(".gallerytext b a",i),p=null==(o=t(".gallerytext a",i))?void 0:o.last(),g=null==(n=null==(a=c.attr("src"))?void 0:a.split("/"))?void 0:n.slice(0,-1),h=null==(l=null==g?void 0:g.join("/"))?void 0:l.replace("/thumb/","/"),m=null==(s=null==u?void 0:u.text())?void 0:s.trim(),v=null==(_=null==p?void 0:p.text())?void 0:_.trim(),f=null==p?void 0:p.attr("href"),j=null==d?void 0:d.attr("href");void 0!==h&&r.push({src:`https://upload.wikimedia.org${h.split("//upload.wikimedia.org").pop()}`,title:m,artist:v,artistLink:f,titleLink:j?`https://wikipedia.org/wiki${j.split("/wiki").pop()}`:"",provider:"Wikipedia",providerLink:"https://wikipedia.org"})})),r},D=e=>{const t=Math.floor(Math.random()*e.length),[r]=e.splice(t,1)||[];return E.wikipedia.set(e),r},H={randomArtwork:async()=>{const e=await W();if(0!==e.length)return D(e)}},U=async()=>{const e=t(E.rijks);if(e.length>0)return e;{const e=t(E.rijksPage);let i;try{i=await globalThis.fetchJSON(`${R}&p=${e}`)}catch(r){return[]}const o=[];for(const t of i.artObjects)t.webImage&&t.webImage.url&&o.push({src:t.webImage.url,title:t.title?t.title.trim():void 0,artist:t.principalOrFirstMaker?t.principalOrFirstMaker.trim():void 0,artistLink:void 0,provider:"Rijksmuseum",titleLink:t.links.web,providerLink:"https://www.rijksmuseum.nl/en"});return E.rijks.set(o),E.rijksPage.set(e+1),o}},K=e=>{const t=Math.floor(Math.random()*e.length),[r]=e.splice(t,1)||[];return E.rijks.set(e),r},Q={randomArtwork:async()=>{const e=await U();if(0!==e.length)return K(e)}},X=async()=>{const e=t(E.met);if(e.length>0)return e;try{const e=(await globalThis.fetchJSON(N)).objectIDs;return E.met.set(e),e}catch(r){return console.error(r),[]}},Y=async e=>{const t=Math.floor(Math.random()*e.length),[r]=e.splice(t,1)||[];let i;try{i=await globalThis.fetchJSON(`${O}/${r}`)}catch(_){return void console.error(_)}const{primaryImage:o="",title:a,artistDisplayName:n,objectURL:l}=i||{};if(""===o||void 0===o)return;const s={src:o,title:a,artist:n,artistLink:"",provider:"The Metropolitan Museum of Art",titleLink:l,providerLink:"https://www.metmuseum.org"};return E.met.set(e),s},Z={randomArtwork:async()=>{const e=await X();if(0!==e.length)return Y(e)}},ee=["d/d1/Pierre-Auguste_Renoir_-_Parisiennes_in_Algerian_Costume_or_Harem_-_Google_Art_Project.jpg/2000px-Pierre-Auguste_Renoir_-_Parisiennes_in_Algerian_Costume_or_Harem_-_Google_Art_Project.jpg","9/9c/John_William_Waterhouse_-_Echo_and_Narcissus_-_Google_Art_Project.jpg/2000px-John_William_Waterhouse_-_Echo_and_Narcissus_-_Google_Art_Project.jpg","3/36/Hugo_van_der_Goes_-_The_Fall_of_Man_and_The_Lamentation_-_Google_Art_Project.jpg/2000px-Hugo_van_der_Goes_-_The_Fall_of_Man_and_The_Lamentation_-_Google_Art_Project.jpg","2/2b/Antonio_Allegri%2C_called_Correggio_-_Jupiter_and_Io_-_Google_Art_Project.jpg/2000px-Antonio_Allegri%2C_called_Correggio_-_Jupiter_and_Io_-_Google_Art_Project.jpg","8/83/Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg/2000px-Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg","a/a4/Cornelis_Cornelisz._van_Haarlem_-_The_Fall_of_the_Titans_-_Google_Art_Project.jpg/2000px-Cornelis_Cornelisz._van_Haarlem_-_The_Fall_of_the_Titans_-_Google_Art_Project.jpg","f/f0/Venus_Consoling_Love%2C_Fran%C3%A7ois_Boucher%2C_1751.jpg/2000px-Venus_Consoling_Love%2C_Fran%C3%A7ois_Boucher%2C_1751.jpg","c/cd/Sarah_Goodridge_Beauty_Revealed_The_Metropolitan_Museum_of_Art.jpg/2000px-Sarah_Goodridge_Beauty_Revealed_The_Metropolitan_Museum_of_Art.jpg","1/1d/Piero_di_Cosimo_-_Portrait_de_femme_dit_de_Simonetta_Vespucci_-_Google_Art_Project.jpg/2000px-Piero_di_Cosimo_-_Portrait_de_femme_dit_de_Simonetta_Vespucci_-_Google_Art_Project.jpg","6/6d/Paul_Chabas_September_Morn_The_Metropolitan_Museum_of_Art.jpg/2000px-Paul_Chabas_September_Morn_The_Metropolitan_Museum_of_Art.jpg","f/f0/Venus_Consoling_Love%2C_François_Boucher%2C_1751.jpg/2000px-Venus_Consoling_Love%2C_François_Boucher%2C_1751.jpg","8/86/Giorgione_-_Sleeping_Venus_-_Google_Art_Project_2.jpg/2000px-Giorgione_-_Sleeping_Venus_-_Google_Art_Project_2.jpg","b/b5/Baudry_paul_the_wave_and_the_pearl.jpg/2000px-Baudry_paul_the_wave_and_the_pearl.jpg","5/5c/Edouard_Manet_-_Olympia_-_Google_Art_Project_3.jpg/2000px-Edouard_Manet_-_Olympia_-_Google_Art_Project_3.jpg","7/7c/RokebyVenus.jpg/2000px-RokebyVenus.jpg","4/4c/Goya_Maja_naga2.jpg/2000px-Goya_Maja_naga2.jpg","6/6e/William-Adolphe_Bouguereau_%281825-1905%29_-_The_Wave_%281896%29.jpg/2000px-William-Adolphe_Bouguereau_%281825-1905%29_-_The_Wave_%281896%29.jpg","e/e7/Fouquet_Madonna.jpg/2000px-Fouquet_Madonna.jpg","8/83/Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg/2000px-Angelo_Bronzino_-_Venus%2C_Cupid%2C_Folly_and_Time_-_National_Gallery%2C_London.jpg","d/d4/Pierre-Auguste_Renoir%2C_French_-_The_Large_Bathers_-_Google_Art_Project.jpg/2000px-Pierre-Auguste_Renoir%2C_French_-_The_Large_Bathers_-_Google_Art_Project.jpg","f/fa/Peter_Paul_Rubens_-_The_Birth_of_the_Milky_Way%2C_1636-1637.jpg/2000px-Peter_Paul_Rubens_-_The_Birth_of_the_Milky_Way%2C_1636-1637.jpg","5/5f/Edvard_Munch_-_Madonna_-_Google_Art_Project.jpg/2000px-Edvard_Munch_-_Madonna_-_Google_Art_Project.jpg","b/b6/Feszty_Panorama.jpg/2000px-Feszty_Panorama.jpg","6/64/Titian_-_Venus_with_a_Mirror_-_Google_Art_Project.jpg"],te=new Map;te.set("rijks",Q),te.set("wikipedia",H),te.set("met",Z);const re=async()=>{var e;const t=V[Math.floor(Math.random()*V.length)],r=await(null==(e=te.get(t))?void 0:e.randomArtwork());return void 0===r||ee.includes(decodeURI(r.src))?re():r},ie=async(e=!1)=>{let r=t(E.current),i=t(E.next);return(void 0===r||e)&&(void 0===i?r=await re():(r=i,i=void 0)),E.current.set(r),void 0===i&&(i=await re(),E.next.set(i)),r},oe=e=>{V.splice(V.indexOf(e),1)};function ae(e){let t,r,i,o,f,j;return{c(){t=a("div"),r=n(),i=l("svg"),o=l("path"),this.h()},l(e){t=s(e,"DIV",{class:!0}),_(t).forEach(c),r=u(e),i=s(e,"svg",{viewBox:!0,"area-label":!0,class:!0},1);var a=_(i);o=s(a,"path",{d:!0},1),_(o).forEach(c),a.forEach(c),this.h()},h(){d(t,"class","gradient svelte-1jzx9x7"),d(o,"d","M5.6 3.2c-0.2-0.1-0.4-0.2-0.6-0.2-0.6 0-1 0.4-1 1v16c0 0.2 0.1 0.4 0.2 0.6 0.3 0.4 1 0.5 1.4 0.2l10-8c0.1 0 0.1-0.1 0.2-0.2 0.3-0.4 0.3-1.1-0.2-1.4zM6 6.1l7.4 5.9-7.4 5.9zM18 5v14c0 0.6 0.4 1 1 1s1-0.4 1-1v-14c0-0.6-0.4-1-1-1s-1 0.4-1 1z"),d(i,"viewBox","0 0 24 24"),d(i,"area-label","Next Image"),d(i,"class","svelte-1jzx9x7"),p(i,"disabled",!1===e[0])},m(a,n){g(a,t,n),g(a,r,n),g(a,i,n),h(i,o),f||(j=m(i,"click",e[1]),f=!0)},p(e,[t]){1&t&&p(i,"disabled",!1===e[0])},i:v,o:v,d(e){e&&c(t),e&&c(r),e&&c(i),f=!1,j()}}}function ne(e,t,r){var i=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))((function(o,a){function n(e){try{s(i.next(e))}catch(t){a(t)}}function l(e){try{s(i.throw(e))}catch(t){a(t)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(n,l)}s((i=i.apply(e,t||[])).next())}))};let o=!0;return[o,()=>i(void 0,void 0,void 0,(function*(){r(0,o=!1),yield ie(!0),r(0,o=!0)}))]}class le extends r{constructor(e){super(),i(this,e,ne,ae,o,{})}}function se(e){let t,r;return{c(){t=a("a"),r=f(e[0]),this.h()},l(i){t=s(i,"A",{target:!0,href:!0,class:!0});var o=_(t);r=j(o,e[0]),o.forEach(c),this.h()},h(){d(t,"target","_tab"),d(t,"href",e[1]),d(t,"class","svelte-1g8olc7"),p(t,"clickable",void 0!==e[1])},m(e,i){g(e,t,i),h(t,r)},p(e,i){1&i&&k(r,e[0]),2&i&&d(t,"href",e[1]),2&i&&p(t,"clickable",void 0!==e[1])},d(e){e&&c(t)}}}function _e(e){let t,r,i;return{c(){t=a("a"),r=f("by "),i=f(e[2]),this.h()},l(o){t=s(o,"A",{target:!0,href:!0,class:!0});var a=_(t);r=j(a,"by "),i=j(a,e[2]),a.forEach(c),this.h()},h(){d(t,"target","_tab"),d(t,"href",e[3]),d(t,"class","svelte-1g8olc7"),p(t,"clickable",void 0!==e[3])},m(e,o){g(e,t,o),h(t,r),h(t,i)},p(e,r){4&r&&k(i,e[2]),8&r&&d(t,"href",e[3]),8&r&&p(t,"clickable",void 0!==e[3])},d(e){e&&c(t)}}}function ce(e){let t,r,i;return{c(){t=a("a"),r=f("from "),i=f(e[4]),this.h()},l(o){t=s(o,"A",{target:!0,href:!0,class:!0});var a=_(t);r=j(a,"from "),i=j(a,e[4]),a.forEach(c),this.h()},h(){d(t,"target","_tab"),d(t,"href",e[5]),d(t,"class","svelte-1g8olc7"),p(t,"clickable",void 0!==e[5])},m(e,o){g(e,t,o),h(t,r),h(t,i)},p(e,r){16&r&&k(i,e[4]),32&r&&d(t,"href",e[5]),32&r&&p(t,"clickable",void 0!==e[5])},d(e){e&&c(t)}}}function ue(e){let t,r,i,o,l,p=e[0]&&se(e),m=e[2]&&_e(e),f=e[4]&&ce(e);return{c(){t=a("div"),r=n(),i=a("section"),p&&p.c(),o=n(),m&&m.c(),l=n(),f&&f.c(),this.h()},l(e){t=s(e,"DIV",{class:!0}),_(t).forEach(c),r=u(e),i=s(e,"SECTION",{class:!0});var a=_(i);p&&p.l(a),o=u(a),m&&m.l(a),l=u(a),f&&f.l(a),a.forEach(c),this.h()},h(){d(t,"class","gradient svelte-1g8olc7"),d(i,"class","information svelte-1g8olc7")},m(e,a){g(e,t,a),g(e,r,a),g(e,i,a),p&&p.m(i,null),h(i,o),m&&m.m(i,null),h(i,l),f&&f.m(i,null)},p(e,[t]){e[0]?p?p.p(e,t):(p=se(e),p.c(),p.m(i,o)):p&&(p.d(1),p=null),e[2]?m?m.p(e,t):(m=_e(e),m.c(),m.m(i,l)):m&&(m.d(1),m=null),e[4]?f?f.p(e,t):(f=ce(e),f.c(),f.m(i,null)):f&&(f.d(1),f=null)},i:v,o:v,d(e){e&&c(t),e&&c(r),e&&c(i),p&&p.d(),m&&m.d(),f&&f.d()}}}function de(e,t,r){let{src:i}=t,{title:o}=t,{titleLink:a}=t,{artist:n}=t,{artistLink:l}=t,{provider:s}=t,{providerLink:_}=t;return e.$$set=e=>{"src"in e&&r(6,i=e.src),"title"in e&&r(0,o=e.title),"titleLink"in e&&r(1,a=e.titleLink),"artist"in e&&r(2,n=e.artist),"artistLink"in e&&r(3,l=e.artistLink),"provider"in e&&r(4,s=e.provider),"providerLink"in e&&r(5,_=e.providerLink)},[o,a,n,l,s,_,i]}class pe extends r{constructor(e){super(),i(this,e,de,ue,o,{src:6,title:0,titleLink:1,artist:2,artistLink:3,provider:4,providerLink:5})}}const ge=async()=>{const e=new Set;e.add(w.getItem("current")),e.add(w.getItem("next")),e.add(w.getItem("currentImage")),e.add(w.getItem("nextImage"));const[t,r,i,o]=await Promise.all(e);t&&E.current.set(t),r&&E.next.set(r),i&&E.currentImage.set(i),o&&E.nextImage.set(o),e.clear(),e.add(w.getItem("wikipedia")),e.add(w.getItem("rijks")),e.add(w.getItem("rijksPage")),e.add(w.getItem("met"));const[a,n,l,s]=await Promise.all(e);a&&E.wikipedia.set(a),n&&E.rijks.set(n),l&&E.rijksPage.set(l),s&&E.met.set(s);for(const[_,c]of Object.entries(E))c.subscribe((e=>{w.setItem(_,e)}));E.current.subscribe((async e=>{const t=await window.fetch(e.src),r=await t.blob();E.currentImage.set(r)})),oe("met"),ie(!1)};function he(e){let t,r;const i=[e[1]];let o={};for(let a=0;a<i.length;a+=1)o=$(o,i[a]);return t=new pe({props:o}),{c(){y(t.$$.fragment)},l(e){b(t.$$.fragment,e)},m(e,i){x(t,e,i),r=!0},p(e,r){const o=2&r?A(i,[C(e[1])]):{};t.$set(o)},i(e){r||(P(t.$$.fragment,e),r=!0)},o(e){M(t.$$.fragment,e),r=!1},d(e){L(t,e)}}}function me(e){let t,r,i,o,l;r=new le({});let p=e[1]&&he(e);return{c(){t=a("main"),y(r.$$.fragment),i=n(),p&&p.c(),this.h()},l(e){t=s(e,"MAIN",{style:!0,class:!0});var o=_(t);b(r.$$.fragment,o),i=u(o),p&&p.l(o),o.forEach(c),this.h()},h(){d(t,"style",o=void 0===e[0]?void 0:`background-image: url(${e[0]})`),d(t,"class","svelte-13rbih9")},m(e,o){g(e,t,o),x(r,t,null),h(t,i),p&&p.m(t,null),l=!0},p(e,[r]){e[1]?p?(p.p(e,r),2&r&&P(p,1)):(p=he(e),p.c(),P(p,1),p.m(t,null)):p&&(F(),M(p,1,1,(()=>{p=null})),G()),(!l||1&r&&o!==(o=void 0===e[0]?void 0:`background-image: url(${e[0]})`))&&d(t,"style",o)},i(e){l||(P(r.$$.fragment,e),P(p),l=!0)},o(e){M(r.$$.fragment,e),M(p),l=!1},d(e){e&&c(t),L(r),p&&p.d()}}}function ve(e,t,r){let i;var o=this&&this.__awaiter||function(e,t,r,i){return new(r||(r=Promise))((function(o,a){function n(e){try{s(i.next(e))}catch(t){a(t)}}function l(e){try{s(i.throw(e))}catch(t){a(t)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(n,l)}s((i=i.apply(e,t||[])).next())}))};const{current:a}=E;let n;return T(e,a,(e=>r(1,i=e))),console.log(i),I((()=>o(void 0,void 0,void 0,(function*(){console.log(i),yield ge(),E.currentImage.subscribe((e=>{r(0,n=URL.createObjectURL(e))}))})))),[n,i,a]}const fe=document.getElementById("app");if(null===fe)throw new Error("App root element is null.");new class extends r{constructor(e){super(),i(this,e,ve,me,o,{})}}({target:fe});
