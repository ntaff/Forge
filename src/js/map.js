var map;
var point;
var markers=[];
var markerCluster;
var lastWindow=null;

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

  google.maps.event.addListener(point, 'dragend', async function() {
      var boolDisplayAll = $("#afficherall").is(":checked");
      if(!boolDisplayAll)
      {
        removeMarkers();
        var lat = point.getPosition().lat();
        var lng = point.getPosition().lng();
        $("#latitudePt").val(lat);
        $("#longitudePt").val(lng);
        var pointCenter = new google.maps.LatLng(lat, lng);
        PopulateMap($("#dist").slider('getValue'), pointCenter, false);
      }
      setAdressPoint();
  });

  // Set Adress Point
  setAdressPoint();
}

// Parameter : radius : radius around the point in km
async function PopulateMap(radius, pointCenter, boolDisplayAll)
{
      $(document).ready(function(){
        $.ajax({
          method: "GET",
          url: "/bdd",
          dataType: "JSON",
          success:function(data)
          {
            markers=[];
            // Popup settings
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

              if(((google.maps.geometry.spherical.computeDistanceBetween(pointCenter,a2)/1000) < radius) || boolDisplayAll == true)
              {
                addInfoWindow(marker);
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
              resolve(results[0].formatted_address);
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
  //console.log(state);
  return state;
}

async function addInfoWindow(marker)
{
    google.maps.event.addListener(marker, 'click', async function () {
        var content = await getPointAddress(marker);
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        hideLastInfoWindow(infoWindow);
        infoWindow.open(map, marker);
    });
}

function hideLastInfoWindow(infowindow)
{
  if(lastWindow != null)
  {
    lastWindow.close();
  }
  lastWindow=infowindow;
}

async function setAdressPoint()
{
  $("#adressPoint").val(await getPointAddress(point));
}

function removeMarkers()
{
  markerCluster.clearMarkers();
}
