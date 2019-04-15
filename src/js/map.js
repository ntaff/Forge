var map;
var point;
var markers=[];
var markerCluster;

function initMap()
{
  var coordinateMapCenter = {lat: 41.0 , lng: -94.0};

  // Creating new Google Map
  map = new google.maps.Map(document.getElementById('map'), {
    center: coordinateMapCenter,
    zoom: 3
  });

  // Populate the Google Map API with Points
  PopulateMap(14000, new google.maps.LatLng(41, -94));

  point = new google.maps.Marker({
    position: coordinateMapCenter,
    map: map,
    title: 'Move me~♥',
    zIndex:99999,
    draggable: true,
    icon: {url:'images/icon_heart.png', scaledSize: new google.maps.Size(90, 90)}
  });

  new google.maps.event.addListener(point, 'dragend', function() {
    removeMarkers();
    var pointCenter = new google.maps.LatLng(point.getPosition().lat(), point.getPosition().lng());
    PopulateMap($("#dist").slider('getValue'), pointCenter);
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
            markers=[];
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
            markerCluster = new MarkerClusterer(map, markers, icon_cluster);
          }
        });
      });
}

function removeMarkers()
{
  markerCluster.clearMarkers();
}
