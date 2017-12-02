var tracks = [];
var map;
var trailDetailsMap;
var circle;
var trackPoint; // google map Marker
var trackerImage; // object using google map Size object

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
            '<td style="width:40px"><img width="20px" style="margin-top:8px" src="img/time_icon.png"/></td>'+
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
					//'<h2><img width="35px" src="' + ActivityType.properties[track.activityType].icon_url + '"/>' + track.name + '</h2>' +
                    '<h4>Profil du parcours</h4>'
					// '<div id="properties">' +
					// 	'<img width="30px" style="margin-top:2px" src="img/distance_icon.png"/>' + round(track.distance_m / 1000, 1) + ' km</td>' +
					// 	'<img width="20px" style="margin-top:8px" src="img/time_icon.png"/>' + track.estimatedTime_s.toString().toHHhMM() +
					// 	'<img width="40px" style="margin-top:0px" src="img/elevation_gain_icon.png"/>' + round(track.elevationGain_m,0) + ' m</td>' +
					// 	'<img width="40px" style="margin-top:0px" src="img/elevation_loss_icon.png"/>' + round(track.elevationLoss_m,0) + ' m' +
					// '</div>'
                );


				// Show D3 altitude - distance graph
				var data = [];
				for(var i = 0; i < track.altitudes_jump_60.length; i++){
					if(i*60 > track.distances.length){
						console.log(track.distances[track.distances.length - 1]);
						data.push({"altitude": track.altitudes_jump_60[i], "distance": track.distances[track.distances.length - 1]});
					} else{
						data.push({"altitude": track.altitudes_jump_60[i], "distance": track.distances[i*60]});
					}
				}

				var margin = {
					top: 20,
					right: 80,
					bottom: 30,
					left: 50
				  },
				  width = 900 - margin.left - margin.right,
				  height = 300 - margin.top - margin.bottom;

				var x = d3.scale.linear()
				  .range([0, width]);

				var y = d3.scale.linear()
				  .range([height, 0]);

				var color = d3.scale.category10();

				var xAxis = d3.svg.axis()
				  .scale(x)
				  .orient("bottom");

				var yAxis = d3.svg.axis()
				  .scale(y)
				  .orient("left");

				var line = d3.svg.line()
				  .interpolate("basis")
				  .x(function(d) {
					return x(d.distance);
				  })
				  .y(function(d) {
					return y(d.altitude);
				  });

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

				legend.append('rect')
				  .attr('x', width - 20)
				  .attr('y', function(d, i) {
					return i * 20;
				  })
				  .attr('width', 10)
				  .attr('height', 10)
				  .style('fill', function(d) {
					return color(d.name);
				  });

				legend.append('text')
				  .attr('x', width - 8)
				  .attr('y', function(d, i) {
					return (i * 20) + 9;
				  })
				  .text(function(d) {
					return d.name;
				  });

				svg.append("g")
				  .attr("class", "x axis")
				  .attr("transform", "translate(0," + height + ")")
				  .call(xAxis);

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

				city.append("text")
				  .datum(function(d) {
					return {
					  name: d.name,
					  value: d.values[d.values.length - 1]
					};
				  })
				  .attr("transform", function(d) {
					return "translate(" + x(d.value.distance) + "," + y(d.value.altitude) + ")";
				  })
				  .attr("x", 3)
				  .attr("dy", ".35em")
				  .text(function(d) {
					return d.name;
				  });

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
						  .text(y.invert(pos.y).toFixed(2));


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

                        /*
						if(circle != null){
							circle.setMap(null);
						}
						circle = new google.maps.Circle({
						  strokeColor: '#1f77b4',
						  strokeOpacity: 0,
						  strokeWeight: 0,
						  fillColor: '#1f77b4',
						  fillOpacity: 1,
						  map: trailDetailsMap,
						  center: point,
						  radius: 60,
						  zIndex: 1000
						});
                        */


						return "translate(" + mouse[0] + "," + pos.y +")";
					  });
				  });

                  // Weather forecasts
                  loadWeatherForecasts(track.centroid['lat'], track.centroid['lng']);
            }
        })(marker, i));
    }
    map.fitBounds(bounds);
}

/** Handle the filter buttons **/
$(document).ready(function(e){
	$(".img-check").click(function(){
		$(this).toggleClass("check");
		if($(this).hasClass("check")){
			for(i in tracks){
				if(tracks[i].activityType == parseInt($(this).attr("value"))){
					tracks[i].marker.setMap(map);
					tracks[i].infoTrack.close(map, tracks[i].marker);
				}
			}
		} else{
			for(i in tracks){
				if(tracks[i].activityType == parseInt($(this).attr("value"))){
					tracks[i].marker.setMap(null);
					tracks[i].poly.setMap(null);
				}
			}
		}
	});
});
