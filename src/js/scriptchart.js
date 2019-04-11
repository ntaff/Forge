// Call in each maps function StringToTabOb() and StringToTabFF()

// Global Variables
var tabOb = [];
var tabFF = [];
var tabTM = [];

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
        console.log(tabTM);
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

  var chart = Highcharts.chart('fftm',{
      chart: {
          renderTo: 'container',
          type: 'column',
          options3d: {
              enabled: true,
              alpha: 15,
              beta: 15,
              depth: 50,
              viewDistance: 25
          }
      },
      title: {
          text: 'Chart rotation demo'
      },
      subtitle: {
          text: 'Test options by dragging the sliders below'
      },
      plotOptions: {
          column: {
              depth: 25
          }
      },
      series: [{
          data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
      }]
  });

  function showValues() {
      $('#alpha-value').html(chart.options.chart.options3d.alpha);
      $('#beta-value').html(chart.options.chart.options3d.beta);
      $('#depth-value').html(chart.options.chart.options3d.depth);
  }

  // Activate the sliders
  $('#sliders input').on('input change', function () {
      chart.options.chart.options3d[this.id] = parseFloat(this.value);
      showValues();
      chart.redraw(false);
  });

  showValues();
}

async function scriptchart_correlation()
{
  await filledTabOb();
  await filledTabFF();

  // Creation of the chart
  Highcharts.chart('container', {
    chart: {
      type: 'column'
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
