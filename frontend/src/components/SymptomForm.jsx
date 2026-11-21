const symptoms = ['Fever', 'Headache', 'Body pain', 'Fatigue', 'Cough', 'Cold', 'Sore throat', 'Vomiting', 'Diarrhea', 'Chills', 'Joint pain', 'Skin rash', 'Loss of appetite', 'Weakness'];

export default function SymptomForm({ value, onChange }) {
  const toggle = (symptom) => {
    const selected = value.selectedSymptoms.includes(symptom)
      ? value.selectedSymptoms.filter((item) => item !== symptom)
      : [...value.selectedSymptoms, symptom];
    onChange({ ...value, selectedSymptoms: selected });
  };
  return (
    <section className="card">
      <div className="step-heading"><span className="step-number">1</span><div><p className="eyebrow">Patient symptoms</p><h2>Enter your symptoms</h2></div></div>
      <div className="symptom-grid">
        {symptoms.map((symptom) => (
          <button type="button" key={symptom} className={`symptom-chip ${value.selectedSymptoms.includes(symptom) ? 'active' : ''}`} onClick={() => toggle(symptom)}>
            {symptom}
          </button>
        ))}
      </div>
      <label>Additional symptom details
        <textarea value={value.details} onChange={(e) => onChange({ ...value, details: e.target.value })} placeholder="Describe the start, frequency and progression..." />
      </label>
      <div className="form-row">
        <label>Duration
          <input value={value.duration} onChange={(e) => onChange({ ...value, duration: e.target.value })} placeholder="e.g. 3 days" />
        </label>
        <label>Severity
          <select value={value.severity} onChange={(e) => onChange({ ...value, severity: e.target.value })}>
            <option value="Unknown">Unknown</option><option>Mild</option><option>Moderate</option><option>Severe</option>
          </select>
        </label>
        <label>Temperature
          <input value={value.temperature} onChange={(e) => onChange({ ...value, temperature: e.target.value })} placeholder="°C" />
        </label>
      </div>
      <label>Progress
        <select value={value.progression} onChange={(e) => onChange({ ...value, progression: e.target.value })}>
          <option>Not sure</option><option>Improving</option><option>Stable</option><option>Worsening</option>
        </select>
      </label>
    </section>
  );
}
