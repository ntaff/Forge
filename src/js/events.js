function sliderEvent()
{
  $("#dist").slider().on('slideStop', function(ev){
    repopulateMap(false);
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
  repopulateMap(false);
  setAdressPoint();
});

$("#longitudePt").on('change', function(ev){
  point.setPosition({
      lat: point.getPosition().lat(),
      lng: parseFloat($("#longitudePt").val())
    });
  repopulateMap(false);
  setAdressPoint();
});

$("#enseignes").on('change', function () {
  repopulateMap(true);
});

$("#afficherObCol").on('click', function () {
  if($("#afficherObCol").is(":checked"))
  {
    geojson();
  }
  else
  {
    deletegeojson();
  }
});

$("#afficherObIco").on('click', function () {
  if($("#afficherObIco").is(":checked"))
  {
    obesityIcon();
  }
  else
  {
    deleteObesityIcon();
  }
});

$("#afficherall").on('click', function () {
  repopulateMap(true);
});

$("#etats").on('change', function () {
  //insert code here
});


/* POST METHOD
$.post("/engine.html", $("#enseignes").serialize());
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
  */
