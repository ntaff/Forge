var map;
var point;

function initMap()
{
  // Creating new Google Map
  newMap(41.0,-94.0,41.0,-94.0,3);
  // Populate the Google Map API with Points
  PopulateMap(14000, new google.maps.LatLng(41, -94));
}

function newMap(latMapCenter,lngMapCenter,latPoint,lngPoint,zoom)
{
  var coordinateMapCenter = {lat: latMapCenter , lng: lngMapCenter};
  var coordinatePointPosition = {lat: latPoint , lng: lngPoint};
  map = new google.maps.Map(document.getElementById('map'), {
    center: coordinateMapCenter,
    zoom: zoom
  });
  point = new google.maps.Marker({
    position: coordinatePointPosition,
    map: map,
    title: 'Move me~♥',
    zIndex:99999,
    draggable: true,
    icon: {url:'images/icon_heart.png', scaledSize: new google.maps.Size(90, 90)}
    //icon: {scaledSize: new google.maps.Size(70, 70)}
  });
}

// Parameter : radius : radius around the point in km
async function PopulateMap(radius, pointCenter)
{
      $(document).ready(function(){
        $.ajax({
          method: "GET",
          url: "/bdd",
          dataType: "JSON",
          success:function(data)
          {
            var markers=[];
            for (var i in data)
            {
              var long = parseFloat(data[i].Longitude);
              var lat = parseFloat(data[i].Latitude);
              var point_name = data[i].Name;

              // Add geopoint on Google Map API
              var marker = new google.maps.Marker({
                position: {lat: lat , lng: long},
                title: point_name
                });

              var a2 = new google.maps.LatLng(lat,long);

              if((google.maps.geometry.spherical.computeDistanceBetween(pointCenter,a2)/1000) < radius)
              {
                markers.push(marker);
              }
            }
            var icon_cluster = {imagePath: 'images/clustermarker/m'};
            var markerCluster = new MarkerClusterer(map, markers, icon_cluster);
          }
        });
      });
}
