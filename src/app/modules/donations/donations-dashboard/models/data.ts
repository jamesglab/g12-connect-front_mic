import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexXAxis,
  ApexAxisChartSeries,
  ApexStroke,
  ApexTooltip,
  ApexGrid,
  ApexMarkers,
} from 'ng-apexcharts';

export const donutChart = (
  series: ApexNonAxisChartSeries,
  labels: ApexDataLabels,
  chart: ApexChart,
  legend: ApexLegend,
  responsive: ApexResponsive
) => {
  return {
    chart,
    series,
    labels,
    legend,
    responsive: [responsive],
  };
};

export const createBars = (
  series: ApexAxisChartSeries,
  chart: ApexChart,
  plotOptions: ApexPlotOptions,
  dataLabels: ApexDataLabels,
  legend: ApexLegend,
  yaxis: ApexYAxis,
  xaxis: ApexXAxis
) => {
  return {
    series,
    chart,
    plotOptions,
    dataLabels,
    legend,
    yaxis,
    xaxis,
  };
};

export const chartWithDataTime = (
  series: ApexAxisChartSeries,
  chart: ApexChart,
  dataLabels: ApexDataLabels,
  stroke: ApexStroke,
  xaxis: ApexXAxis,
  tooltip: ApexTooltip
) => {
  return {
    series,
    chart,
    dataLabels,
    stroke,
    xaxis,
    tooltip,
  };
};

export const validateChartValues = (allSeries) => {
  var serie = 0;
  allSeries.map((seri) => {
    serie = serie + seri;
  });
  if (serie > 0) {
    return true;
  } else {
    return false;
  }
};
export const chartTimeLine = (
  series: ApexNonAxisChartSeries,
  chart: ApexChart,
  colors: string[],
  dataLabels: ApexDataLabels,
  stroke: ApexStroke,
  grid: ApexGrid,
  markers: ApexMarkers,
  xaxis: ApexXAxis,
  yaxis: ApexYAxis,
  legend: ApexLegend,
  responsive: ApexResponsive
) => {
  return {
    series,
    chart,
    colors,
    dataLabels,
    stroke,
    grid,
    markers,
    xaxis,
    yaxis,
    legend,
    responive: [responsive],
  };
};
