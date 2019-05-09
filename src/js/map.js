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
            console.log(fastfoodNumber);            
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
      etat = tabAux[i][0];
      tauxOb = tabAux[i][1];
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
  for (var i = 0; i < featuresFrance.length; i++)
  {
     map.data.remove(featuresFrance[i]);
  }
}
