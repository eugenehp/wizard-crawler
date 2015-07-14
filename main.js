var CURRENT 	= 0;
var ALL 		= 0;
var objects 	= [];
var csv 		= "";

$(document).ready(function(){

	$('#submit').click(function(){
		csv = $('#textarea').val();
		objects = $.csv.toObjects( csv );

		CURRENT 	= 0;
		ALL 		= objects.length;
		$('#all').text(ALL);
		$('#progressBar').attr('aria-valuemax',ALL);

		$('#textarea').val("");
		processWebsite( objects[CURRENT].website );
	});
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

		var html = request.content;
		html = html.replace(/<img[^>]*>/g,"");
		var URL = $( html ).find('.biz-website').find('a').text();
		console.log(URL);

		chrome.tabs.remove(sender.tab.id);
	// 	sendResponse({farewell: "goodbye"});

		CURRENT++;
		$('#current').text(CURRENT);
		var valeur = Math.floor(CURRENT/ALL*100);
		$('#progressBar').attr('aria-valuenow',CURRENT);
		$('#progressBar').css('width', valeur+'%')
		// $('#textarea').val( $('#textarea').val() + CURRENT + " : " + URL + " : " + sender.tab.url + "\n");
		csv = csv.replace( sender.tab.url, URL );
		$('#textarea').val( csv );

		if(CURRENT < ALL){
			processWebsite( objects[CURRENT].website );
		}else{
			$('#textarea').val( csv );
		}
});

function processWebsite(url){
	chrome.tabs.create({'url': url}, function(tab) {
    	
		chrome.tabs.executeScript( tab.id, {
			file: "injection.js",
			runAt: 	"document_end"
		}, function(results){} );


  	});
}