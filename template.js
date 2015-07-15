// creating the template for a specific URL

$(document).ready(function(){

	chrome.tabs.executeScript({
		file: "injection.js",
		runAt: 	"document_end"
	}, function(results){} );

	$('#clearStorage').click(clearStorage);
	$('#selectDates').click(selectDates);
	$('#selectTitles').click(selectTitles);
	$('#selectDescriptions').click(selectDescriptions);
	$('#selectLink').click(selectLink);
	$('#selectImage').click(selectImage);

	$('#applyDates').click(doApply);
	$('#applyTitles').click(doApply);
	$('#applyDescriptions').click(doApply);

	updateView();
});

function updateView() {
	chrome.storage.local.get(['selectDates','selectTitles','selectDescriptions','selectLink','selectImage'],function(data){

		$('#debug').val( JSON.stringify( data, null, 2 ) );

		var selectDatesSplit = '';
		var selectDatesPart = '';
		var selectTitlesSplit = '';
		var selectTitlesPart = '';
		var selectDescriptionsSplit = '';
		var selectDescriptionsPart = '';

		var dates 			= [];
		var titles 			= [];
		var descriptions 	= [];
		var links 			= [];
		var images 			= [];

		if(data['selectDates']) {
			$('#selectDatesSelector').val( data['selectDates'].selector );
			dates = data['selectDates'].texts;

			selectDatesSplit = data['selectDates'].split;
			selectDatesPart = data['selectDates'].part;
			$('#selectDatesSplit').val(selectDatesSplit);
			$('#selectDatesPart').val(selectDatesPart || 'first');
		}
		if(data['selectTitles']) {
			$('#selectTitlesSelector').val( data['selectTitles'].selector );
			titles = data['selectTitles'].texts;

			selectTitlesSplit = data['selectTitles'].split;
			selectTitlesPart = data['selectTitles'].part;
			$('#selectTitlesSplit').val(selectTitlesSplit);
			$('#selectTitlesPart').val(selectTitlesPart || 'first');
		}
		if(data['selectDescriptions']) {
			$('#selectDescriptionsSelector').val( data['selectDescriptions'].selector );
			descriptions = data['selectDescriptions'].texts;

			selectDescriptionsSplit = data['selectDescriptions'].split;
			selectDescriptionsPart = data['selectDescriptions'].part;
			$('#selectDescriptionsSplit').val(selectDescriptionsSplit);
			$('#selectDescriptionsPart').val(selectDescriptionsPart || 'first');
		}
		if(data['selectLink']) {
			links = data['selectLink'].links;
			$('#selectLinkSelector').val( data['selectLink'].selector );
		}
		if(data['selectImage']) {
			images = data['selectImage'].images;
			$('#selectImageSelector').val( data['selectImage'].selector );
		}

		var length = dates.length || titles.length || descriptions.length || links.length || images.length;

		$('#tbody').children().remove();
		for (var i = 0; i < length; i++) {

			var index 			= 1 + i;
			var date 			= ""; if( dates ) if( dates.length > i ) 			date = dates[i];
			var title 			= ""; if( titles ) if( titles.length > i ) 			title = titles[i];
			var description 	= ""; if( descriptions ) if( descriptions.length > i ) 	description = descriptions[i];
			var link 			= ""; if( links ) if( links.length > i ) 			link = links[i];
			var image 			= ""; if( images ) if( images.length > i )			image = images[i];

			if(selectDatesSplit){
				date = date.split(selectDatesSplit);
				var part = selectDatesPart === 'first' ? 0 : 1;
				date = date[part];
			}

			if(selectTitlesSplit){
				title = title.split(selectTitlesSplit);
				var part = selectTitlesPart === 'first' ? 0 : 1;
				title = title[part];
			}

			if(selectDescriptionsSplit){
				description = description.split(selectDescriptionsSplit);
				var part = selectDescriptionsPart === 'first' ? 0 : 1;
				description = description[part];
			}

			var row = 	"<tr><th scope='row'>"+index+"</th><td> "
			row 	+=	date+" </td><td> ";
			row 	+=	title+" </td><td> ";
			row 	+=	description+" </td><td>";
			row 	+=	'<a class="btn btn-default" href="'+link+'" title="'+link+'">link</a></td><td>';
			row 	+=	"<img src='"+image+"' alt='"+image+"' width=100 height=100/></td></tr>";
			$('#tbody').append( row );
		};
	})
}

function clearStorage(){
	chrome.storage.local.clear();
	window.close();
}

function selectDates()			{	doSelect('selectDates') 		}
function selectTitles()			{	doSelect('selectTitles') 		}
function selectDescriptions()	{	doSelect('selectDescriptions') 	}
function selectLink()			{	doSelect('selectLink') 		}
function selectImage()			{	doSelect('selectImage') 		}

function doSelect(selectName){
	chrome.storage.local.set({
		current: selectName
	},function savedNotification(){
		window.close();
	});
}

function doApply(){
	chrome.storage.local.get(['selectDates','selectTitles','selectDescriptions','selectLink','selectImage'],function(data){

		if( !data['selectDates'] ) 			data['selectDates'] = {};
		if( !data['selectTitles'] ) 		data['selectTitles'] = {};
		if( !data['selectDescriptions'] ) 	data['selectDescriptions'] = {};
		if( !data['selectLink'] ) 			data['selectLink'] = {};
		if( !data['selectImage'] ) 			data['selectImage'] = {};

		data['selectDates'].selector 			= $('#selectDatesSelector').val();
		data['selectTitles'].selector 			= $('#selectTitlesSelector').val();
		data['selectDescriptions'].selector 	= $('#selectDescriptionsSelector').val();
		data['selectLink'].selector 			= $('#selectLinkSelector').val();
		data['selectImage'].selector 			= $('#selectImageSelector').val();

		data['selectDates'].split 			= $('#selectDatesSplit').val();
		data['selectTitles'].split 			= $('#selectTitlesSplit').val();
		data['selectDescriptions'].split 	= $('#selectDescriptionsSplit').val();

		data['selectDates'].part 			= $('#selectDatesPart').val();
		data['selectTitles'].part	 		= $('#selectTitlesPart').val();
		data['selectDescriptions'].part 	= $('#selectDescriptionsPart').val();

		

		chrome.storage.local.set(
			data
		,function savedNotification(){
			// $('#debug').val( JSON.stringify( data ) );
			// alert(1)
			updateView();
			// window.close();
		});
	});
}