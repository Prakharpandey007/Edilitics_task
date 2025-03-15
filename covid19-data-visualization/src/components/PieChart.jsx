import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../context/ThemeContext';

const PieChart = ({ data, width = 500, height = 500, metric = 'cases', onDataPointHover }) => {
  const svgRef = useRef(null);
  const { darkMode } = useTheme();
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!data || !data.length) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const radius = Math.min(width, height) / 2 - 60;
    const colorScale = d3.scaleOrdinal().domain(data.map(d => d.country)).range(d3.schemeCategory10);
    
    const svg = d3.select(svgRef.current)
      .attr("width", width + 200)
      .attr("height", height + 50)
      .attr("viewBox", `0 0 ${width + 200} ${height + 50}`)
      .attr("style", "max-width: 100%; height: auto; position: relative;")
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2 + 50})`);
    
    const pie = d3.pie().value(d => d[metric]);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const labelArc = d3.arc().innerRadius(radius * 0.7).outerRadius(radius * 0.7);
    const arcs = pie(data);

    // Add title
    svg.append("text")
      .attr("x", 0)
      .attr("y", -radius - 40)
      .style("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("fill", darkMode ? "#e1e1e1" : "#333")
      .text(`COVID-19 ${metric.charAt(0).toUpperCase() + metric.slice(1)}`);

    const path = svg.selectAll(".arc")
      .data(arcs)
      .enter()
      .append("path")
      .attr("class", "arc")
      .attr("d", arc)
      .attr("fill", d => colorScale(d.data.country))
      .attr("stroke", darkMode ? "#fff" : "#000")
      .style("stroke-width", "2px")
      .style("opacity", 1)
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(150).attr("opacity", 0.8);
        const [x, y] = d3.pointer(event);
        d3.select("#tooltip")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`)
          .style("display", "block")
          .html(`<strong>${d.data.country}</strong><br/>${metric}: ${d.data[metric].toLocaleString()}`);
        onDataPointHover({ country: d.data.country, value: d.data[metric], metric });
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(150).attr("opacity", 1);
        d3.select("#tooltip").style("display", "none");
        onDataPointHover(null);
      });

    // Add text labels
    svg.selectAll(".arc-text")
      .data(arcs)
      .enter()
      .append("text")
      .attr("transform", d => `translate(${labelArc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", darkMode ? "#e1e1e1" : "#333")
      .text(d => d.data.country);

    // Create legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${radius + 50}, ${-radius})`);
    
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
      .text(d => d.country);
  }, [data, metric, darkMode, onDataPointHover]);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef} className="d3-pie-chart"></svg>
      <div id="tooltip" style={{
        position: "absolute", display: "none", backgroundColor: "rgba(0,0,0,0.7)", color: "white",
        padding: "8px", borderRadius: "4px", pointerEvents: "none"
      }}></div>
    </div>
  );
};

export default PieChart;
