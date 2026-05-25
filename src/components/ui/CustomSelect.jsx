import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const CustomSelect = ({ value, options, onChange, name, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find the selected option's label
  const selectedOption = options.find(opt => 
    (typeof opt === 'object' ? opt.value : opt) === value
  );
  const displayValue = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : value;

  return (
    <div className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}
      <div onClick={() => setIsOpen(!isOpen)} className="w-full bg-surface border-2 border-border rounded-lg px-4 py-3 text-[13px] font-bold text-text outline-none focus:border-primary cursor-pointer flex justify-between items-center hover:border-primary/50 transition-colors">
        <span className="truncate">{displayValue}</span>
        <ChevronDown size={16} className={`text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface border-2 border-border rounded-lg overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-100 max-h-48 overflow-y-auto">
            {options.map((opt) => {
              // opt can be a string or an object {label, value}
              const displayLabel = typeof opt === 'object' ? opt.label : opt;
              const actualValue = typeof opt === 'object' ? opt.value : opt;
              
              return (
                <div 
                  key={actualValue} 
                  onClick={() => { onChange(actualValue); setIsOpen(false); }} 
                  className={`px-4 py-3 text-[13px] cursor-pointer hover:bg-surface-hover transition-colors ${value === actualValue ? 'bg-primary/10 text-primary font-bold' : 'text-text font-medium'}`}
                >
                  {displayLabel}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
