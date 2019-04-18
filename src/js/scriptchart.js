// Call in each maps function StringToTabOb() and StringToTabFF()

// Global Variables
var tabOb = [];
var tabFF = [];
var tabTM = [];
var tabIN = [];

// Waiting for tabOb to be filled with datas
function filledTabOb()
{
  return new Promise(resolve => {
      setTimeout(() => {
              while(tabOb.length == 0){}
              resolve();
      }, 1000);
  });
}

// Waiting for tabFF to be filled with datas
function filledTabFF()
{
  return new Promise(resolve => {
      setTimeout(() => {
              while(tabFF.length == 0){}
              resolve();
      }, 1000);
  });
}

// Waiting for tabTM to be filled with datas
function filledTabTM()
{
  return new Promise(resolve => {
      setTimeout(() => {
              while(tabTM.length == 0){}
              resolve();
      }, 1000);
  });
}

// Waiting for tabTM to be filled with datas
function filledTabIN()
{
  return new Promise(resolve => {
      setTimeout(() => {
              while(tabIN.length == 0){}
              resolve();
      }, 1000);
  });
}

// Correlation between obesity and states
async function StringToTabOb()
{
  $(document).ready(function(){
    $.ajax({
      method: "GET",
      url: "/ob",
      dataType: "JSON",
      success: function(data){
        for (var i in data)
        {
          var state = data[i].State;
          var value = parseFloat(data[i].Value);
          tabOb.push([state,value]);
        }
        tabOb.sort();
      }
    });
  });
}

// Correlation between fast food's number and states
async function StringToTabFF()
{
  $(document).ready(function(){
    $.ajax({
      method: "GET",
      url: "/ff",
      dataType: "JSON",
      success:function(data){
        for (var i in data)
        {
          var state = data[i].State;
          var quantity = parseFloat(data[i].Quantity);
          tabFF.push([state,quantity]);
        }
        tabFF.sort();
      }
    });
  });
}

async function StringToTabTM()
{
  $(document).ready(function(){
    $.ajax({
      method: "GET",
      url: "/fftm",
      dataType: "JSON",
      success:function(data){
        for (var i in data)
        {
          var state = data[i].State;
          var quantity = parseFloat(data[i].Quantity);
          tabTM.push([state,quantity]);
        }
        tabTM.sort();
      }
    });
  });
}

async function StringToTabIN()
{
  $(document).ready(function(){
    $.ajax({
      method: "GET",
      url: "/ffinhabitants",
      dataType: "JSON",
      success:function(data){
        for (var i in data)
        {
          var state = data[i].State;
          var quantity = parseFloat(data[i].Quantity);
          tabIN.push([state,quantity]);
        }
        tabIN.sort();
      }
    });
  });
}

async function scripchart_obesite_etat()
{
  await filledTabOb();
  var tabEt = [];
  var tabVal = [];

  for(var i=1; i<tabOb.length;i++){
    tabEt.push([tabOb[i][0]]);
    tabVal.push([tabOb[i][1]]);
  }

  var chart = Highcharts.chart('obesiteEtat', {
    chart: {
      resetZoomButton: {
                    theme: {
                        display: 'none'
                    }
                },
         zoomType: 'x',
         backgroundColor:'#F0F0F0'
    },
    title: {
      text: 'Taux d\'obésité par états (en %)'
    },

    xAxis: {
      categories: tabEt
    },

    yAxis: {
      title: {
        text: 'Obésité en %'
      }
    },

    tooltip: {
      pointFormat: '<b>{point.y}%</b>'
    },

    series: [{
      type: 'column',
      colorByPoint: false,
      data: tabVal,
      zones: [{
            value: 27,
            color: 'green'
        }, {
            value: 30,
            color: '#f9d82f'
        }, {
            value: 35,
            color: '#e58014'
        }, {
            color: '#d10000'
        }],
      showInLegend: false
    }]

  });


  $('#plain').click(function () {
    chart.update({
      chart: {
        inverted: false
      }
    });
  });

  $('#inverted').click(function () {
    chart.update({
      chart: {
        inverted: true
      }
    });
  });
}

async function scriptchart_tm_state()
{

  await filledTabTM();
  var tabEt = [];
  var tabVal = [];

  for(var i=1; i<tabTM.length;i++){
    tabEt.push([tabTM[i][0]]);
    tabVal.push([tabTM[i][1]]);
  }

  var chart = Highcharts.chart('fftm',{
      chart: {
        resetZoomButton: {
                      theme: {
                          display: 'none'
                      }
                  },
          renderTo: 'tope',
          type: 'column',
          zoomType: 'x',
          backgroundColor:'#F0F0F0'
      },
      title: {
          text: 'Nombre de Tim Hortons par états'
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: tabEt
      },
      yAxis: {
      title: {
        text: 'Quantité'
        }
      },
      series: [{
          data: tabVal,
          color: '#bf1313'
      }]
  });
}

async function scriptchart_ff_inhabitants()
{

  tabEt = [];
  tabValInhabitants = [];
  tabValFF = [];
  tabINST = [];

  await filledTabIN();
  await filledTabFF();

  for(var i=3; i<tabIN.length;i++){
    tabValInhabitants.push([tabIN[i][1]]);
  }

  for(var i=1; i<tabFF.length;i++){
    tabValFF.push([tabFF[i][1]]);
  }

  for(var i=1; i<tabFF.length;i++){
    tabEt.push([tabFF[i][0]]);
  }

  // calculs pour les données
  for(var i=0;i<50;i++){
    tabINST.push([tabValInhabitants[i]/tabValFF[i]]);
  }

  Highcharts.chart('ff_inhabitants', {
    chart: {
      resetZoomButton: {
                    theme: {
                        display: 'none'
                    }
                },
      type: 'cylinder',
      zoomType: 'x',
      backgroundColor:'#F0F0F0'
    },
    title: {
      text: 'Nombre d\'habitants par McDonald\'s dans chaque état'
    },
    xAxis: {
        categories: tabEt
    },
    yAxis: {
      title: {
        text: 'Quantité'
      }
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b>'
    },
    series: [{
      data: tabINST,
      color: '#eeba18',
      showInLegend: false
    }]
  });


}

async function scriptchart_correlation()
{
  await filledTabOb();
  await filledTabFF();

  // Creation of the chart
  Highcharts.chart('tope', {
    chart: {
      resetZoomButton: {
                    theme: {
                        display: 'none'
                    }
                },
      type: 'column',
      zoomType: 'x',
      backgroundColor:'#F0F0F0'
    },
    title: {
      text: "Corrélation entre le nombre de fast food et le taux d'obésité par états"
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -45,
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    },
    yAxis: [{
      min: 0,
      max: 1200,
      title: {
        text: 'Nombre de fast food'
      }
      },{
          lineWidth: 1,
          min: 20,
          max: 40,
          opposite: true,
          title: {
              text: 'Taux obésite en %'
          }
    }],

    legend: {
      enabled: true
    },
    tooltip: {
      pointFormat: '<b>{point.y}</b>'
    },

    series: [{
      yAxis :0,
      name: 'Nbre fast food',
      data: tabFF,
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        format: '{point.y}', // one decimal
        y: 10, // 10 pixels down from the top
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    },{
      yAxis: 1,
      type: 'spline',
      name: 'Obésité',
      data: tabOb

    }],
  });
}

async function scriptchart_camembert_ff()
{
  Highcharts.chart('camembertFF', {
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0
      },
      backgroundColor:'#F0F0F0'

    },
    title: {
      text: 'Fast food autour du point '
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 35,
      }
    },
    series: [{
      type: 'pie',
      name: 'Fast food',
      data: [
        ['McDonald\'s', 45.0],
        ['Burger King', 26.8],
        ['Pizza Hut', 8.5],
        ['Tim Horton\'s', 6.2]
      ]
    }]
  });

}

async function geochartObesityUS()
{
  await filledTabOb();

  var dataTable = new google.visualization.DataTable();
	dataTable.addColumn('string', 'State');
	dataTable.addColumn('number', 'Obesity');

  // Converting Array to DataTable for Charts
  for(var i = 1; i < tabOb.length; i++)
  {
    dataTable.addRow([tabOb[i][0],tabOb[i][1]]);
  }

	var options = {
	  region: 'US',
	  displayMode: 'regions',
	  resolution: 'provinces',
	  minValue: 0,
	  maxValue: 100,
    backgroundColor: '#F0F0F0',
	  colors:['white','#773239']
	};

	var chart = new google.visualization.GeoChart(
		document.getElementById('geochart'));
		chart.draw(dataTable, options);
}
