// app/ui/dashboard/urlinput.tsx

import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface URLInputProps {
  value: string;
  onSubmit: (value: string) => void;
  onFormFactorChange: (formFactor: 'DESKTOP' | 'PHONE' | 'TABLET') => void;
  onNetworkTypeChange: (networkType: '4g' | '3g' | 'fast3g') => void;
  formFactor: 'DESKTOP' | 'PHONE' | 'TABLET';
  networkType: '4g' | '3g' | 'fast3g';
  placeholder?: string;
}

const URLInput: React.FC<URLInputProps> = ({
  value,
  onSubmit,
  onFormFactorChange,
  onNetworkTypeChange,
  formFactor,
  networkType,
  placeholder,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFormFactorChange(formFactor);
    onNetworkTypeChange(networkType);
    onSubmit(event.target.value);
  };

  const handleFormFactorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFormFactorChange(event.target.value as 'DESKTOP' | 'PHONE' | 'TABLET');
  };

  const handleNetworkTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onNetworkTypeChange(event.target.value as '4g' | '3g' | 'fast3g');
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        type="url"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder || 'Enter a URL'}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      <select className='rounded-md border' value={formFactor} onChange={handleFormFactorChange}>
        <option value="DESKTOP">Desktop</option>
        <option value="PHONE">Phone</option>
        <option value="TABLET">Tablet</option>
      </select>
      <select className='rounded-md border' value={networkType} onChange={handleNetworkTypeChange}>
        <option value="4g">4G</option>
        <option value="3g">3G</option>
        <option value="fast3g">Fast 3G</option>
      </select>
      <button onClick={() => onSubmit(value)}>Get Long Tasks</button>
    </div>
  );
};

export default URLInput;
