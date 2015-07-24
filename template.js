// creating the template for a specific URL
var ELEMENTS = ['data','selectRootElement','selectDates','selectTitles','selectDescriptions','selectLink','selectImage','selectStartTime','selectEndTime'];

$(document).ready(function(){

	chrome.tabs.executeScript({
		file: "injection.js",
		runAt: 	"document_end"
	}, function(results){} );

	ELEMENTS.forEach(function(element,index,array){
		(function(element){ 	// start clojure
			$('#'+element).click(function(){
				doSelect(element);
			});
		})(element); 			// end clojure
	});

	$('#clearStorage').click(clearStorage);
	$('#applyDates').click(doApply);
	$('#applyTitles').click(doApply);
	$('#applyDescriptions').click(doApply);

	$('#saveTemplate').click(saveTemplate);
	$('#exportCSV').click(exportCSV);
	$('#closeTempateContainer').click(function(){ $('#tempateContainer').hide(); });

	updateView();
});

function saveTemplate(){
	$('#tempateContainer').show();
	chrome.storage.local.get(ELEMENTS,function(data){
		if(data.hasOwnProperty('data'))
			delete data.data;

		$('#template').val( JSON.stringify(data,null,2) );
	});
}

function exportCSV(){
	// $('#tempateContainer').show();
	chrome.storage.local.get(ELEMENTS,function(data){
		if(data.hasOwnProperty('data')){
			data = data.data;
			JSONToCSVConvertor(data,'CSV_Report',ELEMENTS.slice(2,ELEMENTS.length));
			// var csv = 
			// $('#template').val( JSON.stringify(data,null,2) );
		}
		
	});
}

function JSONToCSVConvertor(JSONData, ReportTitle, KEYS) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';

        var row = KEYS.join(",");
        
        //append Label row with line break
        CSV += row + '\r\n';
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        var rowElement = arrData[i];

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var keyIndex =0;keyIndex<KEYS.length;keyIndex++) {
        	var key = KEYS[keyIndex];
            row += '"' + rowElement[key] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "EUGENEHP_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateView() {
	chrome.storage.local.get(ELEMENTS,function(data){

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

		// var length = dates.length || titles.length || descriptions.length || links.length || images.length;
		var collection = data.data;
		var length = collection.length;
		$('#tbody').children().remove();
		
		for (var i = 0; i < length; i++) {

			var row = collection[i];

			var index 			= 1 + i;
			var date 			= "";  //if( dates ) if( dates.length > i ) 			date = dates[i];
			var title 			= ""; //if( titles ) if( titles.length > i ) 			title = titles[i];
			var description 	= ""; //if( descriptions ) if( descriptions.length > i ) 	description = descriptions[i];
			var link 			= ""; //if( links ) if( links.length > i ) 			link = links[i];
			var image 			= ""; //if( images ) if( images.length > i )			image = images[i];

			date = row['selectDates'];
			title = row['selectTitles'];
			description = row['selectDescriptions'];
			link = row['selectLink'];
			image = row['selectImage'];

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

function doSelect(selectName){
	chrome.storage.local.set({
		current: selectName
	},function savedNotification(){
		window.close();
	});
}

function doApply(){
	chrome.storage.local.get(ELEMENTS,function(data){
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
			// $('#debug').val( 'doApply\n'+JSON.stringify( data, null, 2 ) );
			updateView();
			// window.close();
		});
	});
}