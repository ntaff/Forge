/* 
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script type="text/javascript" src="https://www.google.com/jsapi"></script> 
*/

// Geochart United States's states Obesity
	google.charts.load({'packages':['geochart']});
	google.charts.setOnLoadCallback(drawRegionsMap);
	function drawRegionsMap() {
	  
		var data = google.visualization.arrayToDataTable([
		['State', 'Obesity'],
		  ['US-AL',0],
			['US-AK',0],
			['US-AZ',0],
			['US-AR',0],
			['US-CA',0],
			['US-CO',0],
			['US-CT',0],
			['US-DE',0],
			['US-DC',0],
			['US-FL',100],
			['US-GA',0],
			['US-HI',0],
			['US-ID',0],
			['US-IL',0],
			['US-IN',0],
			['US-IA',0],
			['US-KS',0],
			['US-KY',0],
			['US-LA',0],
			['US-ME',0],
			['US-MT',0],
			['US-NE',0],
			['US-NV',0],
			['US-NH',0],
			['US-NJ',0],
			['US-NM',0],
			['US-NY',0],
			['US-NC',0],
			['US-ND',0],
			['US-OH',0],
			['US-OK',0],
			['US-OR',0],
			['US-MD',0],
			['US-MA',0],
			['US-MI',0],
			['US-MN',0],
			['US-MS',0],
			['US-MO',0],
			['US-PA',0],
			['US-RI',0],
			['US-SC',0],
			['US-SD',0],
			['US-TN',0],
			['US-TX',0],
			['US-UT',0],
			['US-VT',0],
			['US-VA',0],
			['US-WA',0],
			['US-WV',0],
			['US-WI',0],
			['US-WY',0]
		]);
		
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
