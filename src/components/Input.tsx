import React from 'react';
import InputMask from 'react-input-mask';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  mask?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  mask,
  fullWidth = true,
  className,
  ...props
}) => {
  const inputClasses = `block px-3 py-2 bg-white border ${
    error ? 'border-red-500' : 'border-gray-300'
  } rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary ${
    fullWidth ? 'w-full' : ''
  } ${className || ''}`;

  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      <label className="block text-sm font-medium text-text mb-1">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {mask ? (
        <InputMask
          mask={mask}
          className={inputClasses}
          {...props}
        />
      ) : (
        <input
          className={inputClasses}
          {...props}
        />
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
