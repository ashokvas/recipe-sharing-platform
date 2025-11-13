'use client';

import { useState } from 'react';

interface DynamicFieldListProps {
  label: string;
  fields: string[];
  onChange: (fields: string[]) => void;
  placeholder: string;
  addButtonText: string;
  disabled?: boolean;
}

export function DynamicFieldList({
  label,
  fields,
  onChange,
  placeholder,
  addButtonText,
  disabled = false,
}: DynamicFieldListProps) {
  const addField = () => {
    onChange([...fields, '']);
  };

  const removeField = (index: number) => {
    // Always keep at least one field
    if (fields.length > 1) {
      const newFields = fields.filter((_, i) => i !== index);
      onChange(newFields);
    }
  };

  const updateField = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index] = value;
    onChange(newFields);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={field}
              onChange={(e) => updateField(index, e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
            />
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => removeField(index)}
                disabled={disabled}
                className="px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addField}
        disabled={disabled}
        className="mt-2 text-orange-600 hover:text-orange-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        + {addButtonText}
      </button>
    </div>
  );
}

