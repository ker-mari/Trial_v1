import React from 'react';

const StartScreen = ({ onGetStarted }) => {
  return (
    <div className="start-screen">
      <div className="content">
        <h2>Welcome to LA VERDAD Lost N Found</h2>
        <p>Lost something or found an item on campus? We're here to help reunite people and their belongings.</p>
        <button className="start-btn" onClick={onGetStarted}>Get Started</button>
      </div>
      <div className="image-side">
        <div className="img-bg"></div>
        <img src="/school.png" alt="school" className="school-img" />
      </div>
    </div>
  );
};

export default StartScreen;