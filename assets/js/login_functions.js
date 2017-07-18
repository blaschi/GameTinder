//Corresponde a pagina de login. Va en el <head>.
$(function(){
    $("#form").submit(function(event) {
        var loginData = $("#form").serializeArray();
        var regExp = /a-z+A-Z0-9+/;
        var formValid = true;
        var element;

        /*
        for (var field in loginData) {
            element = $("#"+loginData[field]['name']).val();
            if (!element.match(regExp)) {
                formValid = false;
            }
        }
        */
        if (!formValid) {
            event.preventDefault();
            alert("The information supplied is incorrect. Please try again.");
        }
        
    });
});