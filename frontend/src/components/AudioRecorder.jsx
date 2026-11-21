import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Trash2, Play } from 'lucide-react';

export default function AudioRecorder({ onChange }) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const recorder = useRef(null);
  const chunks = useRef([]);

  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder.current = new MediaRecorder(stream);
    chunks.current = [];
    recorder.current.ondataavailable = (event) => chunks.current.push(event.data);
    recorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: recorder.current.mimeType || 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const file = new File([blob], `health-note-${Date.now()}.webm`, { type: blob.type });
      setAudioUrl(url);
      setAudioFile(file);
      onChange(file);
      stream.getTracks().forEach((track) => track.stop());
    };
    recorder.current.start();
    setRecording(true);
  };

  const stop = () => {
    if (recorder.current?.state !== 'inactive') recorder.current.stop();
    setRecording(false);
  };
  const clear = () => { setAudioUrl(''); setAudioFile(null); onChange(null); };

  return (
    <section className="card">
      <div className="step-heading"><span className="step-number">3</span><div><p className="eyebrow">Voice description</p><h2>Describe how you feel</h2></div></div>
      <div className="recorder">
        {recording ? <button type="button" className="record-button stop" onClick={stop}><Square size={18}/> Stop recording</button>
          : <button type="button" className="record-button" onClick={start}><Mic size={18}/> {audioFile ? 'Record again' : 'Start recording'}</button>}
        {audioUrl && <><audio controls src={audioUrl} /><button type="button" className="icon-button" onClick={clear} aria-label="Delete recording"><Trash2 size={18}/></button></>}
      </div>
      <p className="privacy-note">Audio is transcribed for this assessment and raw files are removed after processing.</p>
    </section>
  );
}
