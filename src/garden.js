window.GARDEN_ICONS = await fetch("/assets/icons.json").then(r=>r.json());

class Garden {
 constructor() { this.props = {navPlacement: "top"}; }
  componentDidMount() {
    this.mgLayers();
    this.mgNav();
        const root = this.el || document;
    const reveal = (el) => {
      const kind = el.getAttribute("data-reveal");
      el.style.opacity = "1";
      el.style.transform = "none";
    };
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window)) { els.forEach(reveal); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    this._io = io;
    // safety: reveal anything already in view at mount, and a final catch-all
    const revealInView = () => els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { reveal(el); io.unobserve(el); }
    });
    requestAnimationFrame(revealInView);
    
  }
  componentWillUnmount() { if (this._io) this._io.disconnect(); if (this._fallback) clearTimeout(this._fallback); }


  componentDidUpdate(prev) { if (prev.navPlacement !== this.props.navPlacement) this.mgNav(); }
  mgNav() {
    const hero=document.getElementById("home"); if(!hero||!this._ICONS) return;
    let nav=document.getElementById("mg-nav"); if(nav) nav.remove();
    const p=this.props.navPlacement||"top";
    nav=document.createElement("nav"); nav.id="mg-nav"; nav.setAttribute("aria-label","Sections");
    const items=[["Products","#products","Sprout"],["Work","#work","Compass"],["About","#intro","Owl"]];
    const ic=(n,sz)=>'<svg viewBox="0 0 64 64" width="'+sz+'" height="'+sz+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;">'+this._ICONS[n]+'</svg>';
    const base="position:absolute;z-index:3;display:flex;font-family:'Space Mono',monospace;";
    const pos={top:"top:26px;left:50%;transform:translateX(-50%);gap:clamp(18px,4vw,48px);",bottom:"bottom:clamp(40px,9vh,90px);left:50%;transform:translateX(-50%);gap:clamp(18px,4vw,48px);",left:"left:clamp(16px,3vw,40px);top:50%;transform:translateY(-50%);flex-direction:column;gap:30px;",scattered:"inset:0;pointer-events:none;"}[p]||"";
    nav.style.cssText=base+pos;
    const spots=[["left:7vw;top:64vh;","#1E9E8C"],["right:7vw;top:30vh;","#D6457A"],["right:12vw;top:62vh;","#D99A1E"],["left:11vw;top:22vh;","#8E4FC7"]];
    nav.innerHTML=items.map((it,i)=>{
      const st=p==="scattered"?"position:absolute;pointer-events:auto;"+spots[i][0]:"";
      const col=p==="scattered"?spots[i][1]:"#4C9A74";
      return '<a href="'+it[1]+'" style="'+st+'display:flex;align-items:center;gap:10px;color:#2A2433;text-decoration:none;font-size:13px;letter-spacing:.2em;text-transform:uppercase;padding:6px 2px;transition:transform .3s ease;" onmouseover="this.style.transform=\'translateY(-3px)\';this.querySelector(\'span\').style.color=\'#4C9A74\'" onmouseout="this.style.transform=\'none\';this.querySelector(\'span\').style.color=\'\'"><i style="color:'+col+';display:block;font-style:normal;">'+ic(it[2],p==="scattered"?44:30)+'</i><span style="border-bottom:1px solid #E4E1DA;padding-bottom:2px;">'+it[0]+'</span></a>';
    }).join("");
    hero.appendChild(nav);
  }
  mgLayers() {
    const ICONS=window.GARDEN_ICONS;
    this._ICONS=ICONS;
    const SWAY=['Sunflower','Daisy','Tulip','Rose','Lotus','Lavender','Iris','Poppy','Dandelion','Clover','OakTree','PineTree','Bonsai','Bamboo','Fern','MapleLeaf','Mushroom','Sprout','Acorn','Cattail','SummitFlag','Roots'];
    const HOP=['Frog','Squirrel','Rabbit','Hedgehog','Owl','Ladybug','Cricket','Ant','Beetle','Caterpillar'];
    const FLOW=['Snail','Turtle','Koi','Cloud','Wind'];
    const RIP=['LilyPad','WaterLily','Fountain','Pond'];
    const GLOW=['Moon','Stars','Lamppost','Candle','Firefly'];
    const BOB=['SleepingCat','Hills','MountainRange','Book','Teacup','Balance','WateringCan','Rainbow','Sparrow'];
    const TRAV=['Bee','Dragonfly','Ladybug','Firefly','Moth','Cricket','Hummingbird','Bird','Sparrow','Bat','Ant','Beetle','Bat','Bee'];
    const STAT=[].concat(SWAY,HOP.slice(0,7),FLOW,RIP,GLOW.slice(0,4),BOB,['Compass','SummerSun','Butterfly','Butterfly','WillowTree']);
    const COLS=["#7FC8A0","#D99A1E","#1E9E8C","#2F5BE0","#8E4FC7","#D6457A","#4FA14A"];
    let seed=11; const rnd=()=>{seed=(seed*16807)%2147483647; return (seed-1)/2147483646;};
    const pick=(a)=>a[Math.floor(rnd()*a.length)];
    const svg=(n,size,col,cls,style)=>'<svg viewBox="0 0 64 64" width="'+size+'" height="'+size+'" fill="none" stroke="'+col+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="'+(cls||'')+'" style="display:block;overflow:visible;'+(style||'')+'">'+ICONS[n]+'</svg>';
    const secs=Array.from(document.querySelectorAll('#home,#products,#work,#intro,footer'));
    secs.forEach((sec)=>{
      Array.from(sec.children).forEach((ch)=>{ if(getComputedStyle(ch).position==='static'){ ch.style.position='relative'; ch.style.zIndex='1'; } });
      const layer=document.createElement('div'); layer.setAttribute('aria-hidden','true');
      layer.style.cssText='position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;';
      sec.insertBefore(layer,sec.firstChild);
      const W=sec.offsetWidth||1200, H=sec.offsetHeight||800;
      const sr=sec.getBoundingClientRect(); const T=[];
      sec.querySelectorAll('*').forEach((e)=>{ if(layer.contains(e)) return; let own=false; for(const nd of e.childNodes){ if(nd.nodeType===3&&nd.textContent.trim()){own=true;break;} } if(!own) return; const r=e.getBoundingClientRect(); if(r.width<2||r.height<2) return; T.push([r.left-sr.left-36,r.top-sr.top-36,r.right-sr.left+36,r.bottom-sr.top+36]); });
      if(sec.id==='home'){ const pl=this.props.navPlacement||'top'; if(pl==='top') T.push([0,0,W,100]); else if(pl==='bottom') T.push([0,H-200,W,H-40]); else if(pl==='left') T.push([0,0,220,H]); else { [[.07*W,.64*H],[W-.07*W-200,.30*H],[W-.12*W-200,.62*H],[.11*W,.22*H]].forEach(p=>T.push([p[0]-20,p[1]-20,p[0]+230,p[1]+90])); } }
      const hit=(x,y,z)=>T.some((t)=>x<t[2]&&x+z>t[0]&&y<t[3]&&y+z>t[1]);
      const small=W<700; const isHero=sec.id==='home';
      const n=Math.max(3,Math.min(6,Math.round(W*H/(small?380000:260000))));
      const names=['WillowTree','Butterfly'];
      if(isHero) names.length=2; while(names.length<(isHero?4:n)) names.push(pick(STAT));
      const placed=[];
      names.forEach((nm,i)=>{
        const size=Math.round(34+rnd()*28)+(nm==='OakTree'||nm==='PineTree'||nm==='WillowTree'?10:0);
        let x=0,y=0,ok=false;
        for(let k=0;k<120;k++){ x=rnd()*(W-size); y=rnd()*(H-size); if(!hit(x-24,y-30,size+54)&&placed.every(p=>Math.hypot(p[0]-x,p[1]-y)>(small?140:isHero?280:190))){ ok=true; break; } }
        if(!ok) return;
        placed.push([x,y]);
        const col=pick(COLS);
        let wrapAnim='',svgCls='',svgAnim='',origin='50% 90%';
        const dur=(4+rnd()*5).toFixed(1), dl=(-rnd()*8).toFixed(1);
        if(nm==='Waterfall'){ svgCls='wf'; wrapAnim=''; }
        else if(nm==='WillowTree'){ wrapAnim='mg-jelly '+(5+rnd()*2).toFixed(1)+'s ease-in-out infinite'; origin='50% 30%'; }
        else if(nm==='Butterfly'){ wrapAnim='mg-hover '+(6+rnd()*4).toFixed(1)+'s ease-in-out infinite'; svgAnim='mg-flapx .7s ease-in-out infinite'; origin='50% 50%'; }
        else if(nm==='SummerSun'||nm==='Compass'){ svgAnim='mg-spin 40s linear infinite'; origin='50% 50%'; }
        else if(SWAY.includes(nm)){ svgAnim=(i%2?'mg-sway2 ':'mg-sway ')+dur+'s ease-in-out infinite'; }
        else if(HOP.includes(nm)){ svgAnim='mg-hop '+dur+'s ease-in-out infinite'; }
        else if(FLOW.includes(nm)){ svgAnim='mg-flow '+(7+rnd()*5).toFixed(1)+'s ease-in-out infinite'; origin='50% 50%'; }
        else if(RIP.includes(nm)){ svgAnim='mg-ripple '+dur+'s ease-in-out infinite'; origin='50% 50%'; }
        else if(GLOW.includes(nm)){ svgAnim='mg-glow '+dur+'s ease-in-out infinite'; origin='50% 50%'; }
        else { svgAnim='mg-bob '+dur+'s ease-in-out infinite'; }
        const el=document.createElement('div');
        el.style.cssText='position:absolute;left:'+(x/W*100).toFixed(2)+'%;top:'+(y/H*100).toFixed(2)+'%;color:'+col+';opacity:'+(0.55+rnd()*0.3).toFixed(2)+';'+(wrapAnim?'animation:'+wrapAnim+';animation-delay:'+dl+'s;':'');
        el.innerHTML=svg(nm,size,'currentColor',svgCls,(svgAnim?'animation:'+svgAnim+';animation-delay:'+dl+'s;':'')+'transform-origin:'+origin+';');
        layer.appendChild(el);
      });
      // travellers: bugs, bats, birds cross the section
      const tn=isHero?1:(H>700?2:1);
      for(let i=0;i<tn;i++){
        const nm=i===0?'Bat':i===1?'Bee':pick(TRAV);
        const size=Math.round(30+rnd()*18);
        const dir=rnd()<.5?1:-1;
        const dur=(60+rnd()*40).toFixed(1), dl=(-rnd()*90).toFixed(1);
        let ty=-1; for(let k=0;k<80;k++){ const c=rnd()*(H-size-20); if(!T.some((t)=>c-30<t[3]&&c+size+30>t[1])){ ty=c; break; } } if(ty<0) continue; const top=ty;
        const col=nm==='Bee'||nm==='Firefly'?'#D99A1E':pick(COLS.slice(0,7));
        const wrap=document.createElement('div');
        wrap.style.cssText='position:absolute;left:0;top:'+top+'px;color:'+col+';opacity:.85;animation:mg-xr '+dur+'s linear infinite;animation-delay:'+dl+'s;'+(dir<0?'animation-direction:reverse;':'')+'will-change:transform;';
        const isBat=nm==='Bat';
        const bob=isBat?'mg-batw 4s ease-in-out infinite':'mg-wob '+(4+rnd()*3).toFixed(1)+'s ease-in-out infinite';
        const flap=isBat?'mg-flapy .45s ease-in-out infinite':(nm==='Bird'||nm==='Sparrow'||nm==='Hummingbird'||nm==='Dragonfly'||nm==='Moth'||nm==='Bee'?'mg-flapy .3s ease-in-out infinite':'');
        wrap.innerHTML='<div style="animation:'+bob+';transform:scaleX('+(dir)+');">'+svg(nm,size,'currentColor','',flap?'animation:'+flap+';transform-origin:50% 50%;':'')+'</div>';
        layer.appendChild(wrap);
      }
    });
  }
  renderVals() { return {}; }
}

await document.fonts.ready;
const garden = new Garden();
garden.componentDidMount();
