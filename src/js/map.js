var map;

function initMap()
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.0 , lng: -94.0},
    zoom: 3
  });
  PopulateMap()
}

function PopulateMap()
{
      $(document).ready(function(){
        $.ajax({
          method: "GET",
          url: "/bdd",
          dataType: "JSON",
          success:function(data){
            for (var i in data)
            {
              var long = parseFloat(data[i].Longitude);
              var lat = parseFloat(data[i].Latitude);
              var point_name = data[i].Name;

              // Add geopoint on Google Map API
              var marker = new google.maps.Marker({
                position: {lat: lat , lng: long},
                map: map,
                title: point_name
                });
            }
          }
        });
      });
}


  /* How Google API works
  var marker = new google.maps.Marker({
  position: {lat: 43.918986, lng: 2.138034},
  map: map,
  title: 'Albi'
  });
  marker.setMap(map); */

  /* Imports geopoint from CSV files
  $.ajax({
    url: '../data/burgerking.csv',
    dataType: 'text',
  }).done(successFunctionBK);

  function successFunctionBK(data)
  {
    var allRows = data.split(/\r?\n|\r/);
    for (var singleRow = 0; singleRow < allRows.length; singleRow++)
    {
      var rowCells = allRows[singleRow].split(',');
      for (var rowCell = 0; rowCell < rowCells.length; rowCell=rowCell+2)
      {
        var marker = new google.maps.Marker({
          position: {lat: parseFloat(rowCells[rowCell+1]) , lng: parseFloat(rowCells[rowCell])},
          map: map,
          title: 'BurgerKing'
          });
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
        marker.setMap(map);

        //console.log(parseFloat(rowCells[rowCell]));
        //console.log(rowCells[rowCell+1]);
      }
    }
  } */
