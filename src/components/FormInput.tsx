import React from 'react';

interface FormInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  autoComplete,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default FormInput; 