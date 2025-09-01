import React from 'react';

const ConfirmModal = ({ 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  confirmColor = 'blue',
  onConfirm, 
  onCancel 
}) => {
  const getConfirmButtonClasses = () => {
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200";
    switch (confirmColor) {
      case 'red':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700`;
      case 'green':
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700`;
      case 'yellow':
        return `${baseClasses} bg-yellow-600 text-white hover:bg-yellow-700`;
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600">
            {message}
          </p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={getConfirmButtonClasses()}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
