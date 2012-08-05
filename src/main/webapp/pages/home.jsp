
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>

<!DOCTYPE HTML>
<html>

<head>

	<title>Home</title>

	<script type="text/javascript">
		
		
		var isProjectsPageLoded = true;
		
		var currentPageNumber = 1;
	
		$(document).ready(function() {
			
			/* Tags */
			
			var tagsURL = '<%= request.getContextPath() %>/project/fetch_tags';
			$.getJSON( tagsURL, function(data){
				var tagsList = data.tagTitles;
// 				console.log(tagsList);
				
				var tags = data.tags;
				if(!tags || tags.length == 0)
					return;
				
				var tagsArray = [];
				for(var i in tags){
					var tag = tags[i];
					tagsArray.push(tag.title);
				}
				
				$( "#tags-autocomplete" ).autocomplete({
					source: tagsArray
				});
				
			});
			
			/* Form Submission */
			$('#new-pattern-submit-btn').live('click', function(){
				var newPatternForm = $('#new-pattern-form');
				newPatternForm.validateForm({
					breakOnError : false,
					failureFunction : function(element){
						$(element).addClass('error');
					},
					successFunction : function(element){
						$(element).removeClass('error');
					},
					onValidForm : function(form){
						$(form).trigger('submit');
					}
				});
				
			});
			
			/* Projects Lazyload */
			$(window).scroll(function(){
				var scrollThreshold = $(document).height() - ( $(window).height() + 500 );
				if ( ( $(window).scrollTop() > scrollThreshold ) && isProjectsPageLoded ){
					isProjectsPageLoded = false;
// 					fetchProjectsByPage(currentPageNumber + 1);
				}
			});
			
			
			
			/* Window resize related ... */
			
			adjustToWindowDimentions(); 
			$(window).resize(function() {
				adjustToWindowDimentions(); 
			});
			
		});
		
		
		var currLiHorMargin;
		
		/* Window resize */
		function adjustToWindowDimentions(){
			
			// body .. 
			adjustBodyToWindowDimensions();
			
			// rest .. 
			var intList = $('#interactions-list');
			
			var maxListWidth = parseInt(intList.width());
			var liWidth = parseInt(intList.find('li:first').outerWidth(true));
			
			var rowLength = Math.floor( maxListWidth / liWidth );
			var availableMargin = maxListWidth - (liWidth * rowLength);
			
			var marginOnEachSide = Math.floor( availableMargin / (rowLength * 2));
			
			intList.find('li.interaction').css({
				'margin-left' : marginOnEachSide + 'px',
				'margin-right' : marginOnEachSide + 'px'
			});
			
			currLiHorMargin = marginOnEachSide;
			
			
		};
		
		
		/* Projects Lazyload */
		
		function fetchProjectsByPage(pageNumber) {
			
			var fetchProjectsURL = '<%= request.getContextPath() %>/project/fetch_projects?pageNumber=' + pageNumber ;
			$.getJSON(fetchProjectsURL, function(data) { 
				if(data && data.projects) {
					
					var projListHtml = '';
					
					for ( var i = 0; i < data.projects.length; i++) {
						var project = data.projects[i];
						
						projListHtml += '<li class="interaction" style="margin-left : ' + currLiHorMargin + 'px; margin-right : ' + currLiHorMargin + 'px; ">';
						projListHtml += '<a href="javascript:void(0);" onclick="loadProjectPreview(' + project.pkey + ')" class="thumb">';
						
						if(project.layout.landingPage) {
							projListHtml += '<img class="" alt="' + project.layout.landingPage.screenImage.fileObjFileName + '" src="<%= request.getContextPath() %>/image/view?project.pkey=' + project.pkey + '&imageFile.pkey=' + project.layout.landingPage.screenImage.pkey + '">';
						} else {
							projListHtml += '<img class="" alt="" src="">';
						}
							
						projListHtml += '</a>';
					
						projListHtml += '<div>';
						projListHtml += '<h2 class="auto-ellipses">' + project.title + '</h2>';
						projListHtml += '<label class="proj-desc" style="display: none;">' + project.description + '</label>';
						projListHtml += '</div>';
		  			
						projListHtml += '<input type="hidden" class="project-pkey" value="' + project.pkey + '">';
						projListHtml += '</li>';
						
					}
					
					$('#interactions-list').append(projListHtml);
					
					// Global Variables .. 
					if(data.projects.length > 0 ) {
						isProjectsPageLoded = true;
						currentPageNumber = currentPageNumber + 1;
					}

				}
				
			});
			
		};
		
	</script>



</head>

<body>

	<!-- Body Content -->
	
	<div id="top-cont" class="" style="border-top: none;">
	
		<div id="carousel-cont" class="yellow-bg float-fix">
			
			<div class="float-fix" style="margin: 20px auto; width: 960px; padding: 15px 0;">
				<label class="normal" style="width: 600px; padding: 15px; font-size: 28px; line-height: 32px;">Create and share mobile mockups like never before.</label>
				
				<auth:authorize ifAnyGranted="ROLE_ANONYMOUS">
					<a href="<%= request.getContextPath() %>/signup" class="float-right btn margin-5px"> signup now </a>
				</auth:authorize>
			</div>
			
			<ul id="home-carousel" class="inline-list">
				<li>
					<img alt="" src="<%= request.getContextPath() %>/themes/images/step-1.png" class="">
					<label class="clear">Upload your mockups</label>
				</li>
				<li>
					<img class="" src="<%= request.getContextPath() %>/themes/images/step-arrow.png" alt="" style="margin: 36px 0;">
				</li>
				<li>
					<img alt="" src="<%= request.getContextPath() %>/themes/images/step-2.png" class="">
					<label class="clear">Stitch them up using hotspots</label>
				</li>
				<li>
					<img class="" src="<%= request.getContextPath() %>/themes/images/step-arrow.png" alt="" style="margin: 36px 0;">
				</li>
				<li>
					<img alt="" src="<%= request.getContextPath() %>/themes/images/step-3.png" class="">
					<label class="clear">Watch it come alive in your device</label> 
				</li>
			</ul>
			
		</div>
			
		<div id="search-cont">
			<div id="search-header" class="float-fix">
				<div class="float-left">
				    <input type="text" id="main-search-box" placeholder="Search pattern"> 
				</div>
				<div class="float-right">
					<ul class="inline-list">
						<li>
							<span class="patterns-count"> <s:property value="projectsCount" /> </span>
							<span> Patterns </span>
						</li>
						<li>
							<span class="patterns-count"> <s:property value="publicProjectsCount" /> </span>
							<span> Public Patterns </span>
						</li>
						<!-- 
						<li>
							<a class="take-a-tour-icon" href="#"> Take a Tour </a>
						</li>
						 -->
						<li>
							<a class="collapse-icon" href="#" style="padding: 4px 12px; margin-top: 8px; float: left;"> </a>
						</li>
					</ul>
				</div>
			</div>
			
			<div id="search-results-cont" style="display: none;">
			
				<ul id="search_suggestion">
					<li class=""> <a href="#">High Voltage</a></li>
					<li class=""> <a href="#">Volcano</a></li>
				</ul>
	
				<ul id="tags_suggestion">
					<li class=""><a href="#">revolt</a></li>
					<li class=""><a href="#"> revolver</a></li>
					<li class=""><a href="#">volt</a></li>
					<li class=""><a href="#">Volume</a></li>
					<li class=""><a href="#">Volume Control</a></li>
				</ul>
	
			</div>
		
		</div>
		
		
	</div>
		
	<div id="main-cont">
	
		<a href="#project-preview-popup" id="preview-btn" style="display: none;"> preview </a>
			
		<ul id="interactions-list" class="inline-list">
		
			<li id="get-started-box" class="interaction">
				<div>
					<label class="title"> Stitch a New Pattern </label>
					<p> Pattern should represent a complete navigation sequence from a Mobile Project, explained in maximum of 10 slides. </p>
					
					<form action="<%= request.getContextPath() %>/project/save" id="new-pattern-form" method="post">
						
						<section style="display: none;">
							<input type="hidden" name="project.pkey" value="<s:property value="project.pkey" />">
							
							<textarea class="mandatory" name="project.description" placeholder="Project description">
								<s:property value="project.description" />
							</textarea>
								
							<select name="project.projectType" class="inp-box inner-shadow" id="project-type-select" onchange="loadProjectRelatedDetails(this);">
								<option value="AndroidMobile"> Android Mobile </option>
								<option value="AndroidTab"> Android Tab </option>
								<option value="Iphone3" selected="selected"> Iphone 3 Mobile </option>
								<option value="Iphone4"> Iphone 4 Mobile </option>
								<option value="Ipad"> Ipad </option>
								<option value="Webapp"> Web Application </option>
								<option value="Custom"> Custom Application </option>
							</select>
								
							<input placeholder="in pixels" type="text" value="320" name="layout.width" class="" >					 				
							<input placeholder="in pixels" type="text" value="480" name="layout.height" class="" >
					
							<select class="inp-box inner-shadow" name="layout.orientation" id="orientation-select">
								<option value="none"> -- default --</option>
								<option value="vertical" selected="selected"> vertical </option>
								<option value="horizontal"> horizontal </option>
								<option value="both"> both </option>
							</select>
						
						</section>
				
						<ul>
							<li>
								<label> Task being stitched </label>
								<input type="text" placeholder="eg. Simple Sign up" class="mandatory" name="project.title" value="<s:property value="project.title" />" >
							</li>
							<li>
								<label> Pattern Category </label>
								<input type="text" placeholder="eg. SignUps" class="mandatory" name="project.tags[0].title" value="" id="tags-autocomplete">
							</li>
							<li>
								<label> Your email </label>
								<input type="email" placeholder="will be used for account creation" class="mandatory emailid" name="user.emailId" value="<s:property value="loggedInUser.emailId"/>">
							</li>
							<li>
								<input type="button" id="new-pattern-submit-btn" value="" class="">
							</li>
						</ul> 
					</form>
			
				</div>
				
				<h2> Create your artworks with a width of 320px and any height. </h2>
			
			</li>
		
			
			<s:iterator value="projects" var="project">
	  		
		  		<li class="interaction">
		  		
<%-- 		  			<a href="<%= request.getContextPath() %>/publish/mobile?project.pkey=<s:property value="%{#project.pkey}" />"> --%>
<%-- 		  			<a href="<%= request.getContextPath() %>/project/build/prepare?project.pkey=<s:property value="%{#project.pkey}" />"> --%>
					
					<a href="<%= request.getContextPath() %>/project/view?project.pkey=<s:property value="%{#project.pkey}" />" class="thumb">	
						<s:if test="%{#project.layout.landingPage.screenImage.pkey != null}">
	 						<img class="" alt="<s:property value="%{#project.layout.landingPage.screenImage.fileObjFileName}" />" src="<%= request.getContextPath() %>/image/view?project.pkey=<s:property value="project.pkey" />&imageFile.pkey=<s:property value="%{#project.layout.landingPage.screenImage.pkey}" />">
	 					</s:if>
					</a>
					<div>
						<h2 class="auto-ellipses"><s:property value="%{#project.title}" /></h2>
						<label class="proj-desc" style="display: none;">
							<s:property value="%{#project.description}" />
						</label>
					</div>
		  			
					<input type="hidden" class="project-pkey" value="<s:property value="%{#project.pkey}" />">
		  			
		  		</li>
	 		
			</s:iterator>
			    				
		</ul>
		
	</div>
	
	<section class="pop-ups-cont" style="display: none;">
		
		
		<!-- Project Preview Container -->
		
		<div id="project-preview-popup" class="pop-up">
			
			<div id="preview-cont">
				<iframe src="" id="preview-iframe"> 
					<p> Oooops ... , your browser currently doesn't support IFrames .. !!!</p>
					<p> Supported browsers: <a href="http://www.opera.com">Opera</a>, <a href="http://www.mozilla.com">Firefox</a>, <a href="http://www.apple.com/safari">Safari</a>, and <a href="http://www.konqueror.org">Konqueror</a>. </p>
				</iframe>
			</div>
			
			<div id="info-cont">
				<ul id="project-info-list" class="">
					<li class="no-top-border">
						<h1 class="pro-title"> Project Title </h1>
						<label class="margin-5px"> <span class="italic" > by</span> <span class="bold" id="author"> Author </span></label>
					</li>
					<li class="no-top-border">
						<p class="pro-desc"> Project description  </p>
					</li>
					
					<li>
						<label class="name"> No. Of Pages : </label>
						<label class="value" id="no-of-pages"> - </label>
					</li>
					
					<li>
						<label class="name"> height </label>
						<label class="value" id="pro-height"> - </label>
					</li>
					
					<li>
						<label class="name"> width </label>
						<label class="value" id="pro-width"> - </label>
					</li>
					
					<li>
						<label class="name"> Scan to view it on mobile </label>
						<img id="QRcode-img" alt="QR Code" src="">
					</li>
					
				</ul>
			</div>
			
			<div id="comments-cont">
				
				<h2 class="sub-title bold float-left"> Comments </h2>
				
				<ul id="project-comments-list" class="">
				
					<li>
						<label> No Comments yet !!! </label>
					</li>
				
					<%-- 
					<li class="no-top-border">
						<img alt="" src="<%= request.getContextPath() %>/themes/images/profile_photo.png" class="user-img-thumb">
						<div class="comment-text">
							<label class="gray-666-text">
								<span class="bold gray-333-text"> User 1 </span>
								Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor 
							</label>
						</div>
					</li>
					 --%>
					
				</ul>
			</div>
		</div>
		
	
	</section>
		    	
</body>

</html>
