
// Correlation between obesity, states, fast food's number
// Parameters : - dataOb : string representing Obesity per state (state,Value)
//              - dateFF : string representing Number of fast food's per state (state,quantity)
function StringToTab(dataOb, dataFF)
{
  for (var i = 0; i < dataOb.length; i++)
  {
    var rowCellsOb = dataOb.split(',');
    var rowCellsFF = dataFF.split(',');
    var tabOb = [];
    var tabFF = [];

    for (var rowCell = 0; rowCell < (rowCellsOb.length - 2); rowCell=rowCell+2)
    {
      var stateOb = rowCellsOb[rowCell];
      var value = parseFloat(rowCellsOb[rowCell+1]);

      var stateFF = rowCellsFF[rowCell];
      var quantity = parseFloat(rowCellsFF[rowCell+1]);

      // Filling Arrays with Values
      // tabOb.push({State: stateOb , Value: value});
      // tabFF.push({State: stateFF , Quantity: quantity});
      tabOb.push([stateOb,value]);
      tabFF.push([stateFF,quantity]);
    }
  }

  tabOb.sort();
  tabFF.sort();
  // console.log(tabOb);
  // console.log(tabFF);
  return [tabOb,tabFF];
}

function scriptchart_correlation(dataOb, dataFF)
{
  var tabs = StringToTab(dataOb, dataFF);
  var tabOb = tabs[0];
  var tabFF = tabs[1];

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

function geochartObesityUS(dataOb)
{

  var tabs = StringToTab(dataOb, "");
  var tabOb = tabs[0];

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
	  colors:['white','#773239'],
    backgroundColor: '#F0F0F0'
	};

	var chart = new google.visualization.GeoChart(
		document.getElementById('geochart'));
		chart.draw(dataTable, options);
}
