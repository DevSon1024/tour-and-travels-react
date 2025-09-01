import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  const baseStyle = 'w-full py-2 px-4 rounded';
  
  const variants = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700',
    secondary: 'text-blue-600 bg-white border border-blue-600 hover:bg-blue-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;