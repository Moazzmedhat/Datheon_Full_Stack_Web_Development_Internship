import React, { useState } from 'react';
import { X, Key, CheckCircle, ExternalLink, ShieldCheck, Cpu } from 'lucide-react';

/**
 * OpenWeatherMap API Configuration Modal
 * Lets users securely provide and store their OpenWeatherMap API Key,
 * or toggle into Instant Telemetry Simulation mode.
 */
export default function ApiKeyModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  onUseSimulation
}) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
    onUseSimulation();
    onClose();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Key size={20} className="text-cyan-400" />
            <h3>OpenWeatherMap API Configuration</h3>
          </div>
          <button onClick={onClose} className="btn-modal-close" title="Close configuration">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body-form">
          <p className="modal-intro-text">
            Connect live global weather telemetry by adding your <strong>OpenWeatherMap API key</strong>.
            Your key remains stored safely in your browser’s local storage.
          </p>

          <div className="input-field-group">
            <label htmlFor="apiKeyInput" className="input-label">
              OpenWeatherMap API Key (32 characters hex)
            </label>
            <div className="input-with-icon">
              <Key size={16} className="field-icon text-slate-400" />
              <input
                id="apiKeyInput"
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="e.g. 4a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d"
                className="modal-key-input"
              />
            </div>
            <span className="input-help-text">
              Free API keys can be generated at{' '}
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noreferrer"
                className="external-link"
              >
                openweathermap.org/api <ExternalLink size={12} className="inline-icon" />
              </a>
              . Note: new keys require ~10 minutes to activate on OpenWeatherMap servers.
            </span>
          </div>

          <div className="simulation-option-box">
            <div className="sim-box-header">
              <Cpu size={18} className="text-emerald-400" />
              <div>
                <div className="sim-title">No API Key? Use Simulated Telemetry</div>
                <div className="sim-desc">
                  Explore full features with high-accuracy synthetic telemetry generated for any city worldwide.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="btn-use-simulation"
            >
              Activate Simulation Mode
            </button>
          </div>

          <div className="modal-actions-footer">
            <button type="button" onClick={onClose} className="btn-modal-cancel">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!inputKey.trim()}
              className="btn-modal-save"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle size={16} /> Saved!
                </>
              ) : (
                'Save & Apply Live API'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
