import React from 'react';
import InputMask from 'react-input-mask';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-text mb-4 pb-2 border-b border-gray-200">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
};

interface MaskedInputProps {
  type: 'cpf' | 'cnpj' | 'telefone' | 'data' | 'cep' | 'monetario';
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export const MaskedInput: React.FC<MaskedInputProps> = ({
  type,
  label,
  value,
  onChange,
  error,
  required,
  placeholder,
  ...props
}) => {
  const getMask = () => {
    switch (type) {
      case 'cpf':
        return '999.999.999-99';
      case 'cnpj':
        return '99.999.999/9999-99';
      case 'telefone':
        return '(99) 99999-9999';
      case 'data':
        return '99/99/9999';
      case 'cep':
        return '99999-999';
      case 'monetario':
        return 'R$ 999.999.999,99';
      default:
        return '';
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'cpf':
        return '000.000.000-00';
      case 'cnpj':
        return '00.000.000/0000-00';
      case 'telefone':
        return '(00) 00000-0000';
      case 'data':
        return 'DD/MM/AAAA';
      case 'cep':
        return '00000-000';
      case 'monetario':
        return 'R$ 0,00';
      default:
        return placeholder || '';
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-text mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <InputMask
        mask={getMask()}
        value={value}
        onChange={onChange}
        className={`block w-full px-3 py-2 bg-white border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary`}
        placeholder={getPlaceholder()}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default { FormSection, MaskedInput };
