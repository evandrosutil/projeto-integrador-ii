import React from 'react';

const NumberInput = ({ name, value, onChange, min = 1, max = 99, label }) => {
  const handleIncrement = () => {
    const newValue = Math.min(max, value + 1);
    onChange({
      target: {
        name,
        value: newValue,
        type: 'number'
      }
    });
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - 1);
    onChange({
      target: {
        name,
        value: newValue,
        type: 'number'
      }
    });
  };

  const handleInputChange = (e) => {
    const newValue = Math.max(min, Math.min(max, Number(e.target.value)));
    onChange({
      target: {
        name,
        value: newValue,
        type: 'number'
      }
    });
  };

  return (
    <div className="number-input-container">
      {label && (
        <label htmlFor={name} className="number-input-label">
          {label}
        </label>
      )}
      <div className="number-input-group">
        <input
          type="number"
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="number-input"
        />
        <div className="number-controls">
          <button 
            type="button"
            className="number-control-btn"
            onClick={handleDecrement}
            disabled={value <= min}
          >
            -
          </button>
          {/* <span className="number-value">{value}</span> */}
          <button 
            type="button"
            className="number-control-btn"
            onClick={handleIncrement}
            disabled={value >= max}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumberInput;
