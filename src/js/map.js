var map;
var point;
var markers=[];
var markerCluster;
var currentMarker;
var lastWindow=null;
var featuresUS;
var featuresCanada;
var featuresFrance;
var fastfoodNumber;

const iconsClusterPATH = 'images/clustermarker/m';

async function initMap()
{
  var coordinateMapCenter = {lat: 41.0 , lng: -94.0};

  // Creating new Google Map
  map = new google.maps.Map(document.getElementById('map'), {
    center: coordinateMapCenter,
    zoom: 3,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    scrollwheel:true
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
            fastfoodNumber=[0,0,0];
            var selectedFastFood = selectPoints();
            for (var i in data)
            {
              var point_name = data[i].Name;

              for (var nom in selectedFastFood)
              {
                if(point_name == selectedFastFood[nom])
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
                    fastfoodNumberFill(point_name);
                  }
                  nom = selectedFastFood.length;
                }
              }
            }
            scriptchart_camembert_ff();
            var icon_cluster = {imagePath: iconsClusterPATH};
            markerCluster = new MarkerClusterer(map, markers, icon_cluster);
            addMapEvents();
          }
        });
      });
}

// Parameters : special : VIP pass to force repopulating map
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

function fastfoodNumberFill(fastfoodName)
{
  switch (fastfoodName)
  {
    case "Macdonald's":
      fastfoodNumber[0]+=1;
      break;
    case "Burger King's":
      fastfoodNumber[1]+=1;
      break;
    case "Tim Horton's":
      fastfoodNumber[2]+=1;
      break;
    default: // Nothing
  }
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
        currentMarker = marker;
        var adress = await getPointAddress(marker);

        var changerType = 'Modifier le type du fast-food';
        var typeChoixMcDo = '<label class="radio-inline"><input type="radio" name="optradio" style="margin-left : 5px;" checked>Mac Donald\'s</label>';
        var typeChoixBK = '<label class="radio-inline"><input type="radio" name="optradio" style="margin-left : 5px;">Burger King</label>';
        var typeChoixTH = '<label class="radio-inline"><input type="radio" name="optradio" style="margin-left : 5px;">Tim Horton\'s</label>';
        var typeChoixPH = '<label class="radio-inline"><input type="radio" name="optradio" style="margin-left : 5px;">Pizza Hut</label>';

        var btnChange = '<input id="changeBtn" class="btn btn-default btn-lg btn3d" value="Modifier"/>';
        var btnDelete = '<input id="deleteBtn" class="btn btn-default btn-lg btn3d" value="Supprimer le point"/>';
        var content =  '<p>' + adress + '</p>' + '<p>' + changerType + '</p>' + '<fieldset>' + typeChoixMcDo  + typeChoixBK + typeChoixTH + typeChoixPH + btnChange + btnDelete + '</fieldset>' ;
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        hideLastInfoWindow(infoWindow);
        google.maps.event.addListener(infoWindow, 'domready', function() {
          $("#changeBtn").on('click', function() {
              modificationPost("change");
          });
          $("#deleteBtn").on('click', function() {
              modificationPost("delete");
          });
        });
        infoWindow.open(map, marker);
    });
}

async function addMapEvents()
{
  map.addListener('dblclick', function(event) {
    addInfoWindowAddButton(event);
  });
}

async function addInfoWindowAddButton(event)
{
    var position = event.latLng;
    var addType = 'Choisir le type du fast-food :';
    var typeChoixMcDoAdd = '<label class="radio-inline"><input type="radio" name="optradio" style="margin-left : 5px;" checked>Mac Donald\'s</label>';
    var typeChoixBKAdd = '<label class="radio-inline"><input type="radio" name="optradio" style="margin-left : 5px;">Burger King</label>';
    var typeChoixTHAdd = '<label class="radio-inline"><input type="radio" name="optradio" style="margin-left : 5px;">Tim Horton\'s</label>';
    var typeChoixPHAdd = '<label class="radio-inline"><input type="radio" name="optradio" style="margin-left : 5px;">Pizza Hut</label>';

    var btnAdd = '<input id="addBtn" class="btn btn-default btn-lg btn3d" value=Ajouter le point"/>';
    var content =  '<p style = "margin-bottom : 15px; margin-top : 15px;">' + addType + '</p>' + '<fieldset>' + typeChoixMcDoAdd  + typeChoixBKAdd + typeChoixTHAdd + typeChoixPHAdd + btnAdd + '</fieldset>';
    var infoWindow = new google.maps.InfoWindow({
        content: content,
    });
    hideLastInfoWindow(infoWindow);
    infoWindow.setPosition(position);
    google.maps.event.addListener(infoWindow, 'domready', function() {
      /* $("#addInput").focusout(function() {
          validateNewPoint(this.value, position);
      }); */
      $("#addBtn").on('click', function() {
          validateNewPoint($("#addInput").val(), position);
      });
    });
    infoWindow.open(map);
}

// Parameters : -name : Marker's Name
//              -position : Marker's Position
async function validateNewPoint(name, position)
{
  //var position = {lat:lat, lng:lng};
  console.log(position);
  console.log(name);
  var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: "name"
  });
  addInfoWindow(marker);
}

// Parameters : type : - delete : delete point from bdd
//                     - change : change point lat/lng from bdd
//                     - add    : add point (lat/lng) to bdd
function modificationPost(type)
{
  console.log(currentMarker);
  $.post("/engine.html", {'lat': currentMarker.getPosition().lat(), 'lng': currentMarker.getPosition().lng()});
  $.ajax({
     url: "/bdd",
     beforeSend: function ( xhr ) {
         xhr.overrideMimeType("text/plain; charset=x-user-defined");
     }
    }).done(function (data, textStatus, jqXHR) {
        console.log(jqXHR.status);
        if(jqXHR.status == 200)
        {
          repopulateMap(true);
        }
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

function pickHex(color1, color2, weight)
{
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = 'rgb(' + Math.round(color1[0] * w1 + color2[0] * w2) + ',' +
      Math.round(color1[1] * w1 + color2[1] * w2) + ',' +
      Math.round(color1[2] * w1 + color2[2] * w2) + ')';
    return rgb;
}

// Parameters : - switchOnOff : On/Off
async function changeLabelsVisibility(switchOnOff)
{
  var customStyled = [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: switchOnOff }]
    }];
  map.set('styles',customStyled);
}

async function colorObesity()
{
    await filledTabOb();
    await filledTabObCA();
    var tabAux = $.merge(tabOb,tabObCA);
    var tab = [];
    var max = 0;
    var etat, tauxOb;
    for(var i = 1; i < tabAux.length; i++)
    {
      var etat = tabAux[i][0];
      var tauxOb = tabAux[i][1];
      if(tauxOb > max){max = tauxOb}
      tab[i]=[etat,tauxOb];
    }

    map.data.setStyle(function(feature) {
      var colorMax = [255,255,255];
      var colorMin = [119,50,57];
      for(var i = 1; i < tab.length; i++)
      {
        if(feature.l.NAME == tab[i][0])
        {
          feature.m = tab[i][1];
          var color = pickHex(colorMin, colorMax, tab[i][1]/max);
          break;
        }
      }
      return {
        fillColor: color,
        strokeWeight: 0,
        fillOpacity: 1
      }
    });

    map.data.addListener('mouseover', function(event) {
        var content = event.feature.l.NAME + '<br />' + event.feature.m ;
        var infoWindow = new google.maps.InfoWindow({
            content: content,
            closeBoxURL: ''
        });
        hideLastInfoWindow(infoWindow);
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
    });
    map.data.addListener('mouseout', function(event) {
        if(lastWindow != null)
          lastWindow.close();
    });
}

async function geojson()
{
  changeLabelsVisibility("off");
  // Get US States borders
  $.getJSON('geojson/geojson_us.js', async function (data) {
      featuresUS = map.data.addGeoJson(data);
      // Get Canada Provinces borders
      $.getJSON('geojson/geojson_canada.js', async function (data) {
          featuresCanada = map.data.addGeoJson(data);
          colorObesity();
      });
  });

  // Get France Regions borders
  /* $.getJSON('geojson/geojson_france.js', function (data) {
      featuresFrance = map.data.addGeoJson(data);
  }); */
}

async function deletegeojson()
{
  changeLabelsVisibility("on");

  for (var i = 0; i < featuresUS.length; i++)
  {
     map.data.remove(featuresUS[i]);
  }
  for (var i = 0; i < featuresCanada.length; i++)
  {
     map.data.remove(featuresCanada[i]);
  }
  /* for (var i = 0; i < featuresFrance.length; i++)
  {
     map.data.remove(featuresFrance[i]);
  } */
}


async function obesityIcon()
{
  await filledTabOb();
  await filledTabObCA();
  var tabAux = $.merge(tabOb,tabObCA);
  var max = 0;
  for(var i = 1; i < tabAux.length; i++)
  {
    var etat = tabAux[i][0];
    var tauxOb = tabAux[i][1];
    if(tauxOb > max){max = tauxOb}
  }
  for(var i = 1; i < tabAux.length; i++)
  {
    var etat = tabAux[i][0];
    var tauxOb = tabAux[i][1];
    switch (true)
    {
      case tauxOb/max<0.25:
        var img = 'images/obesity/1.svg';
        break;
      case tauxOb/max<0.5:
        var img = 'images/obesity/2.svg';
        break;
      case tauxOb/max<0.75:
        var img = 'images/obesity/3.png';
        break;
      case (tauxOb/max>0.75):
        var img = 'images/obesity/4.png';
        break;
      default: var img = 'images/obesity/1.svg';
    }
    var obIcon = new google.maps.Marker({
      position: states_US_CA_Center(etat),
      map: map,
      icon: {url: img, scaledSize: new google.maps.Size(35, 35)}
    });
  }
}

function deleteObesityIcon()
{


}

function states_US_CA_Center(stateName)
{
  switch (stateName)
 {
    case "Alabama":
      return { lat: 32.918070, lng: -86.646127};
      break;
    case "Alaska":
      return { lat: 65.112922, lng: -150.324408};
      break;
    case "Arizona":
      return { lat: 34.476262, lng: -111.771030};
      break;
	  case "Arkansas":
      return { lat: 34.737473, lng: -92.289493};
      break;
    case "California":
      return { lat: 37.011602, lng: -122.033029};
      break;
    case "Colorado":
      return { lat: 39.011167, lng: -105.502360};
      break;
    case "Connecticut":
      return { lat: 41.656065, lng: -72.676222};
      break;
    case "Delaware":
      return { lat: 39.057681, lng: -75.461440};
      break;
    case "Florida":
      return { lat: 27.382699, lng: -81.225808};
      break;
    case "Georgia":
      return { lat: 32.772021, lng: -83.428757};
      break;
	  case "Hawaii":
      return { lat: 19.634431, lng: -155.466854};
      break;
    case "Idaho":
      return { lat: 44.013795, lng: -114.175616};
      break;
    case "Illinois":
      return { lat: 39.979329, lng: -89.193103};
      break;
	  case "Indiana":
      return { lat: 40.113781, lng: -86.132259};
      break;
    case "Iowa":
      return { lat: 42.259440, lng: -93.483378};
      break;
    case "Kansas":
      return { lat: 38.523034, lng: -98.531854};
      break;
    case "Kentucky":
      return { lat: 37.538883, lng: -84.630291};
      break;
    case "Louisiana":
      return { lat: 30.131635, lng: -91.679422};
      break;
    case "Maine":
      return { lat: 45.455247, lng: -69.170692};
      break;
    case "Maryland":
      return { lat: 39.141734, lng: -76.578524};
      break;
	  case "Massachusetts":
      return { lat: 42.353216, lng: -71.787577};
      break;
    case "Michigan":
      return { lat: 43.496005, lng: -84.808756};
      break;
    case "Minnesota":
      return { lat: 46.626756, lng: -94.500695};
      break;
	  case "Mississippi":
      return { lat: 32.999179, lng: -89.609675};
      break;
    case "Missouri":
      return { lat: 38.465778, lng: -92.265057};
      break;
    case "Montana":
      return { lat: 47.347484, lng: -109.147066};
      break;
    case "Nebraska":
      return { lat: 41.797902, lng: -99.229973};
      break;
    case "Nevada":
      return { lat: 39.395257, lng: -116.297094};
      break;
    case "New Hampshire":
      return { lat: 43.843031, lng: -71.459183};
      break;
    case "New Jersey":
      return { lat: 40.093024, lng: -74.484102};
      break;
    case "New Mexico":
      return { lat: 34.598225, lng: -105.976047};
      break;
    case "New York":
      return { lat: 42.966824, lng: -75.350477};
      break;
    case "North Carolina":
      return { lat: 35.568613, lng: -78.722187};
      break;
	  case "North Dakota":
      return { lat: 47.646559, lng: -100.276191};
      break;
    case "Ohio":
      return { lat: 40.433523, lng: -82.809026};
      break;
    case "Oklahoma":
      return { lat: 35.411475, lng: -97.425372};
      break;
    case "Oregon":
      return { lat: 44.199496, lng: -120.653839};
      break;
    case "Pennsylvania":
      return { lat: 40.778155, lng: -76.808227};
      break;
    case "Rhode Island":
      return { lat: 41.698755, lng: -71.554491};
      break;
    case "South Carolina":
      return { lat: 33.777176, lng: -80.605126};
      break;
    case "South Dakota":
      return { lat: 44.411407, lng: -100.008213};
      break;
    case "Tennessee":
      return { lat: 35.833910, lng: -86.698903};
      break;
    case "Texas":
      return { lat: 31.382438, lng: -99.121815};
      break;
	  case "Utah":
      return { lat: 39.009235, lng: -111.618798};
      break;
    case "Vermont":
      return { lat: 44.112541, lng: -72.700687};
      break;
    case "Virginia":
      return { lat: 37.602369, lng: -78.234315};
      break;
    case "Washington":
      return { lat: 47.358997, lng: -120.655964};
      break;
    case "West Virginia":
      return { lat: 38.631448, lng: -80.766464};
      break;
    case "Wisconsin":
      return { lat: 44.831344, lng: -89.878690};
      break;
    case "Wyoming":
      return { lat: 42.952507, lng: -107.352920};
      break;
    case "Yukon":
      return { lat: 62.818674, lng: -135.211569};
      break;
    case "Northwest Territories":
      return { lat: 64.180059, lng: -117.297435};
      break;
    case "Nunavut":
      return { lat: 67.214058, lng: -92.273997};
      break;
    case "British Colombia":
      return { lat: 54.115639, lng: -125.137637};
      break;
    case "Alberta":
      return { lat: 55.534317, lng: -114.926001};
      break;
    case "Saskatchewan":
      return { lat: 52.968651, lng: -105.884560};
      break;
	  case "Manitoba":
      return { lat: 54.718835, lng: -97.930360};
      break;
    case "Ontario":
      return { lat: 50.600876, lng: -86.016107};
      break;
    case "Quebec":
      return { lat: 52.575181, lng: -72.187086};
      break;
    case "Newfoundland and Labrador":
      return { lat: 48.704419, lng: -56.407270};
      break;
    case "Prince Edward Island":
      return { lat: 46.302411, lng: -63.356687};
      break;
    case "Nova Scotia":
      return { lat: 45.045318, lng: -63.354481};
      break;
    case "New Brunswick":
      return { lat: 47.131270, lng: -66.324556};
      break;
	  default: // Nothing
  }
}
