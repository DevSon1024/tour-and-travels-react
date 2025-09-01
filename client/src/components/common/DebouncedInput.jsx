import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '../../hooks/useDebounce';

const DebouncedInput = ({ 
  value, 
  onChange, 
  delay = 300, 
  className = '',
  placeholder = '',
  type = 'text',
  ...props 
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, delay);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Call onChange when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange({ target: { value: debouncedValue } });
    }
  }, [debouncedValue, onChange, value]);

  const handleChange = useCallback((e) => {
    setLocalValue(e.target.value);
  }, []);

  return (
    <input
      type={type}
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  );
};

DebouncedInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  delay: PropTypes.number,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string
};

export default React.memo(DebouncedInput);
