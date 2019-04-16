function repopulateMap()
{
  removeMarkers();
  var pointCenter = new google.maps.LatLng(point.getPosition().lat(), point.getPosition().lng());
  PopulateMap($("#dist").slider('getValue'), pointCenter);
}

function sliderEvent()
{
  $("#dist").slider().on('slideStop', function(ev){
    repopulateMap();
    $('#dist').unbind();
    setTimeout(function(){sliderEvent();}, 500);
  });
}
sliderEvent();

$("#latitudePt").on('change', function(ev){
  point.setPosition({
      lat: parseFloat($("#latitudePt").val()),
      lng: point.getPosition().lng()
    });
  repopulateMap();
});

$("#longitudePt").on('change', function(ev){
  point.setPosition({
      lat: point.getPosition().lat(),
      lng: parseFloat($("#longitudePt").val())
    });
  repopulateMap();
});

$("#enseignes").on('change', function () {
  $.post("/carte.html", $("#enseignes").serialize());
  $.ajax({
     url: "/bdd",
     beforeSend: function ( xhr ) {
         xhr.overrideMimeType("text/plain; charset=x-user-defined");
     }
    }).done(function (data, textStatus, jqXHR) {
        console.log(jqXHR.status);
        if(jqXHR.status == 200)
        {
          repopulateMap();
        }
    });
});

$("#etats").on('change', function () {
  //insert code here
});
