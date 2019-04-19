var map;
var point;
var markers=[];
var markerCluster;
var lastWindow=null;
var featuresUS;
var featuresCanada;

const iconsClusterPATH = 'images/clustermarker/m';

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
      repopulateMap(false);
      var lat = point.getPosition().lat();
      var lng = point.getPosition().lng();
      $("#latitudePt").val(lat);
      $("#longitudePt").val(lng);
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
            var selectedFastFood = selectPoints();
            for (var i in data)
            {
              var point_name = data[i].Name;

              for (var nom in selectedFastFood)
              {
                if(boolDisplayAll || point_name == selectedFastFood[nom])
                {
                  var long = parseFloat(data[i].Longitude);
                  var lat = parseFloat(data[i].Latitude);
                  var a2 = new google.maps.LatLng(lat,long);

                  if(boolDisplayAll || ((google.maps.geometry.spherical.computeDistanceBetween(pointCenter,a2)/1000) < radius))
                  {
                    var position =  {lat: lat , lng: long};
                    // Add geopoint on Google Map API
                    var marker = new google.maps.Marker({
                      position: position,
                      title: point_name
                      });

                    addInfoWindow(marker);
                    markers.push(marker);
                  }
                  nom = selectedFastFood.length;
                  break;
                }
              }
            }
            var icon_cluster = {imagePath: iconsClusterPATH};
            markerCluster = new MarkerClusterer(map, markers, icon_cluster);
          }
        });
      });
}

function repopulateMap(special)
{
  var boolDisplayAll = getBoolDisplayAll();
  if(!boolDisplayAll || special)
  {
    removeMarkers();
    var lat = point.getPosition().lat();
    var lng = point.getPosition().lng();
    var pointCenter = new google.maps.LatLng(lat, lng);
    PopulateMap($("#dist").slider('getValue'), pointCenter, boolDisplayAll);
  }
}

function selectPoints()
{
  var vals = [];
  $('#enseignes :selected').each(function() {
    vals.push($(this).val())
  });
  return vals;
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

function getBoolDisplayAll()
{
  return $("#afficherall").is(":checked");
}

async function setAdressPoint()
{
  $("#adressPoint").val(await getPointAddress(point));
}

function removeMarkers()
{
  markerCluster.clearMarkers();
}

async function geojson()
{
  // Get US States borders
  $.getJSON('geojson/geojson_us.js', function (data) {
    featuresUS = map.data.addGeoJson(data);
  });
  // Get Canada Provinces borders
  $.getJSON('geojson/geojson_canada.js', function (data) {
    featuresCanada = map.data.addGeoJson(data);
  });
}

async function deletegeojson()
{
  for (var i = 0; i < featuresUS.length; i++)
  {
     map.data.remove(featuresUS[i]);
  }
  for (var i = 0; i < featuresCanada.length; i++)
  {
     map.data.remove(featuresCanada[i]);
  }
}
