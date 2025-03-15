import React from 'react';
import { formatNumber } from '../utils/helper.js';
import { useTheme } from '../context/ThemeContext';

/**
 * Tooltip component for displaying data on hover
 * @param {Object} props - Component props
 * @returns {JSX.Element|null} Tooltip component
 */
const Tooltip = ({ data, position, visible }) => {
  const { darkMode } = useTheme();
  
  if (!visible || !data) return null;
  
  const tooltipClass = `tooltip ${darkMode ? 'tooltip-dark' : 'tooltip-light'}`;
  
  return (
    <div 
      className={tooltipClass}
      style={{
        left: position.x + 10,
        top: position.y - 10,
      }}
    >
      <h3>{data.country || data.label}</h3>
      {data.cases !== undefined && (
        <p>Cases: <strong>{formatNumber(data.cases)}</strong></p>
      )}
      {data.deaths !== undefined && (
        <p>Deaths: <strong>{formatNumber(data.deaths)}</strong></p>
      )}
      {data.recovered !== undefined && (
        <p>Recovered: <strong>{formatNumber(data.recovered)}</strong></p>
      )}
      {data.active !== undefined && (
        <p>Active: <strong>{formatNumber(data.active)}</strong></p>
      )}
      {data.value !== undefined && (
        <p>{data.metric || 'Value'}: <strong>{formatNumber(data.value)}</strong></p>
      )}
      {data.percentage !== undefined && (
        <p>Percentage: <strong>{data.percentage}%</strong></p>
      )}
      {data.additionalInfo && (
        <div className="additional-info">
          {Object.entries(data.additionalInfo).map(([key, value]) => (
            <p key={key}>{key}: <strong>{formatNumber(value)}</strong></p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tooltip;