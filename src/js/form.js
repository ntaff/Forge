    $(document).ready(function() {

        $('#enseignes').multiselect();

    });

     $(document).ready(function() {

        $('#etats').multiselect();

    });

$("#dist").slider();
$("#dist").on("slide", function(slideEvt) {
	$("#distVal").text(slideEvt.value);
});

$("#dist2").slider();
$("#dist2").on("slide", function(slideEvt) {
	$("#distVal2").text(slideEvt.value);
});
