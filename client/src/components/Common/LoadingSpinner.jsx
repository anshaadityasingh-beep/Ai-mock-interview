import { useState, useEffect } from 'react';

/**
 * LoadingSpinner — reusable spinner with optional label and cold-start warning.
 * Props:
 *   label  (string)  — text to show below spinner (default: "Loading...")
 *   small  (bool)    — renders a small inline spinner
 *   showColdStartWarning (bool) — if true, shows backend cold-start message after 3s
 */
const LoadingSpinner = ({ label = 'Loading...', small = false, showColdStartWarning = false }) => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!showColdStartWarning) return;
    const timer = setTimeout(() => setShowWarning(true), 3000);
    return () => clearTimeout(timer);
  }, [showColdStartWarning]);

  if (small) {
    return <span className={`spinner spinner-sm`} role="status" aria-label="Loading" />;
  }

  return (
    <div className="spinner-wrapper" role="status">
      <div className="spinner" aria-hidden="true" />
      <span>{label}</span>
      {showColdStartWarning && showWarning && (
        <p className="cold-start-msg">
          ⏳ Waking up the server — this can take up to 30 seconds on first load.
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
