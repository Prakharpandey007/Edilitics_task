
import React, { useState, useEffect } from 'react';
import { fetchCountriesData } from './api/fetchData';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import ScatterPlot from './components/ScatterPlot';
import Controls from './components/Control.jsx';
import Tooltip from './components/Tooltip.jsx';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './App.css';

function Dashboard() {
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [dataMetric, setDataMetric] = useState('cases');
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { darkMode } = useTheme();

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const countriesData = await fetchCountriesData();
        
        // Sort by cases and select top countries
        const sortedData = countriesData
          .sort((a, b) => b.cases - a.cases);
        
        setData(sortedData);
        
        // Initialize with top 5 countries selected
        setSelectedCountries(sortedData.slice(0, 5).map(country => country.country));
        
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter data based on selected countries
  const filteredData = data.filter(country => 
    selectedCountries.includes(country.country)
  );

  // Handle country toggle
  const handleCountryToggle = (country) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  // Handle chart type change
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  // Handle data metric change
  const handleDataMetricChange = (metric) => {
    setDataMetric(metric);
  };

  // Handle tooltip events
  const handleDataPointHover = (dataPoint, event) => {
    if (dataPoint) {
      setTooltipData(dataPoint);
      setTooltipPosition({ x: event.pageX, y: event.pageY });
      setTooltipVisible(true);
    } else {
      setTooltipVisible(false);
    }
  };

  // Select all countries (limited to top 20 for performance)
  const handleSelectAll = () => {
    setSelectedCountries(data.slice(0, 20).map(country => country.country));
  };

  // Clear all selected countries
  const handleClearAll = () => {
    setSelectedCountries([]);
  };

  // Render the appropriate chart based on chartType
  const renderChart = () => {
    const chartProps = {
      data: filteredData,
      metric: dataMetric,
      onDataPointHover: handleDataPointHover
    };

    switch (chartType) {
      case 'pie':
        return <PieChart {...chartProps} />;
      case 'scatter':
        return <ScatterPlot {...chartProps} />;
      case 'bar':
      default:
        return <BarChart {...chartProps} />;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {loading ? (
        <div className="loading">
          <p>Loading COVID-19 data...</p>
        </div>
      ) : error ? (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : (
        <div className="dashboard">
          <div className="sidebar">
            <Controls 
              countries={data}
              selectedCountries={selectedCountries}
              onCountryToggle={handleCountryToggle}
              chartType={chartType}
              onChartTypeChange={handleChartTypeChange}
              dataMetric={dataMetric}
              onDataMetricChange={handleDataMetricChange}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
            />
          </div>
          <div className="main-content">
            <div className="chart-container">
              {selectedCountries.length === 0 ? (
                <div className="no-data-message">
                  <p>Please select at least one country to display data</p>
                </div>
              ) : (
                renderChart()
              )}
            </div>
          </div>
        </div>
      )}
      <Tooltip 
        data={tooltipData}
        position={tooltipPosition}
        visible={tooltipVisible}
      />
    </div>
  );
}

// Wrap Dashboard with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;