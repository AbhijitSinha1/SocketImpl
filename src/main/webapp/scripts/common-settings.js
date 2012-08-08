
$(document).ready(function(){
	
	/* Notifications Related ... */
	
	$('#notification-cont .close-icon-white').live('click', function(){
		$('#notification-cont').hide('fade');
	});
	
	
	/* pop-up related */
	
	$('.close-pop-up').live('click', function(){
		$.fancybox.close();
	});
	
});




