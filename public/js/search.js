$(function() {
	$('#form-search').on('submit', function(e) {
		e.preventDefault();
		$('.spinner').removeClass('hidden');
		resetTimeline();

<<<<<<< HEAD
		$.ajax({
			url: '/search',
			type: 'GET',
			dataType: 'json',
			data: $('#form-search').serialize(),
			resetForm : true
		})
		.done(function(data){
				var imageArray = data.SearchForImagesResult.Images;
				$.each(imageArray,function(index, image){
					//console.log(image);
					addOnTimeline(createSprite(image));
=======
		var masterdata = $('#form-search').serializeObject();
		var startdate = masterdata.startdate || '2000-01-01';
		var enddate = masterdata.enddate || '2014-01-01';
		startdate = +startdate.split('-')[0];
		enddate = +enddate.split('-')[0];
		var yearlist = [];
		// generate each year
		for (var i=0; i<=enddate-startdate; i++) {
			yearlist.push(startdate+i);
		}

		async.mapSeries(yearlist,
			function(year, cb) {
				var data = clone(masterdata);
				data.startdate = year+'-01-01';
				data.enddate = year+'-12-31';
				$.ajax({
					url: '/search',
					type: 'GET',
					dataType: 'json',
					data: data,
					resetForm : true
				})
				.done(function(data){
						var itemList = [];
						var imageArray = data.SearchForImagesResult.Images;

						$.each(imageArray,function(index, image){
							image.date = new Date(+/\/Date\(([0-9]+).*\)\//g.exec(image.DateCreated)[1]);
							itemList.push(image);
						});

						itemList.sort(function(a, b) {
							return +a.date < +b.date ? -1 : 1;
						});

						addOnTimeline(createTextMarker(year));
						itemList.forEach(function(image) {
							addOnTimeline(createSprite(image));
						});

					}
				)
				.fail(function(xhr){
					console.error(xhr);
				})
				.always(function() {
					$('.spinner').addClass('hidden');
					cb();
>>>>>>> master
				});
			},

			function(err, result) {
				// no op
			}
		)
	});

	// submit once on pageload
	$('#form-search').trigger('submit');

	// adding date list staring from 1753
	var current_year = new Date().getFullYear();
	function populateStartDate(){
		var all_selectable_date = '';
		for(var i=1753;i<=current_year;i++){
			if(i===2000) all_selectable_date += '<option value="'+i+'-01-01" selected>'+i+'</option>';
			else all_selectable_date += '<option value="'+i+'-01-01">'+i+'</option>';
		}
		$('#startdate-search').html(all_selectable_date);
	}
	function populateEndDate(selectedVal){
		var selected_startdate = $('#startdate-search option:selected').val();
		var all_selectable_date='';
		for(var i=parseInt(selected_startdate); i<=current_year;i++){
			if(i===parseInt(selectedVal)) all_selectable_date += '<option value="'+i+'-01-01" selected>'+i+'</option>';
			else all_selectable_date += '<option value="'+i+'-01-01">'+i+'</option>';
		}
		$('#enddate-search').html(all_selectable_date);
	}
	populateStartDate();
	populateEndDate(current_year);
	$('#startdate-search').change(function(){
		console.log('startdate change');
		var selected_startdate = $('#startdate-search option:selected').val();
		var selected_enddate = $('#enddate-search option:selected').val();
		if(selected_startdate>selected_enddate){
			$('#enddate-search option[value="'+selected_startdate+'-01-01"]').prop('selected', true);
		}
		populateEndDate(selected_enddate);
	});

});

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
};
