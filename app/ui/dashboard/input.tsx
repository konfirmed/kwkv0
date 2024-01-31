// Favour combine or merge search with input
import React from 'react';

interface URLInputProps {
  value: string;
  onSubmit: (value: string) => void;
  onFormFactorChange: (formFactor: 'DESKTOP' | 'PHONE' | 'TABLET') => void;
  formFactor: 'DESKTOP' | 'PHONE' | 'TABLET';
  placeholder?: string;
}

const URLInput: React.FC<URLInputProps> = ({
  value,
  onSubmit,
  onFormFactorChange,
  formFactor,
  placeholder,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSubmit(event.target.value);
  };

  const handleFormFactorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFormFactorChange(event.target.value as 'DESKTOP' | 'PHONE' | 'TABLET');
  };

  return (
    <div>
      <input
        type="url"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder || 'Enter a URL'}
      />
      <select value={formFactor} onChange={handleFormFactorChange}>
        <option value="DESKTOP">Desktop</option>
        <option value="PHONE">Phone</option>
        <option value="TABLET">Tablet</option>
      </select>
      <button onClick={() => onSubmit(value)}>Load Metrics</button>
    </div>
  );
};

export default URLInput;
