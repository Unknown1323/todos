import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <div className="spinner" />
      <style>
        {`
          .spinner {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #3b82f6;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;
