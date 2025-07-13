import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface IntelligentFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onAIAssist?: () => void;
  suggestions?: string[];
  validation?: {
    isValid: boolean;
    suggestions: string[];
  };
  placeholder?: string;
  type?: 'input' | 'textarea';
  rows?: number;
  required?: boolean;
  icon?: React.ReactNode;
}

export const IntelligentField: React.FC<IntelligentFieldProps> = ({
  label,
  value,
  onChange,
  onAIAssist,
  suggestions = [],
  validation,
  placeholder,
  type = 'input',
  rows = 3,
  required = false,
  icon
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setShowSuggestions(newValue.length > 2 && suggestions.length > 0);
  };

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const inputClassName = `w-full ${icon ? 'pl-10' : ''} pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
    type === 'textarea' ? 'resize-none' : ''
  } ${
    validation?.isValid === false 
      ? 'border-red-300 dark:border-red-600' 
      : 'border-gray-300 dark:border-gray-600'
  }`;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && '*'}
        </label>
        {onAIAssist && (
          <button
            type="button"
            onClick={onAIAssist}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
          >
            AI Assist
          </button>
        )}
      </div>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-2 w-5 h-5 text-gray-400">
            {icon}
          </div>
        )}
        
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            rows={rows}
            className={inputClassName}
            placeholder={placeholder}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            className={inputClassName}
            placeholder={placeholder}
          />
        )}
      </div>
      
      {/* Validation feedback */}
      {validation?.suggestions && validation.suggestions.length > 0 && (
        <div className="mt-1 text-xs text-gray-500">
          💡 {validation.suggestions[0]}
        </div>
      )}
      
      {/* Auto-suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => selectSuggestion(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};