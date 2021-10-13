import { ChartType } from './apex.model';
export { totalDonutValues, simplePieChart, barsColumns, barsColumnsStatus };

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
export const totalValueDonut = (series, labels, currency) => {
  console.log('devolvemos donut chart', currency)
  return {
    chart: {
      height: 500,
      type: 'donut',
    },
    series,
    labels,
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        colors: undefined
    },
      formatter: function (val) {
        return val + '*'
      },
    },
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

  }


}

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


export const simplePieChartCreate = (series, labels, currency) => {
  return {
    chart: {
      height: 320,
      type: 'pie',
    },
    series,
    labels,
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

    yaxis: {
      labels: {
        formatter: function (value) {
          return new Intl.NumberFormat('jp-JP', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);
        }
      },
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
  }
}

export const createBarsColumns = (series, labels, currency) => {
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
    yaxis: {
      labels: {
        formatter: function (value) {
          return new Intl.NumberFormat('jp-JP', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);
        }
      },
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

export const paymnetMethosStatus = (series, labels) => {
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


export const chartHours = (series: [{}], categories: any, currency: any) => {
  return {
    series,
    chart: {
      height: 350,
      type: 'area',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      categories,
    },

    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
      y: {
        formatter: function (value) {
          return new Intl.NumberFormat('jp-JP', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);
          
        }
      }
    },
  };
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

export const timeLineChart = (series, categories, currency) => {
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
        text: 'Meses'
      }
    },
    yaxis: {
      title: {
        text: ''
      },
      labels: {
        formatter: function (value) {
          return new Intl.NumberFormat('jp-JP', { style: 'currency', currency, minimumFractionDigits: 2 }).format(value);
        }
      }
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