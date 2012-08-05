
/* JQuery Extensions */

/*
jQuery.fn.outerHTML = function() {
	return jQuery('<div />').append(this.eq(0).clone()).html();
};
*/

jQuery.fn.extend({
	
	outerHTML : function() {
		return jQuery('<div />').append(this.eq(0).clone()).html();
	},
	
	
	/* Div Slide */
	
	slideRightShow : function() {
		return this.each(function() {
			$(this).show('slide', { direction : 'right' }, 1000);
		});
	},
	
	slideLeftHide : function() {
		return this.each(function() {
			$(this).hide('slide', { direction : 'left' }, 1000);
		});
	},
	
	slideRightHide : function() {
		return this.each(function() {
			$(this).hide('slide', { direction : 'right' }, 1000);
		});
	},
	
	slideLeftShow : function() {
		return this.each(function() {
			$(this).show('slide', { direction : 'left' }, 1000);
		});
	},

	
	/* CheckBox */

	check : function() {
		return $(this).each(function(){
			var element = $(this);
			var type = element.attr('type');
			if(type == 'radio' || type == 'checkbox') {
				this.checked = true;
				$(this).trigger('updateState');
			}
		});
	},
	
	uncheck : function() {
		return $(this).each(function(value){
			var element = $(this);
			var type = element.attr('type');
			if(type == 'radio' || type == 'checkbox') {
				this.checked = false;
				$(this).trigger('updateState');
			}
		});
	}
	
	
});

jQuery.fn.getAbsoluteLeft = function(element) {
	oLeft = element.offsetLeft;            
	while(element.offsetParent!=null) {
		oParent = element.offsetParent;
		oLeft += oParent.offsetLeft;
		element = oParent;
	}
	return oLeft;
};

jQuery.fn.getAbsoluteTop = function (element) {
	oTop = element.offsetTop;            
	while(element.offsetParent!=null) { 
		oParent = element.offsetParent;
		oTop += oParent.offsetTop;
		element = oParent;
	}
	return oTop;
};



jQuery.fn.customTabs = function() {
	return this.each( function () {
		var tabs = $(this).find('.tab');
		
		// Selecting Default tab
		tabs.each( function() {
			var i = $(this).attr('id');
			$('#' + i + '-tab').hide();
		});
		var defau = $(this).find('.tab.sel').attr('id') + '-tab'; 
		$('#' + defau).show();
		
		// tab click function
		tabs.bind('click', function (){
			var currentTab = $(this);
			var id = currentTab.attr('id');
			var tabId = id + '-tab';
			
			// onClick - selecting a tab
			if (!currentTab.hasClass('sel'))
				currentTab.toggleClass('sel');
			
			$('#' + tabId).show();
			
			// onClick - de-selecting all other tabs
			var remainTabs = tabs.not(currentTab);
			remainTabs.each( function() {
				var rTab = $(this);
				var rid = rTab.attr('id');
				var rTabId = rid + '-tab';
				
				if (rTab.hasClass('sel'))
					rTab.toggleClass('sel');
				
				$('#' + rTabId).hide();
			});

		});
	});
};




/* Window Resize .. */

function adjustBodyToWindowDimensions(){
	
	var bodyCont = $('#body-cont');
	
	var width = $(window).width();
	var height = $(window).height();
	
	if ( width > 1300 ) {
		bodyCont.css({ 'margin' : '0 auto' });
	} else {
		bodyCont.css({ 'margin' : '0 50px' });
	}
	
};


/* jcarousel related */

var pagesListCarousel;

function pagesListCarouselInitCallback(carousel){
	pagesListCarousel = carousel;
};

function addPageElementToPageslListCarousel(element){
	if(!pagesListCarousel){
		var carouselPagesList = $('#pages-list');
		carouselPagesList.html(element);
		carouselPagesList.jcarousel({
			initCallback : pagesListCarouselInitCallback,
            reloadCallback : pagesListCarouselInitCallback
		});
	} else {
		pagesListCarousel.addAndAnimate(element);
		pagesListCarousel.scroll(pagesListCarousel.size());
	}
};

function removePageElementFromPageslListCarousel(elementIndex){
	pagesListCarousel.removeAndAnimate(elementIndex);
	pagesListCarousel.scroll(1);
};


function preventEventDefaults(event) {
//	event.stopImmediatePropagation();
	event.stopPropagation();
    event.preventDefault();
    return false;
};



/* Ajax FileUpload Related .. */ 

var filesArray = [];
var filesArrayIndex = 0;

var tempElementPrefix = 'car-page-temp-';

var screenImagesUploader = function(event, element){
	preventEventDefaults(event);
	
	var projectPkey = $('#proj-pkey').val();
	
	// Set the global variables 
	if(event.type == "change") {
		filesArray = element.files || [];	// Multiple file select
	} else {
		filesArray = event.dataTransfer.files || [];	// Drag drop 
	}
	
	filesArrayIndex = 0;
	
	// Prepare Screens upload ..
	var carouselPagesList = $('#pages-list');
	for (var i = 0; i < filesArray.length; i++) {
		
		var tempItemHtml = '';
		tempItemHtml += '<li id="' + tempElementPrefix + i + '" title="uploading screen image">';
		tempItemHtml += '<div class="page-thumb-details-cont">';
		tempItemHtml += '<label>' + filesArray[i].name + '</label>';
		tempItemHtml += '</div>';
		tempItemHtml += '<div class="page-thumb-image-cont">';
		tempItemHtml += '<label class="text"> </label>';
		tempItemHtml += '<label class="percent"> </label>';
		tempItemHtml += '</div>';
		tempItemHtml += '</li>';
		
		// Carousel.. 
		addPageElementToPageslListCarousel(tempItemHtml);
	};
	
	$('#no-pages-cont').hide();
	
	// Setting the locals 
	var imageFileType = "ScreenImage";
	var noOfFiles = filesArray.length;
	
	var currUploadElement = $('#' + tempElementPrefix + filesArrayIndex );
	
	// Call-backs onStart, progress, onError, onAbort, onLoad, onComplete
	var onStart = function(event){ 
		currUploadElement.find('.text').html('Starting');
	};
	
	var progress = function(event){
		var percent = Math.round((event.loaded * 100) / event.total);
		currUploadElement.find('.text').html('Uploading');
		currUploadElement.find('.percent').html(percent + ' %');
	};
	
	var onError = function(event){
		currUploadElement.remove();
		showNotificationMsg( 'error', "upload Failed" );
	};
	
	var onAbort = function(event){
		currUploadElement.remove();
		showNotificationMsg( 'error', "upload Aborted" );
	};
	
	var onLoad = function(event){
		currUploadElement.find('.text').html('Done');
		currUploadElement.find('.percent').html('');
	};
	
	var pagePkeys = new Array();
	
	var onComplete = function(){	// this is oHXR ... 
		if ( this.readyState == 4 ) {
            if ( this.status == 200 ) {
            	
            	var jsonResponse = $.parseJSON(this.responseText);
            	var page = jsonResponse.page;
            	
            	pagePkeys.push(page.pkey);
            	
            	// Load the current page 
            	currUploadElement.html('');
            	currUploadElement.attr('id', 'car-page-' + page.pkey).attr('title', page.title);
            	
            	var pageLiHtml = '<div class="page-thumb-details-cont">';
            	pageLiHtml += '<input type="radio" name="landingPagePkey" value="' + page.pkey + '" id="landing-page-radio-' + page.pkey + '" onclick="updateProjectLandingPage(this);" />';
				pageLiHtml += '<label for="landing-page-radio-' + page.pkey + '" class="landing-page-radio">&nbsp;</label>';
				pageLiHtml += '<a class="page-' + page.pkey + '-title fancy-box-link screen-title auto-ellipses" href="#page-title-change-popup">' + page.title + '</a>';
				pageLiHtml += '</div>';
            	
				pageLiHtml += '<div class="page-thumb-image-cont">';
				pageLiHtml += '<input type="hidden" value="' + page.pkey + '" class="page-pkey">';
				pageLiHtml += '<img src="/stitchemapp/image/view?project.pkey=' +projectPkey  + '&imageFile.pkey=' + page.screenImage.pkey + '" alt="' + page.screenImage.fileObjFileName + '">';
    			pageLiHtml += '<div class="tooltip-content" style="display: none;">';
    			pageLiHtml += '<div class="tt-outer left-top">';
    			pageLiHtml += '<div class="tt-inner page-tt-content">';
				pageLiHtml += '<ul>';
				pageLiHtml += '<li class="float-fix">';
				pageLiHtml += '<label class="key"> W &nbsp;: &nbsp;</label>';
				pageLiHtml += '<label class="">' + page.screenImage.width + ' px </label>';
				pageLiHtml += '</li>';
				pageLiHtml += '<li class="float-fix">';
				pageLiHtml += '<label class="key"> H &nbsp; : &nbsp;</label>';
				pageLiHtml += '<label class="">' + page.screenImage.height + ' px </label>';
				pageLiHtml += '</li>';
				pageLiHtml += '</ul>';
				pageLiHtml += '</div>';
				pageLiHtml += '</div>';
				pageLiHtml += '</div>';
				pageLiHtml += '</div>';
				
            	currUploadElement.html(pageLiHtml);
            	currUploadElement.find('input[type=radio]').customInput();
            	
            	// Upload next file ..
            	filesArrayIndex++;
            	currUploadElement = $('#' + tempElementPrefix + filesArrayIndex );
            	
            	if( noOfFiles > 0 && noOfFiles != filesArrayIndex) {
            		uploadFile(filesArray[filesArrayIndex], projectPkey, onStart, progress, onError, onAbort, onLoad, onComplete, imageFileType); 
            	} else {
            		var pagePkeyToLoad = pagePkeys[0];
            		$('#car-page-' + pagePkeyToLoad + ' .page-thumb-image-cont').check();
            		attachCustomToolTipToCarouselItems();
            	}
            	
            	showNotificationMsg( 'status', page.screenImage.title + " has been successfully uploaded !!!" );
            	
            } else {
            	showNotificationMsg( 'error', this.status );
            }
        }
	};
	
	
	// Uploading ..
	if( noOfFiles > 0 && noOfFiles != filesArrayIndex) {
		uploadFile(filesArray[filesArrayIndex], projectPkey, onStart, progress, onError, onAbort, onLoad, onComplete, imageFileType); 
	} 
	
};

function prepareFileDropUpload(droppableElemId){
	
	var element = document.getElementById( droppableElemId );
	element.ondragenter = function(event) { preventEventDefaults(event); };
	element.ondragover = function(event) { preventEventDefaults(event); };
    element.ondrop = screenImagesUploader;
    
}


/* Regular files / supporting images uploader  */

var selectElementIdByType = [];
selectElementIdByType['ScreenImage'] = '';
selectElementIdByType['Header'] = 'page-header-cont';
selectElementIdByType['Footer'] = 'page-footer-cont';
selectElementIdByType['LeftNavBar'] = 'page-leftnav-cont';
selectElementIdByType['RightNavBar'] = 'page-rightnav-cont';

var regularfileUploader = function(event, element, imageFileType){
	
	// Prevent Browser from opening the dragged file.
	preventEventDefaults(event);
	
	var projectPkey = $('#proj-pkey').val();
	
	// Set the global variables 
	if(event.type == "change") {
		filesArray = element.files || [];	// Multiple file select
	} else {
		filesArray = event.dataTransfer.files || [];	// Drag drop 
	}
	
	filesArrayIndex = 0;
	
	// Setting the locals 
	var noOfFiles = filesArray.length;
	var currfile = filesArray[filesArrayIndex];
	
	// Call-backs onStart, progress, onError, onAbort, onLoad, onComplete
	var onStart = function(event) { 
		showNotificationMsg( 'status', currfile.name );
	};
	
	var progress = function(event) {
		showNotificationMsg( 'status', currfile.name );
	};
	
	var onError = function(event) {
		showNotificationMsg( 'error', currfile.name );
	};
	
	var onAbort = function(event) {
		showNotificationMsg( 'alert', currfile.name );
	};
	
	var onLoad = function(event) {
		showNotificationMsg( 'status', currfile.name );
	};
	
	var imagePkeys = new Array();
	
	var onComplete = function() {	// this is oHXR ... 
		if ( this.readyState == 4 ) {
            if ( this.status == 200 ) {
            	var jsonResponse = $.parseJSON(this.responseText);
            	var imageFile = jsonResponse.imageFile;
            	
            	// Load the current page 
            	showNotificationMsg( 'success', imageFile.fileObjFileName );
            	
            	// Load ImageDetails
            	imagePkeys.push(imageFile.pkey);
            	var imageFileType = imageFile.imageType;
            	
            	var suppImagesCont = $('#' + selectElementIdByType[imageFileType]);
            	var suppImagesList = suppImagesCont.find('.supporting-images-list:first');
            	
        		var suppImageHtml = '<li>';
        		
        		suppImageHtml += '<input type="radio" name="' + imageFileType + '-image-radio" value="' + imageFile.pkey + '" id="supp-img-' + imageFile.pkey + '" >';
        		suppImageHtml += '<label for="supp-img-' + imageFile.pkey + '">' + imageFile.fileObjFileName + '</label>';
        		
        		suppImageHtml += '<form class="delete-support-image-form" method="post">';
        		suppImageHtml += '<input type="hidden" name="project.pkey" value="">';
        		suppImageHtml += '<input type="hidden" name="imageFile.imageType" value="' + imageFile.imageType + '" class="">';
        		suppImageHtml += '<input type="hidden" name="imageFile.pkey" class="support-img-pkey" value="' + imageFile.pkey + '">';
        		suppImageHtml += '<a class="float-right delete-support-image-btn close-icon" href="javascript:void(0);">&nbsp;</a>';
        		suppImageHtml += '</form>';
        		suppImageHtml += '</li>';
    			
        		suppImagesList.append(suppImageHtml);
        		suppImagesList.find('li:last input[type=radio]').customInput();

        		// Upload next file ..
            	filesArrayIndex++;
            	currfile = filesArray[filesArrayIndex];
            	
            	if( noOfFiles > 0 && noOfFiles != filesArrayIndex) {
            		uploadFile(currfile, projectPkey, onStart, progress, onError, onAbort, onLoad, onComplete, imageFileType); 
            	} else {
            		
            		// TODO Check this fix ... :) i mean --- click and check .. do we need both ??
            		$('#supp-img-' + imagePkeys[0]).click().check();
            	}
            	
            } else {
            	showNotificationMsg( 'error', currfile.name );
            }
        }
	};
	
	// Uploading ..
	if( noOfFiles > 0 && noOfFiles != filesArrayIndex) {
		uploadFile(currfile, projectPkey, onStart, progress, onError, onAbort, onLoad, onComplete, imageFileType); 
	} 
	
};



function uploadFile( inFile, projectPkey, onStart, progress, onError, onAbort, onLoad, onComplete, imageFileType) {
	
	if (inFile && inFile.size && projectPkey) {
		
		var uploadUrl = '';
	    var methodType = "POST";
		
	    var formData = new FormData();
	    var oXHR = new XMLHttpRequest();
	    
		if ( imageFileType && imageFileType != '' ) {
			
			uploadUrl = "project/build/upload_image?project.pkey=" + projectPkey ;
			
			formData.append("imageFile.fileObj", inFile);
	        formData.append("imageFile.fileObjFileName", inFile.name);
	        formData.append("imageFile.fileObjContentType", inFile.type);
	        formData.append("imageFileType", imageFileType);
	
		} else {
			
			uploadUrl = "project/build/upload_file?project.pkey=" + projectPkey ;
			// Upload regular FILE
			
		}
		
		oXHR.upload.addEventListener('loadstart', onStart || function(event){} , false);
        oXHR.upload.addEventListener('progress', progress || function(event){} , false);
        oXHR.upload.addEventListener('error', onError || function(event){} , false);
        oXHR.upload.addEventListener('abort', onAbort || function(event){} , false);
        oXHR.upload.addEventListener('load', onLoad || function(event){} , false);
        
        oXHR.open( methodType , uploadUrl );
        oXHR.send(formData);
        
        oXHR.onreadystatechange = onComplete || function() {
            if ( oXHR.readyState == 4 ) {
                if ( oXHR.status == 200 ) {
                	alert('Upload success.');
                } else {
                	alert('Failed to load.');
                }
                
            }
        };
		
	}

};







/* Notifications */

function showNotificationMsg( msgType, msgText ) {
	
	var contClass = 'notification';
	
	switch (msgType) {
		case 'alert':
			
			break;
			
		case 'success':
			
			break;
			
		case 'error':
			
			break;

		case 'status':
			
			break;
			
		default:
			break;
	}
	
	var notifCont = $('#notification-cont');
	notifCont.find('.msg-text').html(msgText);
	
	notifCont.show('fade');
	setTimeout(function() {
		notifCont.hide('fade');
	}, 2500);
	
};











/* Supporting Methods */

function getAbsoluteCoordinates(element){
    
	var r = {
        x: element.offsetLeft,
        y: element.offsetTop
    };
    
    if (element.offsetParent) {
        var tmp = getAbsoluteCoordinates(element.offsetParent);
        r.x += tmp.x;
        r.y += tmp.y;
    }
    
    return r;
    
};



