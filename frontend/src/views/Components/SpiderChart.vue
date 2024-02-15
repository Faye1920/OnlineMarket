<template>
  <div ref="chartContainer" id="chart-container" class="chart-container"></div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { onMounted, ref, watchEffect } from 'vue';

// Reference to the container element where the chart will be rendered.
const chartContainer = ref<HTMLElement | null>(null);

// Props passed to the component - includes the data for the chart and its dimensions.
const props = defineProps({
  chartData: Object,
  width: Number,
  height: Number
});

interface RadarChartDataItem {
  axis: string;
  value: number;
}
function createOrUpdateSpiderChart() {
  if (!props.chartData || !chartContainer.value) return;

  chartContainer.value.innerHTML = '';
  
  const phoneDetails = props.chartData;

  const mapPhoneDetailsData = (phonesMap: Record<string, any>) => {
    if (!phonesMap) return [];
    return Object.keys(phonesMap)
      .map((key) => ({
        axis: key,
        value: phonesMap[key],
      }))
      .slice(0, 5);
  };

  // Prepare the data for rendering the chart.
  const spiderChartData = [mapPhoneDetailsData(phoneDetails)];

  //Chart dimensions.
  const width = props.width || 300;
  const height = props.height || 200;
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const radius = Math.min(width, height) / 2;
  const angleSlice = (Math.PI * 2) / spiderChartData[0].length; // Angle slice for each skill.


  // Create the SVG element to render the chart.
  const svg = d3
    .select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);

  // Grid circles inside the chart.
  const axisGrid = svg.append("g").attr("class", "axisWrapper");
  axisGrid
    .selectAll(".levels")
    .data(d3.range(1, 4).reverse()) // Create 3 concentric circles.
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", (d: number) => (radius / 3) * d)
    .style("fill", "#CDCDCD") // Background color for circles.
    .style("stroke", "#CDCDCD") // Border color for circles.
    .style("fill-opacity", 0.1); // Transparency of circles.


  // Remove the existing grid circles
  axisGrid.selectAll(".gridCircle").remove();

  // Drawing a pentagonal grid instead of circular
  const levels = 3; // Number of levels in the grid
  for(let level = 0; level < levels; level++){
    let vertices = [];
    for(let i = 0; i < spiderChartData[0].length; i++){
      const x = radius * (1 - (level / levels)) * Math.cos(angleSlice * i - Math.PI / 2);
      const y = radius * (1 - (level / levels)) * Math.sin(angleSlice * i - Math.PI / 2);
      vertices.push([x, y]);
    }
    vertices.push(vertices[0]); // Close the path
    
    axisGrid.selectAll(".levels")
      .data([vertices])
      .enter()
      .append("polygon")
      .attr("points", (d: any[][]) => d.map((point: any[]) => point.join(",")).join(" "))
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", 0.1)
      .style("fill", "#CDCDCD");
  }

    
  // Axes representing each phoneDetails.
  const axes = axisGrid
    .selectAll(".axis")
    .data(spiderChartData[0])
    .enter()
    .append("g")
    .attr("class", "axis");

  // Axis lines.
  axes
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d: any, i: number) => radius * Math.cos(angleSlice * i - Math.PI / 2))
    .attr("y2", (d: any, i: number) => radius * Math.sin(angleSlice * i - Math.PI / 2))
    .attr("class", "line")
    .style("stroke", "white") // Color of axis lines.
    .style("stroke-width", "2px");

  // Axis labels (Skill phoneDetails).
  axes
    .append("text")
    .attr("class", "legend")
    .style("font-size", "12px")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", (d: any, i: number) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))
    .attr("y", (d: any, i: number) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
    .text((d: { axis: any; }) => d.axis)
    .style("fill", ""); // Custom color for the label texts.


  const radarLine = d3.lineRadial<RadarChartDataItem>()
  .radius((d) => {
    if (typeof d === 'object' && 'value' in d) {
      return radius * d.value;
    }
    return 0;
  })

    .curve(d3.curveLinearClosed)
    .angle((d, i) => i * angleSlice);
  
  // Radar chart blobs (Actual skill values).
  const radarWrapper = svg
    .selectAll(".radarWrapper")
    .data(spiderChartData)
    .enter()
    .append("g")
    .attr("class", "radarWrapper");

  // Radar chart areas (filled color areas representing skills).
  radarWrapper
    .append("path")
    .attr("class", "radarArea")
    .attr("d", (d: any) => radarLine(d))
    .style("fill", "#FF25D9") // Fill color for the area.
    .style("fill-opacity", 0.1); // Transparency of the filled area.

  // Radar chart strokes (outline of the radar chart).
  radarWrapper
    .append("path")
    .attr("class", "radarStroke")
    .attr("d", (d: any) => radarLine(d))
    .style("stroke-width", 1)
    .style("stroke", "#FF1CC0") // Outline color of the radar chart.
    .style("fill", "none");

  // Text labels for each data point on the radar chart.
  // radarWrapper
  //   .selectAll(".radarCircle")
  //   .data((d: any) => d)
  //   .enter()
  //    .append("text")  //pour lire la métrique avec précision
  //   .attr("class", "radarCircle")
  //   .attr(
  //     "x",
  //     (d: { value: number; }, i: number) => radius * d.value * Math.cos(angleSlice * i - Math.PI / 2)
  //   )
  //   .attr(
  //     "y",
  //     (d: { value: number; }, i: number) => radius * d.value * Math.sin(angleSlice * i - Math.PI / 2)
  //   )
  //   .text((d: { axis: any; value: any; }) => `${d.axis}: ${d.value}`)
  //   .style("font-size", "10px") // Font size for the data point labels.
  //   .attr("text-anchor", "middle")
  //   .attr("dy", "0.35em")
  //   .style("fill", "#FF25D9"); // Color for the data point labels (bright purple).

radarWrapper
  .selectAll(".radarCircle")
  .data((d: RadarChartDataItem[]) => d)
  .enter()
  .append("circle")
  .attr("class", "radarCircle")
  .attr("cx", (d: RadarChartDataItem, i: number) => radius * d.value * Math.cos(angleSlice * i - Math.PI / 2))
  .attr("cy", (d: RadarChartDataItem, i: number) => radius * d.value * Math.sin(angleSlice * i - Math.PI / 2))
  .attr("r", 4)
  .style("fill", "#FF25D9")
  .style("fill-opacity", 0.7);
}



onMounted(() => {
  createOrUpdateSpiderChart();
});

watchEffect(() => {
  createOrUpdateSpiderChart();
});
</script>

<style scoped>
#chart-container {
  text-align: center;
}

.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    margin: auto;
}

@media (max-width: 600px) {
    .chart-container {
        flex-direction: column;
        width: 90%;
    }
}
</style>