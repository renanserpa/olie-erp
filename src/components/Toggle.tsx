import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  disabled = false
}) => {
  return (
    <div className="flex items-center mb-4">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-secondary rounded-full peer 
          ${checked ? 'peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-secondary' : ''}
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        ></div>
        <span className="ml-3 text-sm font-medium text-text">{label}</span>
      </label>
    </div>
  );
};

export default Toggle;
