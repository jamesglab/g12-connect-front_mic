import { ChartType } from './apex.model';

// creado para donut-transactions component
const totalDonutValues: ChartType = {
  chart: {
    height: 320,
    type: 'donut',
  },
  series: [],
  labels: [],
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    verticalAlign: 'middle',
    floating: false,
    fontSize: '14px',
    offsetX: 0,
    offsetY: -10,
  },
  colors: ['#598bff', '#2ce69b', '#ffabab', '#ffddcc'],
  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: {
          height: 240,
        },
        legend: {
          show: false,
        },
      },
    },
  ],
};

// creado para compare-years component 
const barsColumns: ChartType = {
  series: [
    {
      name: "total",
      data: [

        0,
        0,
        0,
        0,
        0,
        0,
        0,
        30000,
        0,
        0,
        0,
        0

      ]
    }
  ],
  chart: {
    height: 350,
    type: "bar",
    events: {
      click: function (chart, w, e) {
        // console.log(chart, w, e)
      }
    }
  },
  colors: [
    "#008FFB",
    "#00E396",
    "#FEB019",
    "#FF4560",
    "#775DD0",
    "#546E7A",
    "#26a69a",
    "#D10CE8",
    "#008FFB",
    "#00E396",
    "#FEB019",
    "#FF4560"
  ],
  plotOptions: {
    bar: {
      columnWidth: "45%",
      distributed: true
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  grid: {
    show: false
  },
  xaxis: {
    categories: [

      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE"

    ],
    labels: {
      style: {
        colors: [
          "#008FFB",
          "#00E396",
          "#FEB019",
          "#FF4560",
          "#775DD0",
          "#546E7A",
          "#26a69a",
          "#D10CE8",
          "#008FFB",
          "#00E396",
          "#FEB019",
          "#FF4560",
          "#775DD0"
        ],
        fontSize: "12px"
      }
    }
  }
};

//  creado para bars-status-payment component
const barsColumnsStatus: ChartType = {

  series: [
    {
      name: "Total",
      data: [21, 22, 10, 28]
    }
  ],
  chart: {
    height: 350,
    type: "bar",
    events: {
      click: function (chart, w, e) {
        // console.log(chart, w, e)
      }
    }
  },
  colors: [
    "#008FFB",
    "#00E396",
    "#FEB019",
    "#FF4560",
    "#775DD0",
    "#546E7A",
    "#26a69a",
    "#D10CE8"
  ],
  plotOptions: {
    bar: {
      columnWidth: "45%",
      distributed: true
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  grid: {
    show: false
  },
  xaxis: {
    categories: [
      'APROBADAS',
      'EN PROCESO',
      'CANCELADAS'
    ],
    labels: {
      style: {
        colors: [
          "#008FFB",
          "#00E396",
          "#FEB019",
          "#FF4560",
          "#775DD0",
          "#546E7A",
          "#26a69a",
          "#D10CE8"
        ],
        fontSize: "12px"
      }
    }
  }
};
const simplePieChart: ChartType = {
  chart: {
    height: 320,
    type: 'pie',
  },
  series: [],
  labels: [],
  colors: ['#34c38f', '#556ee6', '#f46a6a', '#50a5f1', '#f1b44c'],
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    verticalAlign: 'middle',
    floating: false,
    fontSize: '14px',
    offsetX: 0,
    offsetY: -10,
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: {
          height: 240,
        },
        legend: {
          show: false,
        },
      },
    },
  ],
};



export { totalDonutValues, simplePieChart, barsColumns, barsColumnsStatus };

export const createBarsColumns = (series, labels,) => {
  const bars = {
    series: [
      {
        name: "total",
        data: series
      }
    ],
    chart: {
      height: 350,
      type: "bar",
    },
    colors: [
      "#008FFB",
      "#00E396",
      "#FEB019",
      "#FF4560",
      "#775DD0",
      "#546E7A",
      "#26a69a",
      "#D10CE8",
      "#008FFB",
      "#00E396",
      "#FEB019",
      "#FF4560"
    ],
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    grid: {
      show: false
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          colors: [
            "#008FFB",
            "#00E396",
            "#FEB019",
            "#FF4560",
            "#775DD0",
            "#546E7A",
            "#26a69a",
            "#D10CE8",
            "#008FFB",
            "#00E396",
            "#FEB019",
            "#FF4560",
            "#775DD0"
          ],
          fontSize: "12px"
        }
      }
    }
  };;
  return bars;
}

export const validateChartValues = (allSeries) => {
  var serie = 0
  allSeries.map(seri => {
    serie = serie + seri
  });
  if (serie > 0) {
    return true;
  } else {
    return false;
  }
}

export const timeLineChart = (series,categories) => {
  return {
    chart: {
      height: 380,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#556ee6', '#34c38f'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      width: [3, 3],
      curve: 'straight'
    },
    series,
    title: {
      text: '',
      align: ''
    },
    grid: {
      row: {
        colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.2
      },
      borderColor: '#f1f1f1'
    },
    markers: {
      style: 'inverted',
      size: 6
    },
    xaxis: {
      categories,
      title: {
        text: 'Horas'
      }
    },
    yaxis: {
      title: {
        text: ''
      },
      min: 5,
      max: 40
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    },
    responsive: [{
      breakpoint: 600,
      options: {
        chart: {
          toolbar: {
            show: false
          }
        },
        legend: {
          show: false
        },
      }
    }]
  };
}