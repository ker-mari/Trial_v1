import React, { useState } from 'react';
import { authAPI } from '../services/api';

const PinScreen = ({ onPinSubmit }) => {
  const [pin, setPin] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async () => {
    setIsAuthenticating(true);
    try {
      const { data } = await authAPI.verifyPin(pin);
      if (data.success) {
        // Pass auth token along with user data
        onPinSubmit(data.user_name, data.is_admin, data.auth_token);
      } else {
        setShowModal(true);
      }
    } catch {
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
            <input
              type="password"
              placeholder="ENTER PIN:"
              className="pin-input"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button
              className={pin ? "proceed-btn active" : "proceed-btn"}
              disabled={!pin || isAuthenticating}
              onClick={handleSubmit}
            >
              {isAuthenticating ? (
                <span className="authenticating">
                  Authenticating<span className="dots">...</span>
                </span>
              ) : (
                "Proceed"
              )}
            </button>
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