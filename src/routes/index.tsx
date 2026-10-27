import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({ component: Office });
type Agent = { name: string; role: string; market: string; color: string; paused: boolean; pnl: number; trades: number };
const starting: Agent[] = [
  {name:"Atlas",role:"Tendência",market:"EURUSD",color:"#35dfcb",paused:false,pnl:0,trades:0},
  {name:"Luna",role:"Bollinger",market:"USDJPY",color:"#9a78ff",paused:false,pnl:0,trades:0},
  {name:"Orion",role:"Rompimentos",market:"GBPUSD",color:"#51afff",paused:false,pnl:0,trades:0},
  {name:"Vega",role:"Scalping M1",market:"XAUUSD",color:"#ffc467",paused:false,pnl:0,trades:0},
  {name:"Nexus",role:"Contexto",market:"EURJPY",color:"#f383c2",paused:false,pnl:0,trades:0},
  {name:"Guardian",role:"Risco",market:"GERAL",color:"#f5a079",paused:false,pnl:0,trades:0}
];
function Office(){
  const [agents,setAgents]=useState(starting);
  const [selected,setSelected]=useState(0);
  const [running,setRunning]=useState(false);
  const [events,setEvents]=useState<string[]>(["Ambiente DEMO inicializado; nenhuma operação real será enviada."]);
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const root=host.current;if(!root)return;
    let raf=0,renderer:import("three").WebGLRenderer|undefined,observer:ResizeObserver|undefined;
    let disposed=false;
    import("three").then(T=>{
      if(disposed)return;
      const scene=new T.Scene();scene.background=new T.Color("#11132b");
      const camera=new T.PerspectiveCamera(45,1,.1,100);camera.position.set(10,13,17);camera.lookAt(0,0,0);
      renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));root.appendChild(renderer.domElement);
      scene.add(new T.HemisphereLight(0xd8e3ff,0x252443,3));
      const light=new T.DirectionalLight(0xffffff,2);light.position.set(4,10,6);scene.add(light);
      const material=(color:string)=>new T.MeshStandardMaterial({color,roughness:.52});
      const cube=(w:number,h:number,d:number,c:string,x:number,y:number,z:number,parent:T.Object3D=scene)=>{
        const m=new T.Mesh(new T.BoxGeometry(w,h,d),material(c));m.position.set(x,y,z);parent.add(m);return m;
      };
      cube(15,.35,11,"#28243d",0,-.24,0);
      const stations:T.Group[]=[];
      starting.forEach((a,i)=>{
        const g=new T.Group();g.position.set((i%3-1)*4.4,0,(Math.floor(i/3)-.5)*4.7);scene.add(g);stations.push(g);
        cube(3.6,.1,3.6,a.color,0,.03,0,g);
        cube(3.4,.13,3.4,"#1d2137",0,.15,0,g);
        cube(2.7,.14,1.1,"#555b76",0,1.07,-.65,g);
        [-1,1].forEach(dx=>cube(.12,.88,.12,"#505570",dx,.6,-.65,g));
        cube(1.5,.9,.1,"#151b31",0,1.75,-1.04,g);
        cube(1.36,.72,.03,a.color,0,1.75,-.97,g);
        cube(.12,.35,.12,"#656984",0,1.27,-1.04,g);
        cube(.85,.12,.85,"#55526e",0,.47,.75,g);
        cube(.12,.68,.12,"#484b66",0,.82,.75,g);
        const torso=new T.Mesh(new T.CapsuleGeometry(.33,.62,4,10),material(a.color));torso.position.set(0,1.28,.7);g.add(torso);
        const head=new T.Mesh(new T.SphereGeometry(.25,12,12),material("#eebc9f"));head.position.set(0,1.96,.7);g.add(head);
      });
      const pointer=new T.Vector2(),ray=new T.Raycaster();
      const click=(e:MouseEvent)=>{
        if(!renderer)return;
        const rect=renderer.domElement.getBoundingClientRect();
        pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
        ray.setFromCamera(pointer,camera);
        const hits=ray.intersectObjects(stations,true);
        if(hits.length){let node:T.Object3D|null=hits[0].object;while(node&&!stations.includes(node as T.Group))node=node.parent;const index=stations.indexOf(node as T.Group);if(index>=0)setSelected(index)}
      };
      renderer.domElement.addEventListener("click",click);
      const resize=()=>{if(!renderer)return;const w=root.clientWidth,h=root.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)};
      observer=new ResizeObserver(resize);observer.observe(root);resize();
      const draw=()=>{raf=requestAnimationFrame(draw);renderer?.render(scene,camera)};draw();
      return()=>{renderer?.domElement.removeEventListener("click",click)};
    }).catch(()=>setEvents(v=>["Falha ao carregar visualização 3D.",...v]));
    return()=>{disposed=true;cancelAnimationFrame(raf);observer?.disconnect();if(renderer){renderer.domElement.remove();renderer.dispose()}};
  },[]);
  useEffect(()=>{
    if(!running)return;
    const id=setInterval(()=>{
      setAgents(items=>items.map((a,i)=>a.paused||i===5?a:{...a,pnl:Number((a.pnl+(Math.random()-.52)*23).toFixed(2)),trades:a.trades+1}));
      setEvents(items=>["Ciclo fictício gerado às "+new Date().toLocaleTimeString("pt-BR"),...items].slice(0,8));
    },4000);
    return()=>clearInterval(id);
  },[running]);
  const toggle=(i:number)=>setAgents(items=>items.map((a,j)=>i===j?{...a,paused:!a.paused}:a));
  const total=agents.reduce((v,a)=>v+a.pnl,0);
  const panel:React.CSSProperties={background:"#171d34",border:"1px solid #2d3553",padding:18,borderRadius:14};
  const button:React.CSSProperties={background:"#5479ff",color:"white",border:0,borderRadius:10,padding:"11px 15px",cursor:"pointer",fontWeight:700};
  return <main style={{minHeight:"100vh",background:"#0c1123",color:"#f0f4ff",fontFamily:"Inter,system-ui,sans-serif",padding:20}}>
    <div style={{maxWidth:1300,margin:"auto"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <div><small style={{color:"#55e5cd",letterSpacing:2}}>FOREX ROBO ADVISOR</small><h1 style={{fontSize:30,fontWeight:800,margin:0}}>Trading AI Office <small style={{fontSize:13,color:"#aab4d4"}}>v0.1</small></h1></div>
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{background:"#5a401e",color:"#ffdb96",borderRadius:30,padding:10,fontSize:12}}>● DEMO — valores fictícios</span><button style={button} onClick={()=>setRunning(v=>!v)}>{running?"⏸ Pausar simulação":"▶ Iniciar simulação"}</button></div>
      </header>
      <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:15}}>
        {([["Resultado fictício",total.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})],["Agentes ativos",String(agents.filter(a=>!a.paused).length)],["Operações fictícias",String(agents.reduce((v,a)=>v+a.trades,0))],["Simulação",running?"RODANDO":"PARADA"]] as const).map(([label,value])=><div key={label} style={panel}><div style={{fontSize:12,color:"#aeb6d5"}}>{label}</div><div style={{fontSize:25,fontWeight:800,marginTop:9}}>{value}</div></div>)}
      </section>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        <section style={{...panel,flex:"2 1 560px",padding:0,overflow:"hidden"}}><div style={{padding:15,fontWeight:700}}>🏢 Escritório virtual — clique nas mesas</div><div ref={host} style={{width:"100%",height:"min(61vh,530px)",minHeight:320}}/><div style={{padding:13,color:"#aeb6d5",fontSize:12}}>Cena tridimensional ilustrativa. Sem acesso à corretora ou ao MetaTrader 5.</div></section>
        <aside style={{flex:"1 1 260px",display:"flex",flexDirection:"column",gap:12}}>
          <section style={panel}><h2 style={{fontSize:18,marginTop:0}}>Agentes</h2>{agents.map((a,i)=><button key={a.name} onClick={()=>setSelected(i)} style={{background:selected===i?"#2b3654":"transparent",border:"1px solid "+(selected===i?a.color:"#303956"),borderRadius:10,padding:10,marginBottom:7,textAlign:"left",color:"white",width:"100%",cursor:"pointer",display:"flex",justifyContent:"space-between"}}><span><strong style={{color:a.color}}>{a.name}</strong><br/><small style={{color:"#b4bed6"}}>{a.market} · {a.role}</small></span><small>{a.paused?"⏸":"●"}</small></button>)}</section>
          <section style={panel}><h2 style={{fontSize:18,marginTop:0}}>{agents[selected].name}</h2><p style={{color:"#bdc7df",fontSize:13}}>Resultado fictício: {agents[selected].pnl.toFixed(2)}<br/>Operações fictícias: {agents[selected].trades}</p><button style={{...button,width:"100%"}} onClick={()=>toggle(selected)}>{agents[selected].paused?"Retomar agente":"Pausar agente"}</button></section>
        </aside>
      </div>
      <section style={{...panel,marginTop:14}}><h2 style={{marginTop:0,fontSize:17}}>Log demonstrativo</h2>{events.map((e,i)=><div key={i} style={{borderTop:"1px solid #303956",padding:8,color:"#b9c3df",fontSize:13}}>{e}</div>)}</section>
    </div>
  </main>;
}
