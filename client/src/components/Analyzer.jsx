import { useState, useRef } from 'react';
import Result from './Result';
import '../styles/analyzer.css';

const Analyzer = () => {
  const [link, setLink] = useState('');
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file.');
      setFileName('');
      return;
    }

    setError('');
    setFileName(file.name);
    setLink('');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const syntheticEvent = { target: { files: [file] } };
      handleFileChange(syntheticEvent);
    }
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();
    if (!fileName && !link.trim()) {
      setError('Upload a resume or enter a LinkedIn profile URL to proceed.');
      return;
    }

    if (link.trim() && !link.includes('linkedin.com/in/')) {
      setError('Please enter a valid LinkedIn profile URL.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      const selectedFile = fileInputRef.current?.files?.[0];

      if (selectedFile) {
        formData.append('resume', selectedFile);
      }

      if (link.trim()) {
        formData.append('linkedinUrl', link.trim());
      }

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to generate analysis.');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setAnalysis(null);
      setError(err.message || 'Unable to generate analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="analyzer" id="analyzer">
      <div className="analyzer__panel">
        <div className="analyzer__header">
          <p className="eyebrow">Analyze Candidate</p>
          <h2>Resume upload and LinkedIn profile.</h2>
        </div>

        <form className="analyzer__form" onSubmit={handleAnalyze}>
          <div className="analyzer__option">
            <label htmlFor="resume-upload" className="analyzer__label">
              Resume Upload
            </label>
            <div
              className="upload-dropzone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              onDragEnter={(event) => event.preventDefault()}
            >
              <div className="upload-dropzone__content">
                <span className="upload-icon">📄</span>
                <p>{fileName || 'Drag & drop a PDF or DOCX file here'}</p>
                <button
                  type="button"
                  className="upload-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse File
                </button>
              </div>
              <input
                id="resume-upload"
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden-input"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="analyzer__divider">AND</div>

          <div className="analyzer__option">
            <label htmlFor="linkedin-url" className="analyzer__label">
              LinkedIn Profile
            </label>
            <input
              id="linkedin-url"
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={link}
              onChange={(event) => {
                setLink(event.target.value);
                setFileName('');
              }}
              className="analyzer__input"
            />
          </div>

          {error && <p className="analyzer__error">{error}</p>}

          <button type="submit" className="analyzer__submit" disabled={loading}>
            {loading ? 'Analyzing candidate…' : 'Analyze Candidate'}
          </button>
        </form>
      </div>

      <Result analysis={analysis} />
    </section>
  );
};

export default Analyzer;
