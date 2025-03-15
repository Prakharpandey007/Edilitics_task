import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Controls component for filtering and visualization options
 * @param {Object} props - Component props
 * @returns {JSX.Element} Controls component
 */
const Controls = ({ 
  countries, 
  selectedCountries, 
  onCountryToggle,
  chartType,
  onChartTypeChange,
  dataMetric,
  onDataMetricChange,
  onSelectAll,
  onClearAll
}) => {
  const { darkMode, toggleTheme } = useTheme();
  
  const metrics = [
    { value: 'cases', label: 'Total Cases' },
    { value: 'deaths', label: 'Deaths' },
    { value: 'recovered', label: 'Recovered' },
    { value: 'active', label: 'Active Cases' }
  ];
  
  const chartTypes = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'scatter', label: 'Scatter Plot' }
  ];

  return (
    <div className={`controls ${darkMode ? 'dark' : 'light'}`}>
      <div className="controls-header">
        <h2>COVID-19 Dashboard</h2>
        <div className="theme-toggle">
          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleTheme}
            />
            <span>Dark Mode</span>
          </label>
        </div>
      </div>
      
      <div className="control-group">
        <h3>Chart Type</h3>
        <div className="chart-type-options">
          {chartTypes.map(type => (
            <label key={type.value} className="radio-label">
              <input
                type="radio"
                name="chartType"
                value={type.value}
                checked={chartType === type.value}
                onChange={() => onChartTypeChange(type.value)}
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="control-group">
        <h3>Data Metric</h3>
        <div className="data-metric-options">
          {metrics.map(metric => (
            <label key={metric.value} className="radio-label">
              <input
                type="radio"
                name="dataMetric"
                value={metric.value}
                checked={dataMetric === metric.value}
                onChange={() => onDataMetricChange(metric.value)}
              />
              <span>{metric.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="control-group">
        <div className="countries-header">
          <h3>Countries</h3>
          <div className="selection-buttons">
            <button onClick={onSelectAll}>Select All</button>
            <button onClick={onClearAll}>Clear All</button>
          </div>
        </div>
        <div className="country-filters">
          {countries.map(country => (
            <label key={country.country} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedCountries.includes(country.country)}
                onChange={() => onCountryToggle(country.country)}
              />
              <span>{country.country}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Controls;