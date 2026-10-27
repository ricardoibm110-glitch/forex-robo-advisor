import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
export const Route=createFileRoute("/")({component:Office});
type Trader={name:string;market:string;job:string;color:string};
const traders:Trader[]=[
{name:"ATLAS",market:"EUR/USD",job:"Tendência",color:"#23e8d4"},
{name:"LUNA",market:"GBP/USD",job:"Bollinger",color:"#c398ff"},
{name:"ORION",market:"USD/JPY",job:"Rompimento",color:"#58a8ff"},
{name:"VEGA",market:"XAU/USD",job:"Scalping",color:"#ffca74"},
{name:"NEXUS",market:"AUD/USD",job:"Análise",color:"#ff84cc"},
{name:"GUARDIAN",market:"GERAL",job:"Risco",color:"#65e8a1"}];
function Monitor({x,y,seed=0,scale=1}:{x:number;y:number;seed?:number;scale?:number}){
 const points=Array.from({length:18},(_,i)=>[8+i*7,36+Math.sin(i*.83+seed)*11+Math.sin(i*.27+seed)*9]);
 return <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <rect x="-4" y="-5" width="147" height="85" rx="5" fill="#060b19" stroke="#364f76" strokeWidth="2"/>
  <rect x="1" y="0" width="137" height="70" rx="2" fill="#07172b"/>
  {Array.from({length:4},(_,i)=><path key={i} d={`M 0 ${16+i*15} H 138`} stroke="#203653" strokeWidth=".7"/>)}
  <text x="7" y="12" fontSize="7" fill="#7fa9c9" fontFamily="monospace">FX  /  M1</text>
  <polyline className="chart-line" points={points.map(p=>p.join(",")).join(" ")} fill="none" stroke={seed%2?"#a18aff":"#26e9c0"} strokeWidth="2" strokeLinecap="round"/>
  <path d="M69 80 V91" stroke="#536e91" strokeWidth="5"/><path d="M48 91 H90" stroke="#536e91" strokeWidth="4" strokeLinecap="round"/>
 </g>
}
function Worker({x,y,index}:{x:number;y:number;index:number}){
 const t=traders[index];
 return <g transform={`translate(${x} ${y})`}>
  <ellipse cx="0" cy="80" rx="115" ry="28" fill="#020715" opacity=".5"/>
  <path d="M-108 12 L0 -46 L112 13 L2 74 Z" fill="#19253e" stroke="#66718d" strokeWidth="2"/>
  <path d="M-108 12 L2 74 L2 85 L-108 22 Z" fill="#0b1429"/>
  <path d="M2 74 L112 13 L112 24 L2 85 Z" fill="#293750"/>
  <path d="M-100 13 L0 -38 L105 14 L2 66 Z" fill="#40516a"/>
  <path d="M-94 14 L0 -33 L98 14 L2 60 Z" fill="#293d57"/>
  <g transform="translate(-73,-69) scale(.72)"><Monitor x={0} y={0} seed={index}/></g>
  <g transform="translate(11,-80) scale(.72)"><Monitor x={0} y={0} seed={index+1}/></g>
  <path d="M-27 24 L1 9 L36 28 L9 43 Z" fill="#121c30" stroke="#63738c"/>
  <g className="worker" style={{animationDelay:`${index*-.41}s`}}>
   <path d="M-22 77 L-35 58 L-34 14 L-14 3 L8 18 L10 64 L0 80 Z" fill={t.color} opacity=".9" stroke="#10172a" strokeWidth="2"/>
   <path d="M-14 24 Q-25 34 -18 48 L-4 55" fill="none" stroke="#b88978" strokeWidth="10" strokeLinecap="round"/>
   <path className="typing" d="M9 24 Q18 36 26 42 L35 37" fill="none" stroke="#c89480" strokeWidth="9" strokeLinecap="round"/>
   <ellipse cx="-5" cy="2" rx="19" ry="23" fill="#c98e74"/>
   <path d="M-24 -4 Q-25 -26 -8 -26 Q15 -29 15 -8 Q0 -17 -11 -12 L-23 -2" fill={index%2?"#352339":"#1c2437"}/>
   <path d="M-22 1 Q-29 9 -26 15" stroke="#202438" strokeWidth="7" fill="none"/>
  </g>
  <path d="M-35 48 Q-65 48 -59 86 L-35 99 L5 80 L9 57" fill="#182440" stroke="#5b698a" strokeWidth="3"/>
  <path d="M-25 105 L0 120 L25 105" fill="#15253e"/>
  <rect x="-57" y="-118" width="114" height="24" rx="12" fill="#071526" stroke={t.color} strokeOpacity=".7"/>
  <circle cx="-42" cy="-106" r="4" fill={t.color}/><text x="-31" y="-102" fontSize="11" fontWeight="bold" fill="#effaff">{t.name}</text>
 </g>
}
function Room(){
 return <div className="room-wrap"><svg viewBox="0 0 1280 800" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Escritório virtual animado com seis operadores, telas e resultados">
 <defs>
  <linearGradient id="floor" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#192a50"/><stop offset=".5" stopColor="#111a36"/><stop offset="1" stopColor="#241c46"/></linearGradient>
  <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#101a41"/><stop offset="1" stopColor="#0b2850"/></linearGradient>
  <radialGradient id="glow"><stop stopColor="#5c47db" stopOpacity=".45"/><stop offset="1" stopColor="#080d22" stopOpacity="0"/></radialGradient>
  <filter id="shadow"><feGaussianBlur stdDeviation="13"/></filter>
 </defs>
 <rect width="1280" height="800" fill="#080e20"/>
 <ellipse cx="720" cy="450" rx="650" ry="360" fill="url(#glow)"/>
 <path d="M115 185 L605 20 L1190 191 L1190 525 L625 777 L115 536 Z" fill="url(#floor)" stroke="#4c598e" strokeWidth="3"/>
 <path d="M115 185 L605 20 L1190 191 L698 370 Z" fill="#122042"/>
 <path d="M115 185 L605 20 L605 304 L115 480 Z" fill="#0c1b35"/>
 <path d="M605 20 L1190 191 L1190 487 L605 304 Z" fill="url(#glass)" stroke="#425586" strokeWidth="3"/>
 {Array.from({length:8},(_,i)=><g key={i}><path d={`M${635+i*72} ${29+i*21} L${635+i*72} ${313+i*21}`} stroke="#6271a5" strokeWidth="5"/><path d={`M${640+i*72} ${90+i*21} L${695+i*72} ${106+i*21}`} stroke="#243f72" strokeWidth="1"/></g>)}
 {Array.from({length:30},(_,i)=>{const x=650+(i*67)%510,y=175+(i*43)%180;return <rect key={i} x={x} y={y} width={i%3===0?15:6} height={i%4===0?31:13} fill={i%4===0?"#4a6bb8":"#ffb0db"} opacity=".45"/>})}
 <path d="M115 480 L605 304 L1190 487" fill="none" stroke="#9857ff" strokeWidth="6" opacity=".8"/>
 <path d="M115 536 L625 777 L1190 525" fill="none" stroke="#2c9fff" strokeWidth="6" opacity=".7"/>
 <g transform="translate(655 105) skewY(15)"><rect x="0" y="0" width="350" height="100" rx="5" fill="#080f25" stroke="#7757d3" strokeWidth="3"/><text x="175" y="25" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#b7d9ff">TRADING AI OFFICE</text><text x="75" y="56" textAnchor="middle" fontSize="11" fill="#7fa6c8">P&L DEMO</text><text x="75" y="78" textAnchor="middle" fontSize="23" fill="#39efc4">LIVE</text><text x="260" y="56" textAnchor="middle" fontSize="11" fill="#7fa6c8">AGENTES</text><text x="260" y="78" textAnchor="middle" fontSize="23" fill="#fff">06</text></g>
 <g opacity=".8"><path d="M150 530 L590 324" stroke="#54469c" strokeWidth="3"/><path d="M300 610 L760 384" stroke="#54469c" strokeWidth="3"/><path d="M450 680 L910 449" stroke="#54469c" strokeWidth="3"/></g>
 <g transform="translate(118 290)"><rect x="0" y="0" width="150" height="122" rx="4" fill="#09162b" stroke="#586b9b" strokeWidth="3"/><text x="75" y="22" textAnchor="middle" fill="#b4d8ff" fontSize="11">MARKET OVERVIEW</text>{[0,1,2].map(i=><g key={i}><text x="10" y={46+i*27} fill="#9bb7d6" fontSize="10">{["EURUSD","USDJPY","XAUUSD"][i]}</text><text x="138" y={46+i*27} textAnchor="end" fill={i===1?"#ff7da7":"#2aebbf"} fontSize="11">{i===1?"▼":"▲"} {["0.42%","0.18%","0.67%"][i]}</text></g>)}</g>
 <Worker x={340} y={330} index={0}/><Worker x={645} y={300} index={1}/><Worker x={955} y={344} index={2}/>
 <Worker x={350} y={575} index={3}/><Worker x={655} y={556} index={4}/><Worker x={957} y={587} index={5}/>
 <g transform="translate(1100 610)"><path d="M0 65 L-14 15 L18 15 L10 65" fill="#34445c"/><path d="M0 18 Q-48 -10 -28 -40 Q0 -27 0 18 M0 18 Q43 -20 24 -55 Q-2 -31 0 18 M0 15 Q-42 -40 -52 -13 Q-31 12 0 15" fill="#287e73" stroke="#46c7a1" strokeWidth="3"/></g>
 <path d="M140 490 L580 320" stroke="#aa66ff" strokeWidth="3" opacity=".5"/>
 </svg><div className="room-caption"><span className="pulse"/> CENTRAL VIRTUAL EM ATIVIDADE <span className="caption-right">VISUALIZAÇÃO AUTOMÁTICA · DEMO</span></div></div>
}
function Office(){
 const [tick,setTick]=useState(0);
 useEffect(()=>{const id=setInterval(()=>setTick(t=>t+1),3200);return()=>clearInterval(id)},[]);
 const value=(i:number)=>Number((Math.sin(tick*.43+i*1.8)*86+Math.sin(tick*.15+i)*32).toFixed(2));
 const total=traders.reduce((sum,_,i)=>sum+value(i),0);
 const money=(n:number)=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
 return <main className="app"><style>{`
 *{box-sizing:border-box}body{margin:0;background:#060b19}.app{min-height:100vh;background:radial-gradient(ellipse at 50% 0,#172044,#060b19 72%);font-family:Inter,Arial,sans-serif;color:#eff7ff;padding:18px clamp(12px,3vw,45px) 40px}
 .header{display:flex;align-items:center;justify-content:space-between;gap:15px;flex-wrap:wrap;margin-bottom:17px}.eyebrow{color:#59c8ff;font-size:11px;letter-spacing:3px;font-weight:800}.title{font-size:clamp(22px,2.7vw,37px);font-weight:900;margin:5px 0}.subtitle{font-size:12px;color:#9eb0d1}.status{display:flex;align-items:center;gap:8px;font-size:12px;color:#6df3b9;background:#112a31;padding:12px 15px;border:1px solid #276d63;border-radius:25px}.pulse{display:inline-block;width:8px;height:8px;background:#35e8a6;border-radius:50%;box-shadow:0 0 13px #30ffc2;animation:blink 2s infinite}
 .stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:11px;margin-bottom:14px}.stat{background:linear-gradient(145deg,#111e39,#0c162b);border:1px solid #273b60;border-radius:12px;padding:16px;min-height:100px}.stat small{display:block;color:#8da8c7;font-size:10px;letter-spacing:1px}.stat strong{display:block;font-size:clamp(17px,2.3vw,29px);margin-top:13px}.positive{color:#37eab4!important}.negative{color:#ff8ca6!important}
 .room-wrap{background:#080f24;border:1px solid #354576;border-radius:14px;overflow:hidden;box-shadow:0 15px 55px #0008;position:relative}.room-wrap svg{display:block;width:100%;max-height:75vh;min-height:390px}.room-caption{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:12px 18px;background:#0c1630;color:#a8c3e7;font-size:11px;letter-spacing:1.2px;border-top:1px solid #253c67}.caption-right{color:#6f8aa9}
 .bottom{display:grid;grid-template-columns:2fr 1fr;gap:13px;margin-top:14px}.card{background:#0e1930;border:1px solid #263a5a;border-radius:12px;padding:17px}.card h2{font-size:15px;margin:0 0 14px}.agents{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.agent{background:#121f3a;border:1px solid #2a3e5c;border-radius:9px;padding:12px}.agent-title{display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:800}.agent small{display:block;color:#8ba7c8;margin:8px 0}.agent-result{font-size:18px;font-weight:800}.log{font-size:12px;color:#a8bbd7;padding:10px 0;border-bottom:1px solid #243450}.log span{color:#3be5b4;margin-right:8px}
 .chart-line{stroke-dasharray:250;stroke-dashoffset:0;animation:chart 7s linear infinite}.worker{animation:work 2.1s ease-in-out infinite;transform-origin:0 35px}.typing{animation:type 1s ease-in-out infinite;transform-origin:9px 24px}@keyframes work{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}@keyframes type{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(5deg)}}@keyframes chart{0%{stroke-dashoffset:250}100%{stroke-dashoffset:0}}@keyframes blink{50%{opacity:.35}}
 @media(max-width:850px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}.bottom{grid-template-columns:1fr}.agents{grid-template-columns:repeat(2,minmax(0,1fr))}.room-wrap svg{min-height:270px}.caption-right{display:none}}
 @media(prefers-reduced-motion:reduce){.worker,.typing,.chart-line,.pulse{animation:none}}
 `}</style>
 <header className="header"><div><div className="eyebrow">FOREX ROBO ADVISOR / VIRTUAL DESK</div><h1 className="title">TRADING <span style={{color:"#64b8ff"}}>AI OFFICE</span></h1><div className="subtitle">Escritório virtual de agentes · visualização de resultados em tempo real simulado</div></div><div className="status"><span className="pulse"/> MODO DEMONSTRATIVO · SEM ORDENS REAIS</div></header>
 <section className="stats"><div className="stat"><small>RESULTADO TOTAL · DEMO</small><strong className={total>=0?"positive":"negative"}>{money(total)}</strong></div><div className="stat"><small>AGENTES ATIVOS</small><strong>06 <span style={{fontSize:12,color:"#4de7b6"}}>● ONLINE</span></strong></div><div className="stat"><small>OPERAÇÕES SIMULADAS</small><strong>{(tick*3).toLocaleString("pt-BR")}</strong></div><div className="stat"><small>MERCADOS MONITORADOS</small><strong>05</strong></div><div className="stat"><small>AMBIENTE</small><strong style={{color:"#a88bff"}}>VISUAL DEMO</strong></div></section>
 <Room/>
 <div className="bottom"><section className="card"><h2>◈ Desempenho dos agentes · valores fictícios</h2><div className="agents">{traders.map((t,i)=><div className="agent" key={t.name}><div className="agent-title"><span style={{color:t.color}}>● {t.name}</span><span style={{color:"#47dca8",fontSize:10}}>ATIVO</span></div><small>{t.market} · {t.job}</small><div className={`agent-result ${value(i)>=0?"positive":"negative"}`}>{money(value(i))}</div></div>)}</div></section><section className="card"><h2>◉ Feed de atividade · simulação</h2>{[0,1,2,3].map(i=><div className="log" key={i}><span>●</span>{["Análise de tendência concluída","Mercados atualizados","Monitoramento de volatilidade","Limites de risco verificados"][(tick+i)%4]} <small style={{float:"right",color:"#6988aa"}}>{new Date().toLocaleTimeString("pt-BR")}</small></div>)}<p style={{fontSize:11,color:"#7f9cbd",lineHeight:1.6,marginTop:20}}>Esta versão é uma vitrine animada. Os resultados são gerados localmente para demonstrar a interface; não representam operações financeiras ou conexão ao MetaTrader 5.</p></section></div>
 </main>;
}
