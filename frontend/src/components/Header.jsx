import { Activity, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark"><Activity size={22} /></span>
        <span>Viral Infection Early Predictor</span>
      </div>
      <div className="secure-label"><ShieldCheck size={16} /> Secure assessment</div>
    </header>
  );
}
