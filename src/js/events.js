
$("#dist").slider().on('slideStop', function(ev){
  newMap(map.getCenter().lat(),map.getCenter().lng(),point.getPosition().lat(), point.getPosition().lng(), map.getZoom());
  var pointCenter = new google.maps.LatLng(point.getPosition().lat(), point.getPosition().lng());
  PopulateMap($("#dist").slider('getValue'), pointCenter);
});

$(document).ready(function () {
  $("#update_map").on('click', function () {
    $.ajax({
       url: "/bdd",
       beforeSend: function ( xhr ) {
           xhr.overrideMimeType("text/plain; charset=x-user-defined");
       }
      }).done(function (data, textStatus, jqXHR) {
          console.log(jqXHR.status);
          if(jqXHR.status == 200)
          {
            newMap(map.getCenter().lat(),map.getCenter().lng(),point.getPosition().lat(), point.getPosition().lng(), map.getZoom());
            var pointCenter = new google.maps.LatLng(point.getPosition().lat(), point.getPosition().lng());
            PopulateMap($("#dist").slider('getValue'), pointCenter);
            //removeMarkers();
          }
      });
  })
});
