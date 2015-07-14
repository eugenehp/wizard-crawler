// creating the template for a specific URL

$(document).ready(function(){

	chrome.tabs.executeScript({
		file: "injection.js",
		runAt: 	"document_end"
	}, function(results){} );

	// chrome.tabs.executeScript({
	// 	code: 'document.body.style.backgroundColor="red"'
	// });

	$('#selectDates').click(selectDates);
});

function selectDates(){

}