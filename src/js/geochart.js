/* 
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="https://www.gstatic.com/charts/loader.js"></script>
<script src="https://www.google.com/jsapi"></script>
*/

// Geochart United States's states Obesity
	google.charts.load({'packages':['geochart']});
	google.charts.setOnLoadCallback(coucou);
	
	
	function coucou() {
	
	var tab = new google.visualization.DataTable();
	tab.addColumn('string', 'State');
	tab.addColumn('number', 'Obesity');
	var state;
	var obesity;
	
	 $.ajax({
        url: '../data/obesiteusa.csv',
        dataType: 'text',
      }).done(successFunctionObesity);
      
      function successFunctionObesity(data) {
		var allRows = data.split(/\r?\n|\r/);
		for (var singleRow = 1; singleRow < allRows.length - 1; singleRow++) 
        {    
          var rowCells = allRows[singleRow].split(',');
          for (var rowCell = 0; rowCell < rowCells.length; rowCell=rowCell+2) 
          {
			state = rowCells[rowCell];
			obesity = parseFloat(rowCells[rowCell+1]);
			tab.addRow([state,obesity]);
          }
        }

		drawRegionsMap(tab);        
      }
	
	function drawRegionsMap(data) {
	  		
		var options = {
		  region: 'US',
		  displayMode: 'regions',
		  resolution: 'provinces',
		  minValue: 0,
		  maxValue: 100,
		  colors:['white','#773239']
		};
		
		var chart = new google.visualization.GeoChart(
			document.getElementById('geochart'));
			chart.draw(data, options);
	}
	}
