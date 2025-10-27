import React, { useState, useRef, useEffect } from "react";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number; // ms
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  debounce = 300,
  className = "",
  autoFocus = false,
  disabled = false,
  icon,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounce);
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {icon && (
        <span className="absolute left-3 text-muted-foreground">{icon}</span>
      )}
      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        className={`pl-${
          icon ? "9" : "3"
        } pr-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary w-full transition-all`}
      />
    </div>
  );
};
