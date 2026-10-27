import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
export const Route=createFileRoute("/")({component:Office});
const agents=[["Nexus","XAUUSD","#32e8ba"],["Atlas","EURUSD","#37baff"],["Luna","GBPUSD","#d998ff"],["Guardian","RISCO","#ff668c"],["Orion","USDJPY","#ffca65"],["Vega","XAUUSD","#a5a1ff"]] as const;
function Scene(){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const host=root.current;if(!host)return;let cancelled=false,dispose=()=>{};
  import("three").then(T=>{
   if(cancelled)return;
   const scene=new T.Scene();scene.background=new T.Color(0x070d1e);scene.fog=new T.FogExp2(0x080c22,.018);
   const camera=new T.PerspectiveCamera(40,1,.1,110);camera.position.set(17,17,24);camera.lookAt(0,1,-3);
   const renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;host.appendChild(renderer.domElement);
   const mat=(color:string,metal=.2,rough=.6,glow?:string)=>new T.MeshStandardMaterial({color,metalness:metal,roughness:rough,emissive:glow||"#000000",emissiveIntensity:glow?.7:0});
   const box=(w:number,h:number,d:number,color:string,x:number,y:number,z:number,parent:T.Object3D=scene,glow?:string)=>{
    const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),mat(color,.25,.48,glow));mesh.position.set(x,y,z);parent.add(mesh);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
   };
   const sphere=(r:number,color:string,x:number,y:number,z:number,parent:T.Object3D=scene)=>{const mesh=new T.Mesh(new T.SphereGeometry(r,18,14),mat(color));mesh.position.set(x,y,z);mesh.castShadow=true;parent.add(mesh);return mesh};
   const cylinder=(r1:number,r2:number,h:number,color:string,x:number,y:number,z:number,parent:T.Object3D=scene)=>{const mesh=new T.Mesh(new T.CylinderGeometry(r1,r2,h,12),mat(color));mesh.position.set(x,y,z);parent.add(mesh);return mesh};
   scene.add(new T.HemisphereLight(0x9ebcff,0x1b1232,2.2));const key=new T.DirectionalLight(0xffd6bd,2.6);key.position.set(-5,13,10);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-20;key.shadow.camera.right=20;key.shadow.camera.top=20;key.shadow.camera.bottom=-20;scene.add(key);
   [[-10,5,0,0x175cff],[9,5,2,0xff32b9],[0,5,-8,0x874aff]].forEach(([x,y,z,c])=>{const l=new T.PointLight(c,48,19);l.position.set(x,y,z);scene.add(l)});
   box(28,.3,23,"#12182c",0,-.2,0);box(28,.08,23,"#1d2a4c",0,-.02,0);
   for(let i=-13;i<=13;i+=2){box(.014,.012,23,"#263557",i,.03,0);box(28,.012,.014,"#263557",0,.03,i*.8)}
   box(.2,8,23,"#18233c",-14,4,0);box(.2,8,23,"#18233c",14,4,0);
   box(28,8,.2,"#0c152a",0,4,-11.5);
   // panoramic skyline windows
   for(let i=0;i<13;i++){
    const x=-12.5+i*2.05;
    box(1.94,6.8,.04,"#0a244e",x,4.1,-11.37);
    box(.07,7,.12,"#6675a1",x+1,4,-11.24);
    const count=4+(i*3)%7;
    for(let j=0;j<count;j++){const bx=x-.8+j*.29;const height=.4+((i*7+j*11)%17)*.16;box(.23,height,.06,"#111c3e",bx,.8+height/2,-11.28);for(let k=0;k<Math.floor(height*3);k++)box(.035,.04,.012,k%3?"#e3a0d8":"#4fbbff",bx,.86+k*.26,-11.19)}
   }
   box(28,.22,.25,"#2844a2",0,7.9,-11.1,scene,"#345dff");
   for(let i=-12;i<=12;i+=4){box(3,.055,.08,"#5e5dff",i,7.72,-4,scene,"#645aff");box(3,.055,.08,"#ff79ae",i,7.72,5,scene,"#ff79ae")}
   // neon branding and wall-mounted performance displays
   const canvasTextures:T.CanvasTexture[]=[];
   function canvasPanel(w:number,h:number,x:number,y:number,z:number,parent:T.Object3D,draw:(ctx:CanvasRenderingContext2D,t:number)=>void,scale=1){
    const canvas=document.createElement("canvas");canvas.width=512;canvas.height=256;const ctx=canvas.getContext("2d");if(!ctx)return;
    const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;canvasTextures.push(texture);
    box(w+.13,h+.13,.1,"#030917",x,y,z,parent);
    const plane=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture,side:T.DoubleSide}));plane.position.set(x,y,z+.065);parent.add(plane);
    panels.push({ctx,texture,draw,scale});
   }
   const panels:{ctx:CanvasRenderingContext2D;texture:T.CanvasTexture;draw:(ctx:CanvasRenderingContext2D,t:number)=>void;scale:number}[]=[];
   const chart=(ctx:CanvasRenderingContext2D,t:number,seed:number)=>{
    ctx.fillStyle="#071528";ctx.fillRect(0,0,512,256);
    ctx.strokeStyle="#1d3754";ctx.lineWidth=1;for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(i*58,0);ctx.lineTo(i*58,256);ctx.stroke()}for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(0,i*50);ctx.lineTo(512,i*50);ctx.stroke()}
    ctx.fillStyle="#83acd0";ctx.font="bold 20px monospace";ctx.fillText(["EURUSD","GBPUSD","USDJPY","XAUUSD","AUDUSD","USDCAD"][seed%6]+"  M1  DEMO",18,29);
    ctx.strokeStyle=seed%3===0?"#27f0c2":seed%3===1?"#ff739d":"#5abaff";ctx.lineWidth=4;ctx.beginPath();for(let x=0;x<512;x+=5){const y=130+Math.sin(x*.018+seed+t*.017)*37+Math.sin(x*.063+seed*2)*17-Math.sin(x*.004+seed)*32;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();
    ctx.fillStyle="#26eac0";ctx.font="16px monospace";ctx.fillText("● MARKET LIVE / SIMULADO",18,242);
   };
   canvasPanel(7.4,2.6,0,5.7,-11.12,scene,(ctx,t)=>{ctx.fillStyle="#071126";ctx.fillRect(0,0,512,256);ctx.textAlign="center";ctx.fillStyle="#6eeeff";ctx.font="bold 43px Arial";ctx.fillText("TRADING AI OFFICE",256,83);ctx.fillStyle="#2cf2a8";ctx.font="bold 32px Arial";ctx.fillText("CENTRAL DE OPERAÇÕES",256,136);ctx.font="25px Arial";ctx.fillStyle="#d0dafa";ctx.fillText("6 AGENTES  •  MODO DEMO",256,193);ctx.textAlign="start"},1);
   const heads:T.Object3D[]=[],hands:T.Object3D[]=[],plants:T.Object3D[]=[];
   const positions=[[-8,-5],[0,-5],[8,-5],[-8,4],[0,4],[8,4]];
   positions.forEach(([x,z],i)=>{
    const group=new T.Group();group.position.set(x,0,z);scene.add(group);
    box(5.7,.18,3,"#28334c",0,1.32,-.65,group);
    box(5.7,.04,3,"#65718c",0,1.43,-.65,group);
    for(const dx of [-2.35,2.35]){box(.16,1.3,.16,"#3c4761",dx,.65,-1.6,group);box(.16,1.3,.16,"#3c4761",dx,.65,.3,group)}
    box(5.7,.08,.08,agents[i][2],0,1.18,.86,group,agents[i][2]);
    for(let m=0;m<3;m++){
     const dx=(m-1)*1.58;
     canvasPanel(1.52,.91,dx,2.13,-1.35,group,(ctx,t)=>chart(ctx,t,i*3+m));
     box(.09,.32,.09,"#586985",dx,1.57,-1.35,group);
    }
    box(1.6,.055,.5,"#101b2e",0,1.49,.15,group);box(.27,.05,.23,"#111c30",1.13,1.5,.23,group);
    // ergonomic chair and articulated human
    box(1.1,.22,.9,"#212b44",0,.69,1.18,group);box(1.1,1.25,.18,"#25314d",0,1.37,1.6,group);
    cylinder(.12,.13,.7,"#65738d",0,.3,1.2,group);
    const body=cylinder(.42,.48,.88,["#253d63","#2b334e","#52375c","#344c57","#344266","#504466"][i],0,1.65,1.12,group);body.rotation.x=-.17;
    sphere(.32,["#bd8c72","#e0ae8b","#ac715b","#d4a17c","#c68f78","#dfb09a"][i],0,2.37,1.06,group);
    const head=new T.Group();head.position.set(0,2.37,1.06);group.add(head);heads.push(head);
    const hair=sphere(.335,["#1d1b27","#422a27","#161c2d","#2b2631","#2a1b27","#8d4f36"][i],0,.12,-.025,head);hair.scale.set(1,.65,1);
    for(const side of [-1,1]){
     const arm=new T.Group();arm.position.set(side*.42,1.97,1.06);group.add(arm);
     const upper=cylinder(.115,.105,.62,["#bd8c72","#e0ae8b","#ac715b","#d4a17c","#c68f78","#dfb09a"][i],side*.14,-.26,-.23,arm);upper.rotation.x=-.75;upper.rotation.z=side*.4;
     sphere(.12,"#c58f76",side*.23,-.53,-.47,arm);hands.push(arm);
    }
    const sign=new T.Group();group.add(sign);box(2.25,.52,.12,"#071429",0,3.22,1.65,sign);box(2.25,.035,.13,agents[i][2],0,2.95,1.66,sign,agents[i][2]);
    // badge is rendered as 3D canvas
    canvasPanel(2.1,.4,0,3.22,1.75,group,(ctx)=>{ctx.fillStyle="#08172d";ctx.fillRect(0,0,512,256);ctx.fillStyle=agents[i][2];ctx.beginPath();ctx.arc(43,128,15,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.font="bold 70px Arial";ctx.fillText(agents[i][0],76,151);});
   });
   for(const [x,z] of [[-12,-8],[12,-8],[-12,7],[12,7]]){
    cylinder(.55,.38,.8,"#53617a",x,.4,z);for(let j=0;j<6;j++){const stem=cylinder(.035,.035,1.4,"#256e5b",x,.95,z);stem.rotation.z=(j-3)*.3;const leaf=sphere(.43,"#278a76",x+(j-3)*.19,1.6+Math.sin(j)*.3,z+(j%2?-.25:.25));leaf.scale.set(.5,1.4,.45);plants.push(leaf)}
   }
   // metallic bull centerpiece
   const bull=new T.Group();bull.position.set(-10,1.1,-9.3);scene.add(bull);
   const torso=sphere(.56,"#bd8a49",0,.6,0,bull);torso.scale.set(1.7,.85,.7);
   sphere(.37,"#d3a467",.94,.8,0,bull);for(const dx of [-.6,.6])for(const dz of [-.25,.25])cylinder(.09,.12,.8,"#ad7b43",dx,.08,dz,bull);
   for(const dz of [-.3,.3]){const horn=cylinder(.02,.13,.55,"#e9c287",1.05,1.22,dz,bull);horn.rotation.z=-.55}
   const resize=()=>{const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)};const observer=new ResizeObserver(resize);observer.observe(host);resize();
   let frame=0,tick=0;
   const animate=()=>{frame=requestAnimationFrame(animate);tick++;
    heads.forEach((h,i)=>{h.rotation.y=Math.sin(tick*.009+i)*.17;h.rotation.x=Math.sin(tick*.015+i)*.08});
    hands.forEach((h,i)=>{h.rotation.x=Math.sin(tick*.08+i*2)*.12;h.rotation.z=Math.sin(tick*.06+i)*.1});
    if(tick%6===0)panels.forEach(p=>{p.draw(p.ctx,tick);p.texture.needsUpdate=true});
    renderer.render(scene,camera);
   };animate();
   dispose=()=>{cancelAnimationFrame(frame);observer.disconnect();scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose())}});canvasTextures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove()};
  }).catch(()=>{if(host)host.textContent="Erro ao carregar o ambiente 3D. Verifique a instalação do Three.js."});
  return()=>{cancelled=true;dispose()};
 },[]);
 return <div ref={root} className="scene3d"/>;
}
function Office(){
 const [step,setStep]=useState(0);
 useEffect(()=>{const id=setInterval(()=>setStep(v=>v+1),3500);return()=>clearInterval(id)},[]);
 const vals=agents.map((_,i)=>Math.round((42+i*17+Math.sin(step*.35+i)*19)*100)/100);
 const total=vals.reduce((a,b)=>a+b,0);
 const brl=(n:number)=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
 return <main className="app"><style>{`
 *{box-sizing:border-box}html,body{margin:0;background:#050b19;color:#eff7ff;font-family:Inter,Arial,sans-serif}.app{min-height:100vh;background:#050b19}.top{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 22px;background:#081426;border-bottom:1px solid #253a5d;flex-wrap:wrap}.brand{font-size:clamp(20px,2.2vw,32px);font-weight:900;letter-spacing:-1px}.brand span{color:#4cd7fa}.online{font-size:12px;color:#28edab}.dot{display:inline-block;background:#1eeaaa;width:8px;height:8px;border-radius:50%;margin-right:6px;box-shadow:0 0 9px #1eeaaa;animation:pulse 2s infinite}.ticker{display:flex;gap:8px;flex-wrap:wrap}.tick{padding:7px 12px;background:#0e1c33;border:1px solid #233955;border-radius:7px;font-size:11px}.tick b{display:block;color:#44e7b2;margin-top:4px}.stage{position:relative;min-height:580px;height:min(74vh,850px);overflow:hidden}.scene3d{width:100%;height:100%}.scene3d canvas{display:block;width:100%;height:100%}.metrics{position:absolute;top:18px;left:50%;transform:translateX(-50%);z-index:2;display:flex;gap:18px;align-items:center;justify-content:space-between;min-width:min(670px,85%);padding:16px 22px;background:#061328e8;border:1px solid #3670b1;border-radius:12px;box-shadow:0 10px 40px #0008;backdrop-filter:blur(10px)}.metrics small{display:block;font-size:10px;color:#a9bfd9;letter-spacing:1px}.metrics strong{font-size:clamp(20px,3vw,42px);color:#22efae}.metric-side{text-align:center}.metric-side strong{font-size:24px;color:#eff8ff}.bottom{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:12px;padding:12px 16px 22px;background:#071226}.card{background:#0b1a31;border:1px solid #233b5e;border-radius:12px;padding:14px;min-width:0}.card h2{font-size:13px;margin:0 0 12px}.agent{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #20314b;font-size:12px}.green{color:#2bedaa}.trade{font-size:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;padding:8px 0;border-bottom:1px solid #20314b}.buy{color:#2bedaa}.sell{color:#ff799b}.chart{width:100%;height:160px}.note{font-size:11px;color:#7896b6;padding:8px 17px 16px}.scene-label{position:absolute;bottom:18px;left:18px;z-index:2;font-size:11px;color:#b9d1f3;background:#07162ac9;border:1px solid #2a4569;padding:8px 12px;border-radius:8px}@keyframes pulse{50%{opacity:.35}}@media(max-width:850px){.top{padding:12px}.ticker{display:none}.stage{height:60vh;min-height:450px}.bottom{grid-template-columns:1fr}.metrics{top:10px;padding:10px;gap:8px;min-width:95%}.metric-side strong{font-size:17px}}@media(prefers-reduced-motion:reduce){.dot{animation:none}}
 `}</style>
 <header className="top"><div className="brand">FOREX <span>AI OFFICE</span> <span className="online"><i className="dot"/> DEMO</span></div><div className="ticker">{["EURUSD","GBPUSD","USDJPY","XAUUSD"].map((s,i)=><div className="tick" key={s}>{s}<b>{(1.083+i*.14+Math.sin(step*.3+i)*.003).toFixed(4)} ↗</b></div>)}</div><div style={{fontSize:12,color:"#a7c6e4"}}>{new Date().toLocaleTimeString("pt-BR")}</div></header>
 <section className="stage"><Scene/><div className="metrics"><div><small>RESULTADO DO ESCRITÓRIO · DEMO</small><strong>{brl(total)}</strong></div><div className="metric-side"><small>AGENTES</small><strong>6</strong></div><div className="metric-side"><small>OPERAÇÕES FICTÍCIAS</small><strong>{step*3}</strong></div></div><div className="scene-label"><i className="dot"/> SALA 3D ANIMADA · CÂMERA AUTOMÁTICA FIXA</div></section>
 <div className="bottom"><section className="card"><h2>RESULTADO POR AGENTE · DEMO</h2>{agents.map((a,i)=><div className="agent" key={a[0]}><span style={{color:a[2]}}>● {a[0]} <span style={{color:"#879fbe"}}>· {a[1]}</span></span><b className="green">{brl(vals[i])}</b></div>)}</section><section className="card"><h2>OPERAÇÕES SIMULADAS</h2>{[0,1,2,3,4,5].map(i=><div className="trade" key={i}><span>{agents[(i+step)%6][0]}</span><span className={i%2?"sell":"buy"}>{i%2?"SELL":"BUY"} · {agents[(i+step)%6][1]}</span><span className="green">{brl(vals[(i+step)%6])}</span></div>)}</section><section className="card"><h2>EVOLUÇÃO DO RESULTADO · DEMO</h2><svg className="chart" viewBox="0 0 350 160" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#10e8a1" stopOpacity=".4"/><stop offset="1" stopColor="#10e8a1" stopOpacity="0"/></linearGradient></defs>{[40,80,120].map(y=><path key={y} d={`M0 ${y} H350`} stroke="#27415d"/>)}<polygon fill="url(#area)" points={`0,160 ${Array.from({length:28},(_,i)=>`${i*13},${135-i*3+Math.sin(i*.8+step*.3)*9}`).join(" ")} 350,160`}/><polyline fill="none" stroke="#19f0ac" strokeWidth="3" points={Array.from({length:28},(_,i)=>`${i*13},${135-i*3+Math.sin(i*.8+step*.3)*9}`).join(" ")}/></svg></section></div>
 <div className="note">Ambiente visual 3D com personagens e gráficos animados. Todos os resultados são fictícios. Não há conexão ativa com MetaTrader 5 nem envio de ordens.</div>
 </main>;
}
