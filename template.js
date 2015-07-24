// creating the template for a specific URL
var ELEMENTS = ['data','selectRootElement','selectDates','selectStart','selectEnd','selectTitles','selectDescriptions','selectLink','selectImage','selectStartTime','selectEndTime'];

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
	$('.apply-button').click(doApply);

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
	chrome.storage.local.get('filteredArray',function(data){
		if(data.hasOwnProperty('filteredArray')){
			data = data.filteredArray;
			var keys = ['date','start','end','title','description','link','image'];

			JSONToCSVConvertor(data,'CSV_Report',keys);
		}
		
	});
}

function updateView() {
	chrome.storage.local.get(ELEMENTS,function(data){

		$('#debug').val( JSON.stringify( data, null, 2 ) );

		var selectDatesSplit	 	= '';
		var selectDatesPart 		= '';
		var selectStartSplit 		= '';
		var selectStartPart 		= '';
		var selectEndSplit 			= '';
		var selectEndPart 			= '';
		var selectTitlesSplit 		= '';
		var selectTitlesPart 		= '';
		var selectDescriptionsSplit = '';
		var selectDescriptionsPart 	= '';

		if(data['selectDates']) {
			$('#selectDatesSelector').val( data['selectDates'].selector );

			selectDatesSplit = data['selectDates'].split;
			selectDatesPart = data['selectDates'].part;
			$('#selectDatesSplit').val(selectDatesSplit);
			$('#selectDatesPart').val(selectDatesPart || 'first');
		}
		if(data['selectStart']) {
			$('#selectStartSelector').val( data['selectStart'].selector );

			selectStartSplit = data['selectStart'].split;
			selectStartPart = data['selectStart'].part;
			$('#selectStartSplit').val(selectStartSplit);
			$('#selectStartPart').val(selectStartPart || 'first');
		}
		if(data['selectEnd']) {
			$('#selectEndSelector').val( data['selectEnd'].selector );

			selectEndSplit = data['selectEnd'].split;
			selectEndPart = data['selectEnd'].part;
			$('#selectEndSplit').val(selectEndSplit);
			$('#selectEndPart').val(selectEndPart || 'first');
		}
		if(data['selectTitles']) {
			$('#selectTitlesSelector').val( data['selectTitles'].selector );

			selectTitlesSplit = data['selectTitles'].split;
			selectTitlesPart = data['selectTitles'].part;
			$('#selectTitlesSplit').val(selectTitlesSplit);
			$('#selectTitlesPart').val(selectTitlesPart || 'first');
		}
		if(data['selectDescriptions']) {
			$('#selectDescriptionsSelector').val( data['selectDescriptions'].selector );

			selectDescriptionsSplit = data['selectDescriptions'].split;
			selectDescriptionsPart = data['selectDescriptions'].part;
			$('#selectDescriptionsSplit').val(selectDescriptionsSplit);
			$('#selectDescriptionsPart').val(selectDescriptionsPart || 'first');
		}
		if(data['selectLink']) {
			$('#selectLinkSelector').val( data['selectLink'].selector );
		}
		if(data['selectImage']) {
			$('#selectImageSelector').val( data['selectImage'].selector );
		}

		var collection = data.data;
		var length = collection.length;
		$('#tbody').children().remove();

		var filteredArray = [];
		
		for (var i = 0; i < length; i++) {

			var row = collection[i];

			var index 			= 1 + i;

			var date 		= "" || row['selectDates'];
			var start 		= "" || row['selectStart'];
			var end 		= "" || row['selectEnd'];
			var title 		= "" || row['selectTitles'];
			var description = "" || row['selectDescriptions'];
			var link 		= "" || row['selectLink'];
			var image 		= "" || row['selectImage'];

			if(selectDatesSplit){
				date = date.split(selectDatesSplit);
				var part = selectDatesPart === 'first' ? 0 : 1;
				date = date[part];
			}
			date = date.split("	").join(" ");

			if(selectStartSplit){
				start = start.split(selectStartSplit);
				var part = selectStartPart === 'first' ? 0 : 1;
				start = start[part];
			}
			start = start.split("	").join(" ");

			if(selectEndSplit){
				end = end.split(selectEndSplit);
				var part = selectEndPart === 'first' ? 0 : 1;
				end = end[part];
			}
			end = end.split("	").join(" ");

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
			row 	+=	start+" </td><td> ";
			row 	+=	end+" </td><td> ";
			row 	+=	title+" </td><td> ";
			row 	+=	description+" </td><td>";
			row 	+=	'<a class="btn btn-default" href="'+link+'" title="'+link+'">link</a></td><td>';
			row 	+=	"<img src='"+image+"' alt='"+image+"' width=100 height=100/></td></tr>";
			$('#tbody').append( row );

			filteredArray.push({
				'date': 		date.trim(),
				'start': 		start.trim(),
				'end': 			end.trim(),
				'title': 		title.trim(),
				'description': 	description.trim(),
				'link': 		link.trim(),
				'image': 		image.trim()
			});
		};

		chrome.storage.local.set({
			'filteredArray': filteredArray
		},function savedNotification(){
			
		});
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
		if( !data['selectStart'] ) 			data['selectStart'] = {};
		if( !data['selectEnd'] ) 			data['selectEnd'] = {};
		if( !data['selectTitles'] ) 		data['selectTitles'] = {};
		if( !data['selectDescriptions'] ) 	data['selectDescriptions'] = {};
		if( !data['selectLink'] ) 			data['selectLink'] = {};
		if( !data['selectImage'] ) 			data['selectImage'] = {};

		data['selectDates'].selector 			= $('#selectDatesSelector').val();
		data['selectStart'].selector 			= $('#selectStartSelector').val();
		data['selectEnd'].selector 				= $('#selectEndSelector').val();
		data['selectTitles'].selector 			= $('#selectTitlesSelector').val();
		data['selectDescriptions'].selector 	= $('#selectDescriptionsSelector').val();
		data['selectLink'].selector 			= $('#selectLinkSelector').val();
		data['selectImage'].selector 			= $('#selectImageSelector').val();

		data['selectDates'].split 			= $('#selectDatesSplit').val();
		data['selectStart'].split 			= $('#selectStartSplit').val();
		data['selectEnd'].split 			= $('#selectEndSplit').val();
		data['selectTitles'].split 			= $('#selectTitlesSplit').val();
		data['selectDescriptions'].split 	= $('#selectDescriptionsSplit').val();

		data['selectDates'].part 			= $('#selectDatesPart').val();
		data['selectStart'].part 			= $('#selectStartPart').val();
		data['selectEnd'].part 				= $('#selectEndPart').val();
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


/////////////utils/////////////////

function JSONToCSVConvertor(JSONData, ReportTitle, KEYS) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    // CSV += ReportTitle + '\r\n\n';

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
