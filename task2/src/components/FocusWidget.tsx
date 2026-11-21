import React, { useState, useEffect, type MouseEvent } from "react";

export default function FocusWidget() {
  const [customMinutes, setCustomMinutes] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("taskboard.focusMinutes");
      if (stored) {
        const val = parseInt(stored, 10);
        if (!isNaN(val) && val > 0 && val <= 480) return val;
      }
    } catch {
      // storage unavailable
    }
    return 25;
  });

  const [timeLeft, setTimeLeft] = useState<number>(() => customMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(String(customMinutes));

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return customMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, customMinutes]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const toggleTimer = () => {
    if (isEditing) setIsEditing(false);
    setIsRunning((prev) => !prev);
  };

  const handleReset = (e: MouseEvent) => {
    e.stopPropagation();
    setIsRunning(false);
    setTimeLeft(customMinutes * 60);
  };

  const handleOpenEdit = (e: MouseEvent) => {
    e.stopPropagation();
    if (isRunning) setIsRunning(false);
    setInputValue(String(customMinutes));
    setIsEditing(true);
  };

  const handleSaveDuration = (minsToSet?: number) => {
    const mins = minsToSet ?? parseInt(inputValue, 10);
    if (!isNaN(mins) && mins > 0 && mins <= 480) {
      setCustomMinutes(mins);
      setTimeLeft(mins * 60);
      try {
        localStorage.setItem("taskboard.focusMinutes", String(mins));
      } catch {
        // storage unavailable
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveDuration();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <div className="focus-pill-container">
      {isEditing && (
        <div className="focus-editor-popover" role="dialog" aria-label="Set Focus Timer Duration">
          <div className="focus-editor-header">
            <span>Set Focus Duration</span>
            <button
              type="button"
              className="btn-close-popover"
              onClick={() => setIsEditing(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="focus-presets">
            {[5, 15, 25, 30, 45, 60].map((preset) => (
              <button
                key={preset}
                type="button"
                className={`btn-preset ${customMinutes === preset ? "btn-preset--active" : ""}`}
                onClick={() => handleSaveDuration(preset)}
              >
                {preset}m
              </button>
            ))}
          </div>

          <div className="focus-custom-input-row">
            <input
              type="number"
              min="1"
              max="480"
              className="focus-custom-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              aria-label="Custom minutes"
            />
            <span className="focus-unit">min</span>
            <button
              type="button"
              className="btn-set-focus"
              onClick={() => handleSaveDuration()}
            >
              Set
            </button>
          </div>
        </div>
      )}

      <div
        className={`focus-pill-widget ${isRunning ? "focus-pill-widget--active" : ""}`}
        title={isRunning ? `Focus mode active: ${formattedTime}` : "Click play to start focus timer"}
        role="region"
        aria-label="Focus Timer"
      >
        <button
          type="button"
          className="focus-pill-time-btn"
          onClick={handleOpenEdit}
          title="Click to edit timer duration"
          aria-label={`Current focus duration ${customMinutes} minutes. Click to change.`}
        >
          <span className="focus-pill-circle">
            {isRunning ? formattedTime : `${customMinutes}`}
          </span>
        </button>

        {/* Visualizer wave bars */}
        <div className={`focus-pill-waves ${isRunning ? "focus-pill-waves--animated" : ""}`} aria-hidden="true">
          <span className="wave-bar bar-1" />
          <span className="wave-bar bar-2" />
          <span className="wave-bar bar-3" />
          <span className="wave-bar bar-4" />
          <span className="wave-bar bar-5" />
          <span className="wave-bar bar-6" />
          <span className="wave-bar bar-7" />
          <span className="wave-bar bar-8" />
          <span className="wave-bar bar-9" />
          <span className="wave-bar bar-10" />
        </div>

        <button
          type="button"
          className="focus-pill-play-btn"
          onClick={toggleTimer}
          aria-label={isRunning ? "Pause focus timer" : "Start focus timer"}
          title={isRunning ? "Pause" : "Start"}
        >
          {isRunning ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          )}
        </button>

        {/* Reset button when timer has run or is modified */}
        {(timeLeft !== customMinutes * 60 || isRunning) && (
          <button
            type="button"
            className="focus-pill-reset-btn"
            onClick={handleReset}
            title={`Reset to ${customMinutes}m`}
            aria-label={`Reset to ${customMinutes}m`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
