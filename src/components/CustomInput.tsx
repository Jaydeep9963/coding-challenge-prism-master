import React, { useCallback, useEffect, useRef, useState } from 'react';
import './CustomInput.css';

type CustomInputProps = {
  directionClasses:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'inner-top'
    | 'inner-left'
    | 'inner-right'
    | 'inner-bottom';
  defaultValue: {
    id: number;
    value: number | null;
    unit: 'pt' | '%';
  };
  postHandler: (body: {
    id: number;
    value: number;
    unit: string;
  }) => Promise<void>;
};

const CustomInput: React.FC<CustomInputProps> = ({
  directionClasses,
  defaultValue,
  postHandler,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState<number | null | string>(defaultValue ? defaultValue.value : 'auto');
  const [unit, setUnit] = useState(defaultValue ? defaultValue.unit : 'pt');
  const [isChanged, setIsChanged] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedPostHandler = useCallback(
    (data) => {
      const handler = setTimeout(() => postHandler(data), 500); 
      setIsChanged(false);
      return () => clearTimeout(handler); 
    },
    [postHandler]
  );

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue !== value) {
      setIsChanged(true);
    }
    if(newValue.trim() === ""){
      setValue(null);
    }else{
      setValue(+newValue);
    }
  };

  const dropdownHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    if (newUnit === 'pt' || newUnit === '%') {
      if (newUnit !== unit) {
        setIsChanged(true);
        setUnit(newUnit);
      }
    }
  };

  const handleOutOfFocus = useCallback(() => {
    setIsFocused(false);
    if (isChanged) debouncedPostHandler({ id: defaultValue.id, value, unit });
  },[debouncedPostHandler, defaultValue.id, unit, value, isChanged]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFocused && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleOutOfFocus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleOutOfFocus, isFocused]);

  return (
    <div
      ref={containerRef}
      className={`input-container label ${directionClasses} ${isFocused ? 'input-container-focus' : ''}`}
      onClick={handleFocus}
      tabIndex={0} 
    >
      {isFocused ? (
        <>
          <input
            type="number"
            value={value ?? ''}
            className={`input`}
            onFocus={handleFocus}
            onChange={inputChangeHandler}
            placeholder="auto"
          />
          <select
            value={unit}
            className="dropdown"
            onFocus={handleFocus}
            onChange={dropdownHandler}
          >
            <option value="pt">pt</option>
            <option value="%">%</option>
          </select>
        </>
      ) : (
        <span className={`display-value  ${defaultValue.value != null  ? 'changed' : ''}`} onClick={handleFocus}>
          {value !== null ? `${value}${unit}` : 'auto'}
        </span>
      )}
    </div>
  );
};

export default CustomInput;
