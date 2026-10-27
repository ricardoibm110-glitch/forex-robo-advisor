import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
export const Route = createFileRoute("/")({ component: TradingOffice });
const people=[["Nexus","XAUUSD"],["Atlas","EURUSD"],["Luna","GBPUSD"],["Guardian","Risco"],["Orion","USDJPY"],["Vega","XAUUSD"]] as const;
function TradingOffice(){
 const [t,setT]=useState(0);
 useEffect(()=>{const id=window.setInterval(()=>setT(x=>x+1),3500);return()=>window.clearInterval(id)},[]);
 const results=people.map((_,i)=>Math.round((65+Math.sin(t*.32+i*.8)*20+i*17)*100)/100);
 const total=results.reduce((a,b)=>a+b,0);
 const money=(n:number)=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
 const clock=new Date().toLocaleTimeString("pt-BR");
 return <main className="office-page">
 <style>{`
 *{box-sizing:border-box}html,body{margin:0;background:#030c1e;color:#eff8ff;font-family:Inter,Arial,sans-serif}.office-page{min-height:100vh;background:linear-gradient(130deg,#030b19,#111d3c);overflow-x:auto}.scene{position:relative;min-width:1020px;width:100%;max-width:1920px;margin:0 auto;aspect-ratio:1672/941;background:#06152b;overflow:hidden}.reference{position:absolute;inset:0;width:100%;height:100%;object-fit:fill}.fallback{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,#23488c,#0a1634 60%,#030b1b);display:flex;align-items:center;justify-content:center;color:#a9c7ec;letter-spacing:2px;font-size:16px}.reference{z-index:1}.dynamic{position:absolute;z-index:2}.value{background:#07172bf5;padding:3px 8px;border-radius:6px;color:#0df5a0;font-weight:900;white-space:nowrap;box-shadow:0 0 16px #001a2e}.total{top:16%;left:41%;font-size:clamp(18px,3.1vw,47px)}.timestamp{top:4.2%;left:85.7%;font-size:clamp(11px,1.15vw,20px);color:#e8f7ff}.demo{bottom:3.3%;left:1.4%;font-size:clamp(9px,.8vw,13px);background:#08182aef;padding:6px;border:1px solid #1a9f83;border-radius:5px;color:#51f3bc}.agent-values{bottom:4.2%;left:23%;width:7.5%;height:17.6%;display:flex;flex-direction:column;justify-content:space-between}.agent-value{font-size:clamp(10px,.85vw,16px);line-height:1.4;text-align:right}.chart-overlay{bottom:7.7%;right:2%;width:23%;height:13%;pointer-events:none}.chart-overlay polyline{fill:none;stroke:#14f3a2;stroke-width:3;stroke-linejoin:round}.chart-overlay polygon{fill:#08b96b;opacity:.13}.live{top:2%;left:19.8%;height:9px;width:9px;border-radius:50%;background:#05f6a5;box-shadow:0 0 13px #0af6a5;animation:pulse 2s infinite}.shine{position:absolute;z-index:2;top:27%;left:21%;width:58%;height:38%;background:linear-gradient(100deg,transparent 30%,#8f5dff08 50%,transparent 70%);animation:shine 8s linear infinite;pointer-events:none}.notice{position:relative;max-width:1920px;margin:auto;padding:10px 17px;font-size:12px;color:#91aac7;background:#061327;border-top:1px solid #1d3458}.missing{position:absolute;z-index:3;left:50%;top:50%;transform:translate(-50%,-50%);max-width:500px;text-align:center;padding:20px;background:#061629ee;border:1px solid #4163a4;border-radius:12px}.missing h2{margin:0 0 10px;font-size:19px}.missing p{font-size:13px;line-height:1.5;color:#b8cfe9}@keyframes pulse{50%{opacity:.4}}@keyframes shine{from{transform:translateX(-70%)}to{transform:translateX(75%)}}@media(prefers-reduced-motion:reduce){.live,.shine{animation:none}}
 `}</style>
 <div className="scene">
  <div className="fallback">FOREX AI OFFICE</div>
  <img className="reference" src="/trading-office.webp" alt="Escritório virtual cinematográfico de trading com operadores e monitores" onError={e=>{e.currentTarget.style.display="none";const m=document.getElementById("missing-asset");if(m)m.style.display="block"}} onLoad={()=>{const m=document.getElementById("missing-asset");if(m)m.style.display="none"}}/>
  <div className="missing" id="missing-asset" style={{display:"none"}}><h2>Imagem do escritório ainda não instalada</h2><p>Adicione o arquivo <b>public/trading-office.webp</b> ao projeto. O layout já está pronto para reproduzir a imagem aprovada, com os resultados sobrepostos.</p></div>
  <div className="dynamic live"/>
  <div className="dynamic value total">{money(total)}</div>
  <div className="dynamic value timestamp">{clock}</div>
  <div className="dynamic agent-values">{results.map((v,i)=><div key={people[i][0]} className="value agent-value">+{money(v)}</div>)}</div>
  <svg className="dynamic chart-overlay" viewBox="0 0 400 100" preserveAspectRatio="none"><polygon points={`0,100 ${Array.from({length:23},(_,i)=>`${i*18},${85-i*2.7+Math.sin(i*.9+t*.4)*8}`).join(" ")} 400,100`}/><polyline points={Array.from({length:23},(_,i)=>`${i*18},${85-i*2.7+Math.sin(i*.9+t*.4)*8}`).join(" ")}/></svg>
  <div className="dynamic demo">● DEMO VISUAL · MT5 NÃO CONECTADO</div>
  <div className="shine"/>
 </div>
 <div className="notice">Visualização demonstrativa: valores e operações são simulados. Nenhuma operação real é executada ou consultada no MetaTrader 5.</div>
 </main>;
}
