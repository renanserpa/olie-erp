import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  fullWidth?: boolean;
  searchable?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  fullWidth = true,
  searchable = false,
  className,
  id,
  ...props
}) => {
  const generatedId = React.useId();
  const selectId = id || generatedId;
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<string | undefined>(props.value as string);
  
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;
  
  const handleSelect = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false);
    
    // Simular evento de mudança para compatibilidade com react-hook-form
    if (props.onChange) {
      const event = {
        target: {
          name: props.name,
          value
        }
      } as React.ChangeEvent<HTMLSelectElement>;
      props.onChange(event);
    }
  };
  
  const selectedLabel = options.find(option => option.value === selectedOption)?.label || '';
  
  if (searchable) {
    return (
      <div className={`mb-4 relative ${fullWidth ? 'w-full' : ''}`}>
        <label htmlFor={selectId} className="block text-sm font-medium text-text mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          <button
            id={selectId}
            type="button"
            className={`flex justify-between items-center w-full px-3 py-2 bg-white border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary text-left`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{selectedLabel || 'Selecione...'}</span>
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="p-2">
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <ul className="max-h-60 overflow-auto py-1">
                {filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`px-3 py-2 cursor-pointer hover:bg-primary ${
                      option.value === selectedOption ? 'bg-primary/50 font-medium' : ''
                    }`}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </li>
                ))}
                {filteredOptions.length === 0 && (
                  <li className="px-3 py-2 text-gray-500">Nenhum resultado encontrado</li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
  
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      <label htmlFor={selectId} className="block text-sm font-medium text-text mb-1">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        id={selectId}
        className={`block w-full px-3 py-2 bg-white border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary ${className || ''}`}
        {...props}
      >
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
