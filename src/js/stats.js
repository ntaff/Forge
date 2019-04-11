$(document).ready(function(){
 			$("ul.osx-dock li").each(function (type) {
		     	$(this).hover(function () {
		      		$(this).prev("li").addClass("nearby");
		      		$(this).next("li").addClass("nearby");
		     	},
		     	function () {
		      		$(this).prev("li").removeClass("nearby");
		      		$(this).next("li").removeClass("nearby");
		     	});
		    });
		});
