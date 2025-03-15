import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { formatNumber, truncateText } from '../utils/helper.js';
import { useTheme } from '../context/ThemeContext';

/**
 * Bar Chart component using D3.js
 * @param {Object} props - Component props
 * @returns {JSX.Element} Bar Chart component
 */
const BarChart = ({ 
  data, 
  width = 900, 
  height = 500, 
  metric = 'cases',
  onDataPointHover 
}) => {
  const svgRef = useRef(null);
  const { darkMode } = useTheme();
  const [zoomed, setZoomed] = useState(false);
  
  // Constants for chart dimensions
  const margin = { top: 40, right: 100, bottom: 80, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Effect for creating/updating the chart
  useEffect(() => {
    if (!data || !data.length) return;
    
    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
    
    // Create chart group with margins
    const g = svg.append("g")
      .attr("class", "chart-container")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.country))
      .range([0, innerWidth])
      .padding(0.3);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[metric]) * 1.1]) // Add 10% padding at top
      .nice()
      .range([innerHeight, 0]);
    
    // Create color scale
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.country))
      .range(d3.schemeCategory10);
    
    // Add clip path for zoom
    svg.append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight);
    
    // Create x-axis
    const xAxis = g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .style("font-size", "12px")
      .style("fill", darkMode ? "#e1e1e1" : "#333");
    
    // Create y-axis with transition
    const yAxis = g.append("g")
      .attr("class", "y-axis");
    
    // Initial y-axis creation
    yAxis.call(d3.axisLeft(y).ticks(8).tickFormat(d => {
      // Use K for thousands, M for millions, B for billions
      if (d >= 1000000000) return (d / 1000000000).toFixed(1) + 'B';
      if (d >= 1000000) return (d / 1000000).toFixed(1) + 'M';
      if (d >= 1000) return (d / 1000).toFixed(1) + 'K';
      return d;
    }));
    
    // Style y-axis
    yAxis.selectAll("text")
      .style("font-size", "12px")
      .style("fill", darkMode ? "#e1e1e1" : "#333");
    
    // Add x-axis label
    g.append("text")
      .attr("class", "axis-label")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 10)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", darkMode ? "#a0a0a0" : "#666")
      .text("Country");
    
    // Add y-axis label
    g.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 20)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", darkMode ? "#a0a0a0" : "#666")
      .text(metric.charAt(0).toUpperCase() + metric.slice(1));
    
    // Add chart title
    g.append("text")
      .attr("class", "chart-title")
      .attr("x", innerWidth / 2)
      .attr("y", -margin.top / 2)
      .style("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("fill", darkMode ? "#e1e1e1" : "#333")
      .text(`COVID-19 ${metric.charAt(0).toUpperCase() + metric.slice(1)} by Country`);
    
    // Create bar group
    const barGroup = g.append("g")
      .attr("class", "bars")
      .attr("clip-path", "url(#clip)");
    
    // Add bars with transition
    const bars = barGroup.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.country))
      .attr("width", x.bandwidth())
      .attr("y", innerHeight) // Start from the bottom
      .attr("height", 0)
      .attr("fill", d => colorScale(d.country))
      .attr("rx", 2) // Rounded corners
      .attr("ry", 2);
    
    // Add tooltip interaction
    bars.on("mouseover", function(event, d) {
      d3.select(this)
        .transition()
        .duration(150)
        .attr("opacity", 0.8)
        .attr("stroke", darkMode ? "#fff" : "#000")
        .attr("stroke-width", 2);
        
      // Show tooltip
      onDataPointHover({
        country: d.country,
        cases: d.cases,
        deaths: d.deaths,
        recovered: d.recovered,
        active: d.active,
        value: d[metric],
        metric: metric.charAt(0).toUpperCase() + metric.slice(1)
      }, event);
    })
    .on("mouseout", function() {
      d3.select(this)
        .transition()
        .duration(150)
        .attr("opacity", 1)
        .attr("stroke", "none");
        
      onDataPointHover(null, null);
    });
    
    // Add transition for bars
    bars.transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr("y", d => y(d[metric]))
      .attr("height", d => innerHeight - y(d[metric]));
    
    // Add data labels
    const labels = barGroup.selectAll(".data-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "data-label")
      .attr("x", d => x(d.country) + x.bandwidth() / 2)
      .attr("y", d => y(d[metric]) - 5)
      .style("text-anchor", "middle")
      .style("font-size", "11px")
      .style("fill", darkMode ? "#e1e1e1" : "#333")
      .style("opacity", 0)
      .text(d => {
        // Format large numbers
        const value = d[metric];
        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
        return value;
      });
    
    // Add transition for labels
    labels.transition()
      .duration(800)
      .delay((d, i) => i * 50 + 300)
      .style("opacity", 1);
    
    // Create legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin.right + 40}, ${margin.top})`);
    
    const legendItems = legend.selectAll(".legend-item")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);
    
    legendItems.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", d => colorScale(d.country));
    
    legendItems.append("text")
      .attr("x", 20)
      .attr("y", 10)
      .style("font-size", "12px")
      .style("fill", darkMode ? "#e1e1e1" : "#333")
      .text(d => truncateText(d.country, 15));
    
    // Add zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([1, 5])
      .extent([[0, 0], [innerWidth, innerHeight]])
      .on("zoom", (event) => {
        // Update state to indicate zoom has occurred
        setZoomed(true);
        
        // Apply transformation to bar group
        g.selectAll(".bars").attr("transform", event.transform);
        
        // Update x-axis
        const newX = event.transform.rescaleX(x);
        g.select(".x-axis").call(d3.axisBottom(newX))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .style("font-size", "12px")
          .style("fill", darkMode ? "#e1e1e1" : "#333");
      });
    
    // Add zoom behavior to SVG
    svg.call(zoom);
    
    // Add reset zoom button
    const resetButton = svg.append("g")
      .attr("class", "reset-button")
      .style("cursor", "pointer")
      .style("visibility", zoomed ? "visible" : "hidden")
      .on("click", () => {
        svg.transition().duration(750).call(
          zoom.transform,
          d3.zoomIdentity
        );
        setZoomed(false);
      });
    
    resetButton.append("rect")
      .attr("x", width - 100)
      .attr("y", 10)
      .attr("width", 80)
      .attr("height", 25)
      .attr("rx", 4)
      .attr("fill", darkMode ? "#3498db" : "#1b9cfc")
      .attr("opacity", 0.8);
    
    resetButton.append("text")
      .attr("x", width - 60)
      .attr("y", 26)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "white")
      .text("Reset Zoom");
    
    // Update reset button visibility when zoom state changes
    resetButton.style("visibility", zoomed ? "visible" : "hidden");
    
  }, [data, metric, darkMode, innerWidth, innerHeight, onDataPointHover, zoomed]);
  
  return (
    <svg ref={svgRef} className="d3-bar-chart"></svg>
  );
};

export default BarChart;
