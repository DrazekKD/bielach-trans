//preloader
$(window).on('load', function () {
$(".preloader-logo").addClass('fullSize')
	$("#preloader").fadeOut();
	setTimeout(function() {
		$("#preloader").remove();
	}, 500);
});