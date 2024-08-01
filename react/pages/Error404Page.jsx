import React from 'react';

const Error404Page = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Full viewport height
    textAlign: 'center',
    color: '#333', // Dark grey text color
    backgroundColor: '#f0f0f0', // Light grey background
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  };

  const headingStyle = {
    fontSize: '4rem', // Large font size for the 404
    fontWeight: 'bold',
  };

  const textStyle = {
    fontSize: '1.5rem', // Smaller font size for the text
    marginTop: '20px', // Space between heading and text
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>404</h1>
      <p style={textStyle}>Oops! The page you're looking for isn't here.</p>
      <p style={textStyle}>You might have the wrong address, or the page may have moved.</p>
    </div>
  );
};

export default Error404Page;