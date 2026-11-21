import { useState } from 'react';
import Header from './components/Header';
import SymptomForm from './components/SymptomForm';
import BloodReportUpload from './components/BloodReportUpload';
import AudioRecorder from './components/AudioRecorder';
import LoadingScreen from './components/LoadingScreen';
import ResultDashboard from './components/ResultDashboard';
import { submitAnalysis } from './services/api';
import './styles/global.css';

const initialSymptoms = {
  selectedSymptoms: [], details: '', duration: '', severity: 'Unknown',
  temperature: '', progression: 'Not sure'
};

export default function App() {
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [bloodReport, setBloodReport] = useState(null);
  const [audio, setAudio] = useState(null);
  const [patient, setPatient] = useState({ age: '', relevantInfo: '' });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    setError('');
    if (!symptoms.selectedSymptoms.length && !symptoms.details.trim()) return setError('Please enter at least one symptom or symptom description.');
    if (!bloodReport && !audio) return setError('Upload a blood report or record a voice description.');
    if (!consent) return setError('Please provide consent before processing your health information.');
    const formData = new FormData();
    formData.append('symptoms', JSON.stringify(symptoms));
    formData.append('age', patient.age);
    formData.append('relevantInfo', patient.relevantInfo);
    formData.append('consent', 'true');
    if (bloodReport) formData.append('bloodReport', bloodReport);
    if (audio) formData.append('audio', audio);
    setLoading(true);
    try {
      setResult(await submitAnalysis(formData));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'The analysis could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSymptoms(initialSymptoms); setBloodReport(null); setAudio(null);
    setPatient({ age: '', relevantInfo: '' }); setConsent(false); setResult(null); setError('');
  };

  if (result) return <><Header /><ResultDashboard result={result} onReset={reset} /></>;

  return (
    <>
      <Header />
      {loading && <LoadingScreen />}
      <main className="home">
        <section className="hero">
          <p className="eyebrow">AI-powered health information</p>
          <h1>Understand your symptoms.<br /><span>Take informed next steps.</span></h1>
          <p className="hero-copy">Combine symptom details, laboratory reports and a voice description for a structured health overview.</p>
        </section>
        <div className="form-grid">
          <SymptomForm value={symptoms} onChange={setSymptoms} />
          <div className="side-column">
            <BloodReportUpload file={bloodReport} onChange={setBloodReport} />
            <AudioRecorder onChange={setAudio} />
          </div>
        </div>
        <section className="card patient-card">
          <div className="step-heading"><span className="step-number">4</span><div><p className="eyebrow">Optional details</p><h2>Additional patient information</h2></div></div>
          <div className="form-row">
            <label>Age<input type="number" min="0" max="120" value={patient.age} onChange={(e) => setPatient({ ...patient, age: e.target.value })} placeholder="Years" /></label>
            <label>Relevant health information<input value={patient.relevantInfo} onChange={(e) => setPatient({ ...patient, relevantInfo: e.target.value })} placeholder="Conditions, allergies or recent changes" /></label>
          </div>
        </section>
        <section className="consent-card">
          <label><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>I consent to processing this health information for analysis and, where configured, secure storage.</span></label>
          {error && <div className="form-error">{error}</div>}
          <button type="button" className="primary-button" onClick={analyze} disabled={loading}>Analyze my health <span>→</span></button>
        </section>
      </main>
    </>
  );
}
