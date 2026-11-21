import { AlertTriangle, CheckCircle2, ClipboardList, HeartPulse, Stethoscope, ShieldAlert } from 'lucide-react';

function Section({ icon, title, children, className = '' }) {
  return <section className={`result-card ${className}`}><h3>{icon}{title}</h3>{children}</section>;
}

export default function ResultDashboard({ result, onReset }) {
  const summary = result.patient_summary || {};
  const blood = result.blood_report_analysis || {};
  const combined = result.combined_analysis || {};
  const risk = result.risk_assessment || {};
  const recommendations = result.recommendations || {};
  const isEmergency = risk.risk_level === 'emergency';

  return (
    <main className="results-page">
      <div className="results-top">
        <div><p className="eyebrow">Assessment complete</p><h1>Your health overview</h1></div>
        <button className="secondary-button" onClick={onReset}>New assessment</button>
      </div>
      {result.analysisStatus === 'demo' && <div className="demo-banner"><AlertTriangle size={18}/> Demo mode: no LLM credential is configured. This is not a clinical assessment.</div>}
      {isEmergency && <div className="emergency-banner"><ShieldAlert size={22}/><div><strong>Seek immediate medical attention</strong><p>If in India, call 112 or visit the nearest emergency department.</p></div></div>}
      <div className="risk-strip">
        <div><span>Overall risk</span><strong className={`risk-${risk.risk_level}`}>{String(risk.risk_level || 'undetermined').replace('_',' ')}</strong></div>
        <p>{risk.reason || 'No risk reason was provided.'}</p>
      </div>
      <div className="results-grid">
        <Section icon={<ClipboardList/>} title="Patient summary">
          <p className="label">Symptoms identified</p>
          <div className="tag-row">{summary.symptoms_identified?.length ? summary.symptoms_identified.map((item) => <span key={item}>{item}</span>) : <span>None reported</span>}</div>
          <dl><dt>Duration</dt><dd>{summary.symptom_duration || 'Unknown'}</dd><dt>Severity</dt><dd>{summary.severity || 'Unknown'}</dd></dl>
        </Section>
        <Section icon={<HeartPulse/>} title="Blood report analysis">
          <p className="status-label">Status: <strong>{blood.overall_status?.replaceAll('_',' ')}</strong></p>
          {blood.abnormal_parameters?.length ? blood.abnormal_parameters.map((item, i) => <div className="lab-result" key={i}><strong>{item.parameter}</strong><span>{item.patient_value} {item.unit}</span><small>{item.interpretation}</small></div>) : <p className="muted">No abnormal parameters were reliably identified.</p>}
          {blood.limitations?.length > 0 && <ul>{blood.limitations.map((item, i) => <li key={i}>{item}</li>)}</ul>}
        </Section>
        <Section icon={<Stethoscope/>} title="Combined analysis" className="wide">
          {combined.symptom_and_audio_comparison && <p>{combined.symptom_and_audio_comparison}</p>}
          {combined.blood_report_and_symptom_correlation && <p>{combined.blood_report_and_symptom_correlation}</p>}
          {combined.important_findings?.length > 0 && <ul>{combined.important_findings.map((item, i) => <li key={i}>{item}</li>)}</ul>}
        </Section>
        <Section icon={<CheckCircle2/>} title="Possible conditions" className="wide">
          {result.possible_conditions?.length ? result.possible_conditions.map((item, i) => <article className="condition" key={i}><h4>{item.condition}</h4><p>{item.reason}</p></article>) : <p className="muted">No condition could be assessed reliably from the supplied information.</p>}
        </Section>
        <Section icon={<AlertTriangle/>} title="Recommendations" className="wide">
          <div className="recommendations">
            <div><h4>Immediate actions</h4><ul>{recommendations.immediate_actions?.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
            <div><h4>Doctor consultation</h4><p>{recommendations.doctor_consultation}</p></div>
            <div><h4>Home care</h4><ul>{recommendations.home_care?.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
          </div>
        </Section>
        {result.follow_up_questions?.length > 0 && <Section icon={<ClipboardList/>} title="Follow-up questions" className="wide"><ul>{result.follow_up_questions.map((item, i) => <li key={i}>{item}</li>)}</ul></Section>}
      </div>
      <div className="disclaimer"><strong>Medical disclaimer</strong><p>{result.disclaimer}</p></div>
    </main>
  );
}
