

jQuery.fn.customInput = function(){
	$(this).each(function(i){
		
		if($(this).is('[type=checkbox], [type=radio]')) {
			var input = $(this);
			
			// get the associated label using the input's id
			var label = $('label[for=' + input.attr('id') + ']');
			
			//get type, for classname suffix 
			var inputType = (input.is('[type=checkbox]')) ? 'checkbox' : 'radio';
			
			// wrap the input + label in a div 
			$('<div class="custom-'+ inputType +'"></div>').insertBefore(input).append(input, label);
			
			// necessary for browsers that don't support the :hover pseudo class on labels
			label.hover(
				function(){ 
					$(this).addClass('hover'); 
					if(inputType == 'checkbox' && input.is(':checked')){ 
						$(this).addClass('checkedHover'); 
					} 
				},
				function(){ $(this).removeClass('hover checkedHover'); }
			);
			
			//bind custom event, trigger it, bind click,focus,blur events					
			input.bind('updateState', function(){	
				if (input.is(':checked')) {
					if (input.is(':radio')) {
						var allInputs = $('input[name='+input.attr('name')+']');
						allInputs.each(function(){
							$('label[for=' + $(this).attr('id') + ']').removeClass('checked');
						});
					};
					label.addClass('checked');
				}
				else { label.removeClass('checked checkedHover checkedFocus'); }
										
			})
			.trigger('updateState')
			.click(function(){ 
				$(this).trigger('updateState');
			})
			.focus(function(){ 
				label.addClass('focus'); 
				if(inputType == 'checkbox' && input.is(':checked')){ 
					$(this).addClass('checkedFocus'); 
				} 
			})
			.blur(function(){ label.removeClass('focus checkedFocus'); })
			.bind('change',function(){
//				console.log($(this).attr('checked'));
			});
		}
	});
};


$(document).ready(function(){
	
	/* Custom Styling ... */
	
//	$('input').customInput();
//	$('select').customSelect();
	
	
	
    /* Collapsible Carousel */
	
	$('.collapse-icon').live('click',function(){
		var carouselCont = $('#carousel-cont');
		carouselCont.slideToggle(600);
		
//		var carouselList = carouselCont.find('ul.carousel-list');
		
//		if(carouselCont.css('display') == 'none'){
//			carouselCont.slideDown('slow');
//			carouselCont.slideDown(2000, function(){
//				carouselList.show('fade');
//			});
//		} else {
//			carouselCont.slideUp('slow');
//			carouselList.hide('fade', function(){
//				carouselCont.slideUp(2000);
//			});
//		}
		
	});
	
	
	/* Notifications Related ... */
	
	$('#notification-cont .close-icon-white').live('click', function(){
		$('#notification-cont').hide('fade');
	});
	
	
	/* pop-up related */
	
	$('.close-pop-up').live('click', function(){
		$.fancybox.close();
	});
	
	
	/* Fancy boxes */
	
	$('.fancy-box-link').fancybox({
        'opacity'		: true,
		'scrolling'		: 'no',
		'titleShow'		: false,
		'onClosed'		: function() {
		    $(".msg-cont").hide();
		}
	});
	
	
	
	/* Drag Drop related .. */
	
	var droppableOverlay = $('#droppable-overlay');
	
	var pagesList = $('#pages-list');
	var noPagesCont = $('#no-pages-cont');
	
//	 document.ondragenter = function(event) {
//		 noPagesCont.hide();
//		 pagesList.hide();
//		 droppableOverlay.show();
//	 };
	
	document.ondragover = function(event) { 
		noPagesCont.hide();
		pagesList.hide();
		droppableOverlay.show();
	};
	
	document.ondragleave = function(event) {
		noPagesCont.show();
		pagesList.show();
		droppableOverlay.hide();
	};
	
// document.ondrop = function(event) {
// 	   droppableOverlay.hide();
// };
	
	
	
	
	
});




