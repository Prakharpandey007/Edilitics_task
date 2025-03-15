# COVID-19 Data Visualization

## Overview
COVID-19 Data Visualization is a React application that utilizes D3.js to create interactive visualizations of COVID-19 data. The application provides various charts and filtering options to explore trends across different countries and metrics.

## Features
- **Interactive Charts**: Supports bar charts, pie charts, scatter plots, etc.
- **Data Filters**: Users can filter data based on countries, metrics, and chart types.
- **Customizable Themes**: Implements theme switching via Context API.
- **D3.js Integration**: Uses core D3.js for rendering visualizations.
- **Tooltip**: Display data details when hovering over a data point.
- **Legends**: Display category labels for better readability.
- **Dynamic Data Updates**: Chart should update when new data is added.




## Project Structure
```
covid19-data-visualization/
│-- src/
│   ├── api/
│   │   ├── fetchData.js        # API calls to fetch COVID-19 data
│   ├── components/
│   │   ├── BarChart.jsx        # Bar chart visualization
│   │   ├── Control.jsx         # UI controls for filtering
│   │   ├── PieChart.jsx        # Pie chart visualization
│   │   ├── ScatterPlot.jsx     # Scatter plot visualization
│   │   ├── Tooltip.jsx         # Tooltip for displaying data points
│   ├── context/
│   │   ├── ThemeContext.jsx    # Context API for theme management
│   ├── utils/
│   │   ├── helper.js           # Utility functions
│   ├── App.js                  # Root component
│   ├── index.js                # Application entry point
│-- public/
│-- package.json
│-- README.md
```


## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/covid19-data-visualization.git
   cd covid19-data-visualization
2. Install Dependencies:
   ``` sh
   npm install
 3. Start the deployement Server:
   ``` sh
   npm run dev
   ```
 ## Usage

- Select different chart types from the control panel.

- Filter data by country and available COVID-19 metrics.

- Hover over charts to view tooltips with detailed information.


## Technologies Used

- React.js for UI components

- D3.js for data visualization

- Context API for theme management

- JavaScript (ES6+) for development

## Contribution

Feel free to fork this repository and submit pull requests with improvements.

## License

This project is open-source and available under the MIT License.


