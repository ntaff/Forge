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
  PopulateMap(500, new google.maps.LatLng(41, -94));

  point = new google.maps.Marker({
    position: coordinateMapCenter,
    map: map,
    title: 'Move me~♥',
    zIndex:99999,
    draggable: true,
    icon: {url:'images/pin2.svg', scaledSize: new google.maps.Size(50, 50)}
  });

  new google.maps.event.addListener(point, 'dragend', function() {
    removeMarkers();
    getPointAddress(point);
    $("#latitudePt").val(point.getPosition().lat());
    $("#longitudePt").val(point.getPosition().lng());
    var pointCenter = new google.maps.LatLng(point.getPosition().lat(), point.getPosition().lng());
    PopulateMap($("#dist").slider('getValue'), pointCenter);
  });

  // Show in console State's Point
  getPointAddress(point);
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
              var position =  {lat: lat , lng: long};
              // Add geopoint on Google Map API
              var marker = new google.maps.Marker({
                position: position,
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

function reverseGeocoding(latlng)
{
  return new Promise(resolve => {
      setTimeout(() => {
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK)
          {
            if (results[0])
            {
              console.log(results[0].formatted_address);
              var adresses = results[0].formatted_address.split(',');
              var state = adresses[(adresses.length-2)%adresses.length].split(' ');
              resolve(state[(state.length-2)%state.length]);
            } else {
              resolve("Nooope ~♥");
            }
          } else {
            resolve("Nooope ~♥");
          }
        });
      }, 0);
  });
}

async function getPointAddress(marker)
{
  var lat = marker.getPosition().lat();
  var lng = marker.getPosition().lng();
  var latlng = {lat: lat, lng: lng};
  var state = await reverseGeocoding(latlng);
  console.log(state);
  return state;
}

function removeMarkers()
{
  markerCluster.clearMarkers();
}
