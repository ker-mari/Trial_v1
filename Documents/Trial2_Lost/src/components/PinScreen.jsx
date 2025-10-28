import React, { useState } from 'react';

const PinScreen = ({ onPinSubmit }) => {
  const [pin, setPin] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    if (pin === '1234' || pin === '5678' || pin === '9999') {
      const userName = pin === '1234' ? 'Mr. Guard 1' : pin === '5678' ? 'Ms. Guard 2' : 'Admin User';
      onPinSubmit(userName);
    } else {
      setShowModal(true);
    }
  };

  const handleTryAgain = () => {
    setShowModal(false);
    setPin("");
  };

  return (
    <>
      <div className="pin-screen">
        <div className="content">
          <h2>Together, we bring things back!</h2>
          <p>Found or lost something? Don't worry — help is just a click away!</p>
          <input
            type="password"
            placeholder="ENTER PIN:"
            className="pin-input"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <button
            className={pin ? "proceed-btn active" : "proceed-btn"}
            disabled={!pin}
            onClick={handleSubmit}
          >
            Proceed
          </button>
        </div>
        <div className="image-side">
          <div className="img-bg"></div>
          <img src="/school.png" alt="school" className="school-img" />
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