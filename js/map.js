var tracks = []; // The list of all the tracks
var map;
var trailDetailsMap;
var circle; // Track position marker
var trackPoint; // google map Marker
var trackerImage; // object using google map Size object

// Filters
var filterMTB = false;
var filterHiking = false;
var filterSkitour = false;
var filterOther = false;
var minDistance;
var maxDistance;
var minDuration;
var maxDuration;
var minElevationGain;
var maxElevationGain;
var minElevationLoss;
var maxElevationLoss;

/** Initialize the map and the markers **/
function initMap() {
    var customStyled = customStyleForMap;

    var bounds = new google.maps.LatLngBounds();
    map = new google.maps.Map(document.getElementById("google-map"), {
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        streetViewControl: false
    });
    map.set('styles',customStyled);

    var files = ['Morning_Hike.gpx',
    'skitour_2017-11-26.gpx',
    'VTT_2017-05-25_10-00-01.gpx',
    'VTT_2017-09-10_17-12-49.gpx',
    'VTT_2017-09-13_16-22-44.gpx',
    'VTT_2017-09-15_10-17-33.gpx',
    'VTT_2017-09-22_09-11-32.gpx'];

    tracks = getTracks(files);

    var selectedMarker = null;
    var selectedInfoWindow = null;
    var selectedPoly = null;

    let weatherImage = {
        url: 'img/weather_marker.png',
        // This marker is 20 pixels wide by 32 pixels high.
        scaledSize: new google.maps.Size(38, 50),
        anchor: new google.maps.Point(19, 50)
    };

    for (var i in tracks) {
        let track = tracks[i];

        let image = {
            url: ActivityType.properties[track.activityType].marker_url,
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new google.maps.Size(70, 70),
        };

        let marker = new google.maps.Marker({
            position: track.centroid,
            map: map,
            icon: image
        });

        track.marker = marker;

        bounds.extend(marker.position);

        // Box displayed when marker is hovered
        let contentString =
        '<div id="content">'+
        '<table>'+
        '<tbody>'+
        '<tr>'+
        '<td style="width:40px;"><img width="35px" src="' + ActivityType.properties[track.activityType].icon_url + '"/></td>'+
        '<td colspan="3"><b>' + track.name + '</b></td>'+
        '</tr>'+
        '<tr>'+
        '<td style="width:40px"><img width="30px" style="margin-top:2px" src="img/distance_icon.png"/></td>'+
        '<td style="width:90px">' + round(track.distance_m / 1000, 1) + ' km</td>'+
        '<td style="width:40px"><img width="20px" style="margin-top:0px" src="img/time_icon.png"/></td>'+
        '<td style="width:90px">' + track.estimatedTime_s.toString().toHHhMM() + '</td>'+
        '</tr>'+
        '<tr>'+
        '<td style="width:40px"><img width="40px" style="margin-top:0px" src="img/elevation_gain_icon.png"/></td>'+
        '<td style="width:90px">' + round(track.elevationGain_m,0) + ' m</td>'+
        '<td style="width:40px"><img width="40px" style="margin-top:0px" src="img/elevation_loss_icon.png"/></td>'+
        '<td style="width:90px">' + round(track.elevationLoss_m,0) + ' m</td>'+
        '</tr>'+
        '</tbody>'+
        '</table>';
        let infoTrack = new google.maps.InfoWindow({
            content: contentString
        });
        track.infoTrack = infoTrack;

        // Build track as a polyline
        let poly = new google.maps.Polyline({
            // use your own style here
            path: track.points,
            strokeColor: "#FF00AA",
            strokeOpacity: .7,
            strokeWeight: 4
        });
        track.poly = poly;

        /**
        * On marker hover, display global track's data
        */
        marker.addListener('mouseover', function() {
            if(selectedMarker != marker){
                infoTrack.open(map, marker);
                poly.setMap(map);
            }
        });

        /**
        * On marker mouseout, hide global track's data
        */
        marker.addListener('mouseout', function() {
            if(selectedMarker != marker){
                infoTrack.close(map, marker);
                poly.setMap(null);
            }
        });

        /**
        * On marker mouseclick
        */
        marker.addListener('click', function() {
            if(selectedMarker != marker){
                if(selectedMarker != null && selectedInfoTrack != null && selectedPoly != null){
                    selectedInfoTrack.close(map, selectedMarker);
                    selectedPoly.setMap(null);
                }
                selectedMarker = marker;
                selectedInfoTrack = infoTrack;
                selectedPoly = poly;
                infoTrack.open(map, marker);
                poly.setMap(map);
            } else{
                infoTrack.close(map, marker);
                poly.setMap(map);
                selectedMarker = null;
            }
        });

        // Handle track type filter click
        $(".img-check").click(function(){
            $(this).toggleClass("check");
            if(parseInt($(this).attr("value")) == ActivityType.MTB){
                filterMTB = !$(this).hasClass("check");
            } else if(parseInt($(this).attr("value")) == ActivityType.HIKING){
                filterHiking = !$(this).hasClass("check");
            } else if(parseInt($(this).attr("value")) == ActivityType.SKITOUR){
                filterSkitour = !$(this).hasClass("check");
            } else if(parseInt($(this).attr("value")) == ActivityType.OTHER){
                filterOther = !$(this).hasClass("check");
            }
            updateMarkers();
        });

        // Calculate minimum and maximum for the filter sliders
        minDistance = tracks[0].distance_m;
        maxDistance = tracks[0].distance_m;
        minDuration = tracks[0].estimatedTime_s;
        maxDuration = tracks[0].estimatedTime_s;
        minElevationGain = tracks[0].elevationGain_m;
        maxElevationGain = tracks[0].elevationGain_m;
        minElevationLoss = tracks[0].elevationLoss_m;
        maxElevationLoss = tracks[0].elevationLoss_m;
        for (var j in tracks) {
            if(tracks[j].distance_m < minDistance){
                minDistance = tracks[j].distance_m;
            } else if(tracks[j].distance_m > maxDistance){
                maxDistance = tracks[j].distance_m;
            }

            if(tracks[j].estimatedTime_s < minDuration){
                minDuration = tracks[j].estimatedTime_s;
            } else if(tracks[j].estimatedTime_s > maxDuration){
                maxDuration = tracks[j].estimatedTime_s;
            }

            if(tracks[j].elevationGain_m < minElevationGain){
                minElevationGain = tracks[j].elevationGain_m;
            } else if(tracks[j].elevationGain_m > maxElevationGain){
                maxElevationGain = tracks[j].elevationGain_m;
            }

            if(tracks[j].elevationLoss_m < minElevationLoss){
                minElevationLoss = tracks[j].elevationLoss_m;
            } else if(tracks[j].elevationLoss_m > maxElevationLoss){
                maxElevationLoss = tracks[j].elevationLoss_m;
            }
        }
        minDistance = Math.floor(minDistance);
        maxDistance = Math.ceil(maxDistance);

        // Handle sliders filter
        $( "#distance-slider" ).slider({
            range: true,
            min: minDistance,
            max: maxDistance,
            values: [ minDistance, maxDistance ],
            slide: function( event, ui ) {
                minDistance = ui.values[ 0 ];
                maxDistance = ui.values[ 1 ];
                $( "#distance" ).text( ui.values[ 0 ] / 1000 + "km - " + ui.values[ 1 ]/1000 + "km" );
                updateMarkers();
            }
        });
        $( "#duration-slider" ).slider({
            range: true,
            min: minDuration,
            max: maxDuration,
            values: [ minDuration, maxDuration ],
            slide: function( event, ui ) {
                minDuration = ui.values[ 0 ];
                maxDuration = ui.values[ 1 ];
                $( "#duration" ).text( ui.values[0].toString().toHHhMM() + " - " + ui.values[1].toString().toHHhMM() + "" );
                updateMarkers();
            }
        });$( "#elevation-gain-slider" ).slider({
            range: true,
            min: minElevationGain,
            max: maxElevationGain,
            values: [ minElevationGain, maxElevationGain ],
            slide: function( event, ui ) {
                minElevationGain = ui.values[ 0 ];
                maxElevationGain = ui.values[ 1 ];
                $( "#elevation-gain" ).text( ui.values[ 0 ] + "m - " + ui.values[ 1 ] + "m" );
                updateMarkers();
            }
        });$( "#elevation-loss-slider" ).slider({
            range: true,
            min: minElevationLoss,
            max: maxElevationLoss,
            values: [ minElevationLoss, maxElevationLoss ],
            slide: function( event, ui ) {
                minElevationLoss = ui.values[ 0 ];
                maxElevationLoss = ui.values[ 1 ];
                $( "#elevation-loss" ).text( ui.values[ 0 ] + "m - " + ui.values[ 1 ] + "m" );
                updateMarkers();
            }
        });
        $( "#distance" ).text($( "#distance-slider" ).slider( "values", 0 ) / 1000 +
        "km - " + $( "#distance-slider" ).slider( "values", 1 ) / 1000 + "km" );
        $( "#duration" ).text($( "#duration-slider" ).slider( "values", 0 ).toString().toHHhMM() +
        " - " + $( "#duration-slider" ).slider( "values", 1 ).toString().toHHhMM() + "" );
        $( "#elevation-gain" ).text($( "#elevation-gain-slider" ).slider( "values", 0 ) +
        "m - " + $( "#elevation-gain-slider" ).slider( "values", 1 ) + "m" );
        $( "#elevation-loss" ).text($( "#elevation-loss-slider" ).slider( "values", 0 ) +
        "m - " + $( "#elevation-loss-slider" ).slider( "values", 1 ) + "m" );

        // Don't close the dropup menu when someone clicks inside it
        $( ".dropdown-menu" ).on('click', function(event){
            event.stopPropagation();
        });


        /**
        * On marker click, display detailed track's data
        */
        google.maps.event.addListener(marker, 'click', (function() {
            return function() {

                $("#weather-failure").hide();
                $("#weather").hide();
                $("#loading-weather").show();

                let polyCpy = new google.maps.Polyline({
                    // use your own style here
                    path: track.points,
                    strokeColor: "#FF00AA",
                    strokeOpacity: .7,
                    strokeWeight: 4
                });
                $("#map").width("50%");
                $("#map").height("50%");
                $("#details").show();
                $("#track").show();
                google.maps.event.trigger(map, 'resize');
                map.setCenter(marker.position);

                // Show trail
                trailDetailsMap = new google.maps.Map(
                    document.getElementById("track"), {
                        mapTypeId: google.maps.MapTypeId.TERRAIN,
                        streetViewControl: false,
                    });
                    trailDetailsMap.set('styles',customStyled);

                    // Init trackPoint
                    trackerImage ={
                        url: "img/tracker_marker.png",
                        scaledSize: new google.maps.Size(16, 16),
                        anchor: new google.maps.Point(8,8)
                    };
                    trackPoint = new google.maps.Marker({
                        map: trailDetailsMap,
                        icon: trackerImage
                    });

                    var boundsDetail = new google.maps.LatLngBounds ();
                    for(var j in track.points) {
                        boundsDetail.extend(track.points[j]);
                    }

                    polyCpy.setMap(trailDetailsMap);

                    // Show start and end marker
                    if(track.points.length > 0){
                        let imageStart = {
                            url: 'img/start_marker.png',
                            // This marker is 20 pixels wide by 32 pixels high.
                            scaledSize: new google.maps.Size(40, 40),
                            anchor: new google.maps.Point(40, 40)
                        };
                        let markerStart = new google.maps.Marker({
                            position: track.points[0],
                            map: trailDetailsMap,
                            icon: imageStart
                        });
                        let contentStart = '<p>Cliquer pour itinéraire</p>';
                        let infoStart = new google.maps.InfoWindow({
                            content: contentStart
                        });
                        markerStart.addListener('mouseover', function() {
                            // display infowindow
                            infoStart.open(trailDetailsMap, this);
                        });
                        markerStart.addListener('mouseout', function() {
                            // hide infowindow
                            infoStart.close();
                        });
                        var routeUrl = 'https://www.google.com/maps/dir//'+track.points[0]['lat']+','+track.points[0]['lng']+'/@'+track.points[0]['lat']+','+track.points[0]['lng']+',12z/data=!3m1!4b1';
                        markerStart.addListener('click', function() {
                            // Open new tab with google map route
                            window.open(routeUrl);
                        });
                        let imageEnd = {
                            url: 'img/end_marker.png',
                            // This marker is 20 pixels wide by 32 pixels high.
                            scaledSize: new google.maps.Size(30, 30),
                            anchor: new google.maps.Point(0, 30)
                        };
                        let markerEnd = new google.maps.Marker({
                            position: track.points[track.points.length - 1],
                            map: trailDetailsMap,
                            icon: imageEnd
                        });
                    }

                    // fit bounds to track
                    trailDetailsMap.fitBounds(boundsDetail);

                    // Show global data of track
                    $("#data").html(
                        '<div class="row"><div class="col-md-8" style="text-align: left"><h2><img width="40px" src="' + ActivityType.properties[track.activityType].icon_url + '"/>' + track.name + '</h2></div>' +
                        '<div id="properties" class="col-md-4" style="text-align: right; padding: 20px; padding-right: 20px;">' +
                        '<table><tr><td><img width="30px" style="margin-top:2px" src="img/distance_icon.png"/>' + round(track.distance_m / 1000, 1) + ' km</td>' +
                        '<td><img width="20px" style="margin-top:0px" src="img/time_icon.png"/>' + track.estimatedTime_s.toString().toHHhMM() + '</td></tr>' +
                        '<tr><td><img width="40px" style="margin-top:0px" src="img/elevation_gain_icon.png"/>' + round(track.elevationGain_m,0) + ' m</td>' +
                        '<td><img width="40px" style="margin-top:0px" src="img/elevation_loss_icon.png"/>' + round(track.elevationLoss_m,0) + ' m</td></tr>' +
                        '</table></div>' +
                        '<h4>Profil du parcours</h4>'
                    );

                    drawSvg(track);

                    function resize(){
                        drawSvg(track);
                    }
                    window.addEventListener("resize", resize);

                    // show weather marker on centroid
                    let weatherMarker = new google.maps.Marker({
                        position: track.centroid,
                        map: trailDetailsMap,
                        icon: weatherImage,
                        opacity: 0.5
                    });

                    // Weather forecasts
                    loadWeatherForecasts(track.centroid['lat'], track.centroid['lng'], trailDetailsMap, weatherMarker);
                }
            })(marker, i));
        }
        map.fitBounds(bounds);
    }

// Show D3 altitude - distance graph
function drawSvg(track){
	// Get the data
	var data = [];
	for(var i = 0; i < track.altitudes_jump_60.length; i++){
		if(i*60 > track.distances.length){
			data.push({"altitude": track.altitudes_jump_60[i], "distance": track.distances[track.distances.length - 1]});
		} else{
			data.push({"altitude": track.altitudes_jump_60[i], "distance": track.distances[i*60]});
		}
	}

	// Set width and margin
	var margin = {
		top: 20,
		right: 10,
		bottom: 30,
		left: 50
	  },
	  width = $('#data').width() - margin.left - margin.right,
	  height = 300 - margin.top - margin.bottom;

	var x = d3.scale.linear()
	  .range([0, width]);

	var y = d3.scale.linear()
	  .range([height, 0]);

	// define the area
	var area = d3.svg.area()
		.x(function(d) { return x(d.distance); })
		.y0(height)
		.y1(function(d) { return y(d.altitude); });

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	  .scale(x)
	  .orient("bottom");

	var yAxis = d3.svg.axis()
	  .scale(y)
	  .orient("left");

	var line = d3.svg.line()
	  //.interpolate("basis") // FIXME: uncomment if rounded curve is needed
	  .x(function(d) {
		return x(d.distance);
	  })
	  .y(function(d) {
		return y(d.altitude);
	  });
	d3.select("#data").select("svg").remove();
	var svg = d3.select("#data").append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	color.domain(d3.keys(data[0]).filter(function(key) {
	  return key !== "distance";
	}));

	var cities = color.domain().map(function(name) {
	  return {
		name: name,
		values: data
	  };
	});

	x.domain(d3.extent(data, function(d) {
	  return d.distance;
	}));

	y.domain([
	  d3.min(cities, function(c) {
		return d3.min(c.values, function(v) {
		  return v.altitude;
		});
	  }),
	  d3.max(cities, function(c) {
		return d3.max(c.values, function(v) {
		  return v.altitude;
		});
	  })
	]);

	var legend = svg.selectAll('g')
	  .data(cities)
	  .enter()
	  .append('g')
	  .attr('class', 'legend');

	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis)
	  .append("text")
	  .attr("transform", "translate(" + width + ", 0)")
	  .attr("y", -15)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("Distance (m)");

	svg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis)
	  .append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("Altitude (m)");

	var city = svg.selectAll(".city")
	  .data(cities)
	  .enter().append("g")
	  .attr("class", "city");

	city.append("path")
	  .attr("class", "line")
	  .attr("d", function(d) {
		return line(d.values);
	  })
	  .style("stroke", function(d) {
		return color(d.name);
	  });

	// add the area
	svg.append("path")
		.data([data])
		.attr("class", "area")
		.attr("d", area);

	var mouseG = svg.append("g")
	  .attr("class", "mouse-over-effects");

	mouseG.append("path") // this is the black vertical line to follow mouse
	  .attr("class", "mouse-line")
	  .style("stroke", "black")
	  .style("stroke-width", "1px")
	  .style("opacity", "0");

	var lines = document.getElementsByClassName('line');

	var mousePerLine = mouseG.selectAll('.mouse-per-line')
	  .data(cities)
	  .enter()
	  .append("g")
	  .attr("class", "mouse-per-line");

	mousePerLine.append("circle")
	  .attr("r", 7)
	  .style("stroke", function(d) {
		return color(d.name);
	  })
	  .style("fill", "none")
	  .style("stroke-width", "1px")
	  .style("opacity", "0");

	mousePerLine.append("text")
	  .attr("transform", "translate(10,3)");

	mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
	  .attr('width', width) // can't catch mouse events on a g element
	  .attr('height', height)
	  .attr('fill', 'none')
	  .attr('pointer-events', 'all')
	  .on('mouseout', function() { // on mouse out hide line, circles and text
		d3.select(".mouse-line")
		  .style("opacity", "0");
		d3.selectAll(".mouse-per-line circle")
		  .style("opacity", "0");
		d3.selectAll(".mouse-per-line text")
		  .style("opacity", "0");

		 trackPoint.setMap(null);
	  })
	  .on('mouseover', function() { // on mouse in show line, circles and text
		d3.select(".mouse-line")
		  .style("opacity", "1");
		d3.selectAll(".mouse-per-line circle")
		  .style("opacity", "1");
		d3.selectAll(".mouse-per-line text")
		  .style("opacity", "1");

		trackPoint.setMap(trailDetailsMap);

	  })
	  .on('mousemove', function() { // mouse moving over canvas
		var mouse = d3.mouse(this);
		d3.select(".mouse-line")
		  .attr("d", function() {
			var d = "M" + mouse[0] + "," + height;
			d += " " + mouse[0] + "," + 0;
			return d;
		  });

		d3.selectAll(".mouse-per-line")
		  .attr("transform", function(d, i) {
			var xDate = x.invert(mouse[0]),
				bisect = d3.bisector(function(d) { return d.distance; }).right;
				idx = bisect(d.values, xDate);

			var beginning = 0,
				end = lines[i].getTotalLength(),
				target = null;

			while (true){
			  target = Math.floor((beginning + end) / 2);
			  pos = lines[i].getPointAtLength(target);
			  if ((target === end || target === beginning) && pos.x !== mouse[0]) {
				  break;
			  }
			  if (pos.x > mouse[0])      end = target;
			  else if (pos.x < mouse[0]) beginning = target;
			  else break; //position found
			}

			d3.select(this).select('text')
			  .text(y.invert(pos.y).toFixed(2) + 'm');


			// Display the point on map
			// Find the right distances
			var distPos = 0;
			for(distPos = 0; distPos < track.distances.length; distPos++){
				if(x.invert(pos.x).toFixed(2) < track.distances[distPos]){
					break;
				}
			}
			var point = track.points[distPos];

			// To avoid resizing the circle, use a marker instead
			trackPoint.setPosition(point);
			
			// Update the gradient
			var w = track.distances[distPos] - track.distances[distPos - 60];
			var h = track.elevationGains[Math.ceil(distPos/60)] - track.elevationGains[Math.ceil(distPos/60) - 1] - (track.elevationLosses[Math.ceil(distPos/60)] - track.elevationLosses[Math.ceil(distPos/60) - 1]);
			var gradient = 100 * h / w;
			if(gradient >= 0){
				$("#gradient").css("border-bottom", gradient + "px solid red");
				$("#gradient").css("border-top", "0px");
			}
			else{
				$("#gradient").css("border-top", gradient * -1 + "px solid red");
				$("#gradient").css("border-bottom", "0px");
			}
			$("#gradient").text(Math.atan(h/w) * 180/Math.PI + "°");

			// Update the progress bars
			$("#distance-progress-bar").width(Math.floor(100 * x.invert(pos.x).toFixed(2) / track.distance_m).toString() + "%");
			$("#distance-progress-bar").text(Math.round(x.invert(pos.x).toFixed(2)) + "m");

			$("#duration-progress-bar").width(Math.floor(100 * track.estimatedTimes[distPos] / track.estimatedTime_s).toString() + "%");
			$("#duration-progress-bar").text(track.estimatedTimes[distPos].toString().toHHhMM());

			$("#elevation-gain-progress-bar").width(Math.floor(100 * track.elevationGains[Math.floor(distPos/60)] / track.elevationGain_m).toString() + "%");
			$("#elevation-gain-progress-bar").text(Math.round(track.elevationGains[Math.floor(distPos/60)]) + "m");

			$("#elevation-loss-progress-bar").width(Math.floor(100 * track.elevationLosses[Math.floor(distPos/60)] / track.elevationLoss_m).toString() + "%");
			$("#elevation-loss-progress-bar").text(Math.round(track.elevationLosses[Math.floor(distPos/60)]) + "m");
			$("#progress-bars").slideDown();

			return "translate(" + mouse[0] + "," + pos.y +")";
		  });
	  }).on('mouseout', function() { // mouse moving over canvas
		$("#progress-bars").slideUp();
	  });
}

function move() {
    var elem = document.getElementById("distance-progress-bar");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}

function updateMarkers(){
	for(i in tracks){
		if((tracks[i].activityType == ActivityType.MTB && filterMTB == true) ||
		   (tracks[i].activityType == ActivityType.HIKING && filterHiking == true) ||
		   (tracks[i].activityType == ActivityType.SKITOUR && filterSkitour == true) ||
		   (tracks[i].activityType == ActivityType.OTHER && filterOther == true) ||
			tracks[i].distance_m < minDistance || tracks[i].distance_m > maxDistance ||
			tracks[i].estimatedTime_s < minDuration || tracks[i].estimatedTime_s > maxDuration ||
			tracks[i].elevationGain_m < minElevationGain || tracks[i].elevationGain_m > maxElevationGain ||
			tracks[i].elevationLoss_m < minElevationLoss || tracks[i].elevationLoss_m > maxElevationLoss){
			if(tracks[i].marker.getMap() != null){
				tracks[i].marker.setMap(null);
				tracks[i].poly.setMap(null);
		    }
		} else{
		   if(tracks[i].marker.getMap() == null){
			tracks[i].marker.setMap(map);
			tracks[i].infoTrack.close(map, tracks[i].marker);
		   }
		}
	}
}
