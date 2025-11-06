import React from 'react';

const StartScreen = ({ onGetStarted }) => {
  return (
    <div className="start-screen">
      <div className="content">
        <h1>Welcome to La Verdad</h1>
        <h2>LOST AND FOUND</h2>
        <p>Lost something or found an item on campus? <br /> We're here to help reunite people and their belongings.</p>
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