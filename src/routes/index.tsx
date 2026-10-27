import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
export const Route = createFileRoute("/")({ component: Office });
type Agent={name:string;role:string;market:string;color:string;paused:boolean;pnl:number;trades:number};
const seed:Agent[]=[
{name:"Atlas",role:"Tendências",market:"EURUSD",color:"#21e3bb",paused:false,pnl:0,trades:0},
{name:"Luna",role:"Bollinger",market:"GBPUSD",color:"#aa7dff",paused:false,pnl:0,trades:0},
{name:"Orion",role:"Volatilidade",market:"USDJPY",color:"#38aaff",paused:false,pnl:0,trades:0},
{name:"Vega",role:"Scalping M1",market:"XAUUSD",color:"#ffb64b",paused:false,pnl:0,trades:0},
{name:"Nexus",role:"Notícias",market:"AUDUSD",color:"#e782e7",paused:false,pnl:0,trades:0},
{name:"Guardian",role:"Gestão de risco",market:"GERAL",color:"#ff6f9c",paused:false,pnl:0,trades:0}];
const panel:CSSProperties={background:"linear-gradient(145deg,#101e37,#0b162a)",border:"1px solid #203b59",borderRadius:12,padding:16};
const fmt=(v:number)=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function TradingScene({onSelect,agents}:{onSelect:(i:number)=>void;agents:Agent[]}){
 const mount=useRef<HTMLDivElement>(null),state=useRef(agents);state.current=agents;
 useEffect(()=>{
  const host=mount.current;if(!host)return;
  let disposed=false,cleanup=()=>{};
  import("three").then(T=>{
   if(disposed)return;
   const scene=new T.Scene();scene.background=new T.Color("#071224");scene.fog=new T.Fog("#071224",22,48);
   const camera=new T.PerspectiveCamera(47,1,.1,100);
   const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;
   host.appendChild(renderer.domElement);
   const material=(c:string,emissive?:string)=>new T.MeshStandardMaterial({color:c,roughness:.45,metalness:.25,emissive:emissive||"#000000",emissiveIntensity:emissive?.5:0});
   const geo=(w:number,h:number,d:number,c:string,x:number,y:number,z:number,p:T.Object3D=scene,em?:string)=>{
    const o=new T.Mesh(new T.BoxGeometry(w,h,d),material(c,em));o.position.set(x,y,z);p.add(o);return o;
   };
   const ball=(r:number,c:string,x:number,y:number,z:number,p:T.Object3D=scene)=>{const o=new T.Mesh(new T.SphereGeometry(r,16,12),material(c));o.position.set(x,y,z);p.add(o);return o};
   scene.add(new T.HemisphereLight(0xb9d5ff,0x182039,2.2));
   const sun=new T.DirectionalLight(0xc5caff,3);sun.position.set(-6,13,5);scene.add(sun);
   const blue=new T.PointLight(0x246dff,40,16);blue.position.set(-7,4,0);scene.add(blue);
   const pink=new T.PointLight(0xff42c8,35,14);pink.position.set(7,4,-2);scene.add(pink);
   geo(23,.25,17,"#141e33",0,-.2,0);geo(23,.08,.1,"#178aff",0,.03,8.2,scene,"#168fff");
   geo(.2,7,17,"#172c4c",-11.3,3.4,0);geo(.2,7,17,"#172c4c",11.3,3.4,0);
   geo(23,7,.25,"#101b33",0,3.4,-8.4);
   for(let i=-10;i<=10;i+=3.3){geo(.09,6.3,.09,"#2e4874",i,3.2,-8.15);geo(2.7,5.6,.05,"#122a51",i+1.4,3.25,-8.02);}
   for(let i=-10;i<=10;i+=2.5)geo(1.9,.05,.08,"#7e4aff",i,6.75,-7.9,scene,"#7e4aff");
   for(let i=-8;i<=8;i+=4)geo(2.7,.06,.07,"#126fff",i,6.6,1,scene,"#126fff");
   const screens:{texture:import("three").CanvasTexture;ctx:CanvasRenderingContext2D;canvas:HTMLCanvasElement;phase:number}[]=[];
   function screen(w:number,h:number,x:number,y:number,z:number,p:T.Object3D,phase:number){
    geo(w+.16,h+.16,.11,"#080e1e",x,y,z,p);
    const canvas=document.createElement("canvas");canvas.width=256;canvas.height=144;const ctx=canvas.getContext("2d");if(!ctx)return;
    const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
    const plane=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture,side:T.DoubleSide}));plane.position.set(x,y,z+.065);p.add(plane);
    screens.push({texture,ctx,canvas,phase});
   }
   const desks:T.Group[]=[],heads:T.Object3D[]=[],arms:T.Object3D[]=[];
   const positions=[[-6,-3],[-0,-3],[6,-3],[-6,3],[0,3],[6,3]];
   seed.forEach((a,i)=>{
    const [x,z]=positions[i],g=new T.Group();g.position.set(x,0,z);scene.add(g);desks.push(g);
    geo(4.8,.1,4.7,"#10243e",0,.02,0,g);geo(4.55,.08,4.45,a.color,0,.07,0,g,a.color);
    geo(4.4,.14,4.3,"#111d32",0,.15,0,g);
    geo(3.8,.15,1.3,"#4a5b76",0,1.25,-.55,g);
    for(const dx of [-1.6,1.6])geo(.15,1.05,.15,"#3d4962",dx,.7,-.55,g);
    geo(3.5,.04,.06,a.color,0,1.15,.11,g,a.color);
    for(const dx of [-1.16,0,1.16]){screen(1.07,.8,dx,2.05,-1.08,g,i*5+dx);geo(.09,.35,.1,"#5d6c88",dx,1.5,-1.08,g);}
    geo(1.5,.08,.5,"#17233c",0,1.36,-.1,g);
    geo(.95,.17,.85,"#29334b",0,.58,1.3,g);geo(.14,.8,.14,"#46536b",0,.85,1.3,g);
    geo(1.03,1.03,.17,"#343c57",0,1.42,1.72,g);
    const body=geo(.73,.85,.45,a.color,0,1.68,.9,g);body.rotation.x=-.16;
    const head=ball(.32,"#dba58c",0,2.35,.8,g);heads.push(head);
    const hair=ball(.32,i%2?"#382b40":"#151c2c",0,2.52,.82,g);hair.scale.set(1,.5,1);
    const left=geo(.18,.65,.18,"#b78371",-.5,1.6,.25,g);left.rotation.x=-.55;arms.push(left);
    const right=geo(.18,.65,.18,"#b78371",.5,1.6,.25,g);right.rotation.x=-.55;arms.push(right);
    geo(.55,.5,.06,"#0d172d",0,2.35,1.07,g);
    geo(.95,.08,.08,a.color,0,.28,2.1,g,a.color);
   });
   const resize=()=>{const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)};
   let azimuth=.12,elevation=.62,distance=23,drag=false,lastX=0,lastY=0;
   const position=()=>{camera.position.set(Math.sin(azimuth)*distance*Math.cos(elevation),Math.sin(elevation)*distance,Math.cos(azimuth)*distance*Math.cos(elevation));camera.lookAt(0,1,-.3)};
   position();
   const down=(e:PointerEvent)=>{drag=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)};
   const move=(e:PointerEvent)=>{if(!drag)return;azimuth-=(e.clientX-lastX)*.005;elevation=Math.max(.18,Math.min(1.25,elevation+(e.clientY-lastY)*.004));lastX=e.clientX;lastY=e.clientY;position()};
   const up=()=>{drag=false};
   const wheel=(e:WheelEvent)=>{e.preventDefault();distance=Math.max(12,Math.min(36,distance+e.deltaY*.014));position()};
   const ray=new T.Raycaster(),pointer=new T.Vector2();
   const click=(e:MouseEvent)=>{const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(desks,true);if(hits.length){let o:T.Object3D|null=hits[0].object;while(o&&!desks.includes(o as T.Group))o=o.parent;const idx=desks.indexOf(o as T.Group);if(idx>=0)onSelect(idx)}};
   const el=renderer.domElement;el.style.cursor="grab";el.style.touchAction="none";
   el.addEventListener("pointerdown",down);el.addEventListener("pointermove",move);el.addEventListener("pointerup",up);el.addEventListener("wheel",wheel,{passive:false});el.addEventListener("click",click);
   const observer=new ResizeObserver(resize);observer.observe(host);resize();
   let frame=0,tick=0;
   const animate=()=>{
    frame=requestAnimationFrame(animate);tick++;
    heads.forEach((h,i)=>{h.rotation.y=state.current[i].paused?0:Math.sin(tick*.015+i)*.18;h.position.y=2.35+(state.current[i].paused?0:Math.sin(tick*.025+i)*.025)});
    arms.forEach((a,i)=>{a.rotation.z=state.current[Math.floor(i/2)].paused?0:Math.sin(tick*.06+i)*.09});
    if(tick%5===0)screens.forEach(({ctx,canvas,texture,phase})=>{
      ctx.fillStyle="#08152a";ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.strokeStyle="#173450";ctx.lineWidth=1;
      for(let x=0;x<256;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,144);ctx.stroke()}
      for(let y=0;y<144;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke()}
      ctx.strokeStyle=phase%2?"#28eac2":"#42a7ff";ctx.lineWidth=2;ctx.beginPath();
      for(let x=0;x<256;x+=3){const y=72+Math.sin(x*.045+phase+tick*.009)*18+Math.sin(x*.12+phase)*11+Math.sin(x*.015+phase)*25;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();
      ctx.fillStyle="#a2cfff";ctx.font="12px monospace";ctx.fillText("DEMO  /  M1",9,17);texture.needsUpdate=true;
    });
    renderer.render(scene,camera);
   };animate();
   cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();el.removeEventListener("pointerdown",down);el.removeEventListener("pointermove",move);el.removeEventListener("pointerup",up);el.removeEventListener("wheel",wheel);el.removeEventListener("click",click);scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose())}});screens.forEach(s=>s.texture.dispose());renderer.dispose();el.remove()};
  }).catch(()=>{if(host)host.textContent="Não foi possível carregar a cena 3D. Verifique as dependências."});
  return()=>{disposed=true;cleanup()};
 },[onSelect]);
 return <div ref={mount} style={{width:"100%",height:"min(66vh,690px)",minHeight:420,touchAction:"none"}}/>;
}
function Office(){
 const [agents,setAgents]=useState(seed),[selected,setSelected]=useState(0),[running,setRunning]=useState(false),[events,setEvents]=useState<string[]>(["Sistema DEMO pronto. Nenhuma ordem real é enviada."]);
 const select=useRef(setSelected);select.current=setSelected;
 const onSelect=useRef((i:number)=>select.current(i)).current;
 useEffect(()=>{if(!running)return;const timer=setInterval(()=>{setAgents(old=>old.map((a,i)=>a.paused||i===5?a:{...a,pnl:Number((a.pnl+(Math.random()-.51)*24).toFixed(2)),trades:a.trades+1}));setEvents(old=>["Ciclo de simulação fictícia: "+new Date().toLocaleTimeString("pt-BR"),...old].slice(0,7))},4000);return()=>clearInterval(timer)},[running]);
 const total=agents.reduce((s,a)=>s+a.pnl,0),ops=agents.reduce((s,a)=>s+a.trades,0);
 return <main style={{minHeight:"100vh",background:"#060e1d",color:"#e9f3ff",fontFamily:"Inter,system-ui,sans-serif"}}>
  <header style={{padding:"15px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap",borderBottom:"1px solid #1b3354"}}>
   <div><div style={{fontSize:11,letterSpacing:2,color:"#39dff4"}}>FOREX ROBO ADVISOR</div><h1 style={{margin:0,fontSize:25,fontWeight:800}}>🏢 TRADING AI OFFICE <span style={{fontSize:12,color:"#7f96b7"}}>3D</span></h1></div>
   <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{color:"#34e4ac",fontSize:13}}>● Ambiente demonstrativo</span><button onClick={()=>setRunning(v=>!v)} style={{background:running?"#a65c43":"#1155e8",color:"white",border:0,borderRadius:8,padding:"11px 17px",fontWeight:700,cursor:"pointer"}}>{running?"⏸ Pausar DEMO":"▶ Iniciar DEMO"}</button></div>
  </header>
  <div style={{padding:"16px",maxWidth:1700,margin:"auto"}}>
   <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10,marginBottom:12}}>
    {([["RESULTADO FICTÍCIO",fmt(total)],["AGENTES",String(agents.length)],["EM OPERAÇÃO",String(agents.filter(a=>!a.paused).length)],["OPERAÇÕES FICTÍCIAS",String(ops)],["STATUS",running?"SIMULANDO":"PAUSADO"]] as const).map(([name,value])=><div key={name} style={panel}><div style={{fontSize:11,color:"#8faecb"}}>{name}</div><div style={{fontSize:24,fontWeight:800,color:name==="RESULTADO FICTÍCIO"?(total>=0?"#27e6ae":"#ff6d89"):"white",marginTop:7}}>{value}</div></div>)}
   </section>
   <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
    <section style={{...panel,padding:0,overflow:"hidden",flex:"4 1 650px",position:"relative"}}>
     <div style={{position:"absolute",top:15,left:15,zIndex:2,background:"#081426dd",padding:"10px 14px",borderRadius:8,fontSize:13}}>🏙️ Sala de operações 3D <span style={{color:"#8bb1d0"}}>· arraste para girar · scroll para zoom</span></div>
     <TradingScene onSelect={onSelect} agents={agents}/>
     <div style={{padding:12,fontSize:12,color:"#8eacc8",borderTop:"1px solid #1d3553"}}>Cena 3D animada e interativa. Monitores e resultados são fictícios; sem conexão com MT5.</div>
    </section>
    <aside style={{...panel,flex:"1 1 265px",alignSelf:"stretch"}}>
     <h2 style={{fontSize:17,margin:"0 0 15px"}}>👥 Equipe de agentes</h2>
     {agents.map((a,i)=><button key={a.name} onClick={()=>setSelected(i)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",background:selected===i?"#1d3555":"#101c32",border:"1px solid "+(selected===i?a.color:"#213a56"),color:"white",borderRadius:9,padding:11,marginBottom:8,textAlign:"left",cursor:"pointer"}}><span><b style={{color:a.color}}>{a.name}</b><br/><small style={{color:"#9bb5d2"}}>{a.market} · {a.role}</small></span><span style={{fontSize:12,color:a.paused?"#ffb879":"#24e8a9"}}>{a.paused?"Pausa":"● Ativo"}</span></button>)}
     <div style={{marginTop:16,borderTop:"1px solid #2b4461",paddingTop:13}}><b>{agents[selected].name}</b><div style={{fontSize:13,color:"#a2b9d4",margin:"8px 0 13px"}}>Resultado fictício: {fmt(agents[selected].pnl)}<br/>Operações: {agents[selected].trades}</div><button onClick={()=>setAgents(old=>old.map((a,i)=>i===selected?{...a,paused:!a.paused}:a))} style={{width:"100%",border:"1px solid #40648d",background:"#20395e",color:"white",padding:11,borderRadius:8,cursor:"pointer"}}>{agents[selected].paused?"▶ Retomar agente":"⏸ Pausar agente"}</button></div>
    </aside>
   </div>
   <section style={{...panel,marginTop:12}}><h2 style={{fontSize:16,margin:"0 0 8px"}}>📊 Atividade demonstrativa</h2>{events.map((e,i)=><div key={i} style={{fontSize:12,color:"#9db7d1",padding:"7px 0",borderTop:"1px solid #203751"}}>{e}</div>)}</section>
  </div>
 </main>;
}
