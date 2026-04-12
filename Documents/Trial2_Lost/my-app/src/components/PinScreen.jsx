import React, { useState } from 'react';
import { authAPI } from '../services/api';

const PinScreen = ({ onPinSubmit }) => {
  const [pin, setPin] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSubmit = async () => {
    setIsAuthenticating(true);
    try {
      const { data } = await authAPI.verifyPin(pin);
      if (import.meta.env.DEV) {
        console.log("PIN verification response:", data);
      }
      if (data.success) {
        // Pass auth token along with user data
        onPinSubmit(data.user_name, data.is_admin, data.auth_token);
        return;
      } else {
        if (import.meta.env.DEV) {
          console.log("PIN verification failed:", data.message);
        }
        setShowModal(true);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("PIN verification error:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }
      setShowModal(true);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleTryAgain = () => {
    setShowModal(false);
    setPin("");
  };

  return (
    <>
      <div className="pin-screen">
        <div className="pin-content">
          <div className="content">
            <h2>Together, we bring<br />things back!</h2>
            <p>Found or lost something?  <br /> Don't worry — help is just a click away!</p>
            <div className="pin-input-container">
              <input
                type={showPin ? "text" : "password"}
                placeholder="ENTER PIN:"
                className="pin-input"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <button
                type="button"
                className="pin-toggle-btn"
                onClick={() => setShowPin(!showPin)}
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <div className="button-wrapper">
              <button
                className={pin ? "proceed-btn active" : "proceed-btn"}
                disabled={!pin || isAuthenticating}
                onClick={handleSubmit}
              >
                {isAuthenticating ? (
                  <span className="authenticating" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span className="spinner-small"></span>
                    Authenticating
                  </span>
                ) : (
                  "Proceed"
                )}
              </button>
              {!pin && (
                <div className="tooltip">Please enter a PIN</div>
              )}
            </div>
          </div>
          <div className="image-side">
            <div className="img-bg"></div>
            <img src="/school.png" alt="school" className="school-img" />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="pin-modal-overlay">
          <div className="pin-modal">
            <p className="pin-modal-text">
              Incorrect PIN entered. <br />
              Please check your PIN and try again.
            </p>
            <div className="pin-modal-buttons">
              <button className="pin-confirm-btn" onClick={handleTryAgain}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PinScreen;