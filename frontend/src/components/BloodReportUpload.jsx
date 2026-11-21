import { FileText, UploadCloud } from 'lucide-react';

export default function BloodReportUpload({ file, onChange }) {
  return (
    <section className="card">
      <div className="step-heading"><span className="step-number">2</span><div><p className="eyebrow">Laboratory report</p><h2>Upload your blood report</h2></div></div>
      <label className="upload-zone">
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => onChange(e.target.files[0] || null)} />
        {file ? <><FileText size={34}/><strong>{file.name}</strong><span>Ready to process</span></> : <><UploadCloud size={34}/><strong>Drop or select a report</strong><span>PDF, JPG or PNG • up to 15 MB</span></>}
      </label>
    </section>
  );
}
