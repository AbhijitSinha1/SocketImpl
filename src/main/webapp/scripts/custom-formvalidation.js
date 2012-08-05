
// custom form validation

$.fn.validateForm = function( options ){
	
	if (this && this.length > 0) {
		// options 
		options = $.extend({
			
			// breaks on error
			validateDisabled : false,
			
			// breaks on error
			breakOnError : true,
						
			// element class on which validation has to be applied
			validationClass : 'mandatory',
			
			// class names types validations to be performed
			// functions against class names .. 
			validations : {},
			
			// will be executed in failure case
			failureFunction : function(element){},
			
			// will be executed in success case
			successFunction : function(element){},
			
			// if form is completely valid
			onValidForm : function(element){},
			
			// is valid flag
			isFormValid : true
			
		}, options );
		
		// adding validations
		options.validations = $.extend(true, options.validations, formValidation.VALIDATION_FUNCTIONS);
		
		this.each(function(){
			formValidation(this, options);
		});
		
		return options.isFormValid;
		
	} else {
		
		// element is null ..
		return false;
	}
	
}

// instantiate the form validation function ..
function formValidation(form, options) {
	return this instanceof formValidation ? this.doValidation(form, options) : new formValidation(form, options);
}

// prototyping the function 
$.extend (formValidation.prototype , {
	
	doValidation : function(form, options){
		
		var inputs = $(form).find('input');
		if(inputs && inputs.length > 0){
			
			
			// TODO Check disabled .. ???
			
			inputs.each(function(){
				
				var inpElement = $(this);
				var inpValue = inpElement.val(); 
				
				var cls = inpElement.attr('class');
				if(cls && cls != ''){
					var clsList = cls.split(/\s+/);
					if(clsList && clsList.length > 0) {
						for ( var i = 0; i < clsList.length; i++) {
							var cls = clsList[i];
							var func = options.validations[cls];
							if(func) {
								if(func(inpValue)){
									options.successFunction(inpElement);
								} else {
									options.isFormValid = false;
									options.failureFunction(inpElement);
									
									if(options.breakOnError) 
										return options.isFormValid;
								}
							}
						}
					
					}
				}	
				
			});
						
		}
		
		if (options.isFormValid) {
			options.onValidForm(form);
			return this;
		} else {
			return false;
		}
		
	}
		
});

// form validation functions
$.extend(formValidation, {
	
	VALIDATION_FUNCTIONS : {
		
		mandatory : function(inpValue){
			if(!inpValue || inpValue == ' ')
				return false;
			
			return true;
		},
		
		text : function(inpValue){
			var pattern = "";
			return testPattern(pattern, inpValue);
		},

		numeric : function(inpValue){
			var pattern = "";
			return testPattern(pattern, inpValue);
		},

		date : function(inpValue){
			var pattern = "";
			return testPattern(pattern, inpValue);
		},

		time : function(inpValue){
			var pattern = "";
			return testPattern(pattern, inpValue);
		},
		
		emailid : function(inpValue){
			var pattern = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])";
            return testPattern (pattern, inpValue);

		}
		
	}

});

function testPattern(pattern, inpValue) {
	if (pattern && inpValue){
		var regExp = new RegExp(pattern, "");
	    return regExp.test(inpValue);
	}
	
	return false;
}
