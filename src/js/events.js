
$("#dist").slider().on('slideStop', function(ev){
  removeMarkers();
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
            removeMarkers();
            var pointCenter = new google.maps.LatLng(point.getPosition().lat(), point.getPosition().lng());
            PopulateMap($("#dist").slider('getValue'), pointCenter);

          }
      });
  })
});
