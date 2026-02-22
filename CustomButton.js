import React from 'react';

const CustomButton = ({ children, bgColor = '#007bff', borderRadius = '4px' }) => {
  return (
    <button style={{ backgroundColor: bgColor, borderRadius: borderRadius, color: '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer' }}>
      {children}
    </button>
  );
};

export default CustomButton;