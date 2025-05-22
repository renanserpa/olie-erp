/*
 * FormComponents.tsx
 * -----------------------------------------------------------
 * 1. <FormSection> — bloco com título e grid responsiva
 * 2. <MaskedInput> — input com máscaras (CPF, CNPJ, Telefone, Data, CEP, Money)
 *
 * ✔ Tipagem forte
 * ✔ Classes Tailwind padrão (sem tokens custom)
 */

import React from "react";
import InputMask from "react-input-mask";

/* ------------------------------------------------------------------
 * 1. FormSection
 * ------------------------------------------------------------------ */
interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <section className="mb-8">
    <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold text-gray-700">
      {title}
    </h3>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
  </section>
);

/* ------------------------------------------------------------------
 * 2. MaskedInput
 * ------------------------------------------------------------------ */
export type MaskType =
  | "cpf"
  | "cnpj"
  | "telefone"
  | "data"
  | "cep"
  | "monetario";

export interface MaskedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  type: MaskType;
  label: string;
  error?: string;
  required?: boolean;
}

export const MaskedInput: React.FC<MaskedInputProps> = ({
  type,
  label,
  value,
  onChange,
  error,
  required,
  placeholder,
  className = "",
  ...rest
}) => {
  const maskMap: Record<MaskType, string> = {
    cpf: "999.999.999-99",
    cnpj: "99.999.999/9999-99",
    telefone: "(99) 99999-9999",
    data: "99/99/9999",
    cep: "99999-999",
    monetario: "R$ 999.999.999,99",
  };

  const placeholderMap: Record<MaskType, string> = {
    cpf: "000.000.000-00",
    cnpj: "00.000.000/0000-00",
    telefone: "(00) 00000-0000",
    data: "DD/MM/AAAA",
    cep: "00000-000",
    monetario: "R$ 0,00",
  };

  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <InputMask
        mask={maskMap[type]}
        value={value as string}
        onChange={onChange}
        placeholder={placeholder ?? placeholderMap[type]}
        className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...rest}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

/* ------------------------------------------------------------------
 * Exportações
 * ------------------------------------------------------------------ */
export { FormSection as default };
