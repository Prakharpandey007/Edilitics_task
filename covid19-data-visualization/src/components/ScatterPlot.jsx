import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../context/ThemeContext';

const ScatterChart = ({ data, width = 900, height = 500, metric = 'cases', onDataPointHover }) => {
  const svgRef = useRef(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!data || !data.length) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 200, bottom: 80, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.country))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[metric]) * 1.1])
      .nice()
      .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.country))
      .range(d3.schemeCategory10);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", darkMode ? "#e1e1e1" : "#333");

    g.append("g")
      .call(d3.axisLeft(y));

    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 10)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Country");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 20)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text(metric.charAt(0).toUpperCase() + metric.slice(1));

    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", -margin.top / 2)
      .style("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text(`COVID-19 ${metric.charAt(0).toUpperCase() + metric.slice(1)} by Country`);

    const dots = g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.country) + x.bandwidth() / 2)
      .attr("cy", d => y(d[metric]))
      .attr("r", 6)
      .attr("fill", d => colorScale(d.country))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 8);
        onDataPointHover({ country: d.country, value: d[metric], metric });
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 6);
        onDataPointHover(null);
      });

    // Create legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);

    legend.append("text")
      .attr("x", 0)
      .attr("y", -10)
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", darkMode ? "#e1e1e1" : "#333")
      .text("Legend");

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
      .style("font-weight", "bold")
      .style("fill", darkMode ? "#e1e1e1" : "#333")
      .text(d => d.country);
  }, [data, metric, darkMode, onDataPointHover]);

  return <svg ref={svgRef} className="d3-scatter-chart"></svg>;
};

export default ScatterChart;
