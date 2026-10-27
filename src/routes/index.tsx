import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: Office });

const money = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const agents = ["Nexus", "Atlas", "Luna", "Guardian", "Orion", "Vega"];
function Office() {
  const [tick, setTick] = useState(0);
  const [time, setTime] = useState("");
  const [imageMissing, setImageMissing] = useState(false);
  useEffect(() => {
    const update = () => { setTick(v => v + 1); setTime(new Date().toLocaleTimeString("pt-BR")); };
    update(); const timer = window.setInterval(update, 2800);
    return () => window.clearInterval(timer);
  }, []);
  const values = [412,356,228,124,83,50].map((v,i) => v + Math.sin(tick * .4 + i) * 9);
  const points = Array.from({length:25}, (_,i) => [i*15, 90-i*2.4+Math.sin(i*.8+tick*.35)*9]);
  const coords = points.map(p => p.join(",")).join(" ");
  return <main className="office-page">
    <section className="office-screen" aria-label="Forex AI Office, demonstração visual">
      <img className="office-art" src="/trading-office.png" alt="Escritório cinematográfico Forex AI Office" onError={() => setImageMissing(true)} />
      {imageMissing && <div className="missing-art">Imagem cinematográfica ainda não instalada.<small>Adicionar o arquivo aprovado em public/trading-office.png.</small></div>}
      <div className="office-glint" />
      <div className="office-live" title="Simulação em andamento" />
      <div className="office-pnl">+{money(values.reduce((a,b)=>a+b,0))}</div>
      <div className="office-clock">{time}</div>
      <div className="office-agents">{values.map((v,i)=><span key={agents[i]} title={agents[i]}>+{money(v)}</span>)}</div>
      <svg className="office-chart" viewBox="0 0 360 110" preserveAspectRatio="none" aria-label="Gráfico demonstrativo">
        <polygon points={`0,110 ${coords} 360,110`} fill="#0bdf8d" opacity=".16" />
        <polyline points={coords} stroke="#00f6a5" strokeWidth="2.8" fill="none" />
      </svg>
      <div className="office-demo">● VISUAL DEMO · DADOS SIMULADOS · SEM CONEXÃO MT5</div>
    </section>
    <style>{`
      .office-page{min-height:100vh;background:#020817;color:white;display:flex;align-items:center;justify-content:center;font:14px Inter,Arial,sans-serif}
      .office-screen{position:relative;width:100%;max-width:1672px;aspect-ratio:1672/941;overflow:hidden;background:#071126}
      .office-art{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
      .office-pnl,.office-clock,.office-agents,.office-chart,.office-live,.office-demo{position:absolute;z-index:3}
      .office-pnl{top:15.4%;left:41.4%;background:#071328e8;border-radius:6px;color:#00f7a5;font-weight:900;font-size:clamp(17px,3.2vw,51px);padding:0 5px}
      .office-clock{top:4%;right:7.2%;background:#08172bf5;padding:4px;color:#fff;font-size:clamp(9px,1.1vw,18px);font-weight:bold}
      .office-live{top:2.6%;left:19.7%;width:9px;height:9px;border-radius:50%;background:#00f6a7;box-shadow:0 0 15px #00f6a7;animation:office-pulse 2s infinite}
      .office-agents{left:23.2%;bottom:4.7%;height:17%;display:flex;flex-direction:column;justify-content:space-between}
      .office-agents span{display:block;background:#07162de8;color:#20f6ac;font-size:clamp(7px,.85vw,14px);font-weight:700;text-align:right}
      .office-chart{right:2%;bottom:8%;width:22.8%;height:13.7%;overflow:visible;filter:drop-shadow(0 0 2px #00ff9d)}
      .office-glint{position:absolute;inset:7% 2% 27% 10%;background:linear-gradient(110deg,transparent 20%,#eac6ff0a 47%,transparent 60%);animation:office-glide 9s linear infinite;pointer-events:none;z-index:2}
      .office-demo{bottom:2%;left:1%;background:#07162ee8;border:1px solid #26bd92;padding:5px 8px;color:#40f5b9;font-size:clamp(7px,.8vw,13px);border-radius:5px}
      .missing-art{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#071126;color:#fff;font-size:22px;padding:24px}
      .missing-art small{font-size:13px;margin-top:12px;color:#9ab}
      @keyframes office-pulse{50%{opacity:.3}}@keyframes office-glide{from{transform:translateX(-35%)}to{transform:translateX(35%)}}
      @media(max-width:650px){.office-screen{min-height:330px}.office-art{object-fit:cover}.office-demo{font-size:9px}}
      @media(prefers-reduced-motion:reduce){.office-live,.office-glint{animation:none}}
    `}</style>
  </main>;
}
