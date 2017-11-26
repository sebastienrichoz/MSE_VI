function initMap() {
    var customStyled = customStyleForMap;

    var myLatLng = {lat: -25.363, lng: 131.044};
    var bounds = new google.maps.LatLngBounds();
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        streetViewControl: false
    });
    map.set('styles',customStyled);

    var files = ['Morning_Hike.gpx',
    'VTT_2017-05-25_10-00-01.gpx',
    'VTT_2017-09-10_17-12-49.gpx',
    'VTT_2017-09-13_16-22-44.gpx',
    'VTT_2017-09-15_10-17-33.gpx',
    'VTT_2017-09-22_09-11-32.gpx'];

    var tracks = getTracks(files);
	
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
            position: computeCentroid(track.points),
            map: map,
            icon: image
        });

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

        // Build track as a polyline
        let poly = new google.maps.Polyline({
            // use your own style here
            path: track.points,
            strokeColor: "#FF00AA",
            strokeOpacity: .7,
            strokeWeight: 4
        });

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
				console.log("a");
				if(selectedMarker != null && selectedInfoTrack != null && selectedPoly != null){
					console.log("b");
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

                let polyCpy = new google.maps.Polyline({
                    // use your own style here
                    path: track.points,
                    strokeColor: "#FF00AA",
                    strokeOpacity: .7,
                    strokeWeight: 4
                });

                console.log(event);
                $("#map").width("50%");
                $("#map").height("50%");
                $("#data").show();
                $("#track").show();
                google.maps.event.trigger(map, 'resize');
                map.setCenter(marker.position);

                // Show trail
                let trailDetailsMap = new google.maps.Map(
                    document.getElementById("track"), {
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    streetViewControl: false,
                });
                trailDetailsMap.set('styles',customStyled);

                var boundsDetail = new google.maps.LatLngBounds ();
                for(var j in track.points) {
                    boundsDetail.extend(track.points[j]);
                }

                polyCpy.setMap(trailDetailsMap);

                // fit bounds to track
                trailDetailsMap.fitBounds(boundsDetail);

                // Show data
                $("#data").html(
					'<h2><img width="35px" src="' + ActivityType.properties[track.activityType].icon_url + '"/>' + track.name + '</h2>' +
					'<div id="properties">' +
						'<img width="30px" style="margin-top:2px" src="img/distance_icon.png"/>' + round(track.distance_m / 1000, 1) + ' km</td>' +
						'<img width="20px" style="margin-top:8px" src="img/time_icon.png"/>' + track.estimatedTime_s.toString().toHHhMM() +
						'<img width="40px" style="margin-top:0px" src="img/elevation_gain_icon.png"/>' + round(track.elevationGain_m,0) + ' m</td>' +
						'<img width="40px" style="margin-top:0px" src="img/elevation_loss_icon.png"/>' + round(track.elevationLoss_m,0) + ' m' +
					'</div>');

            }
        })(marker, i));
    }
    map.fitBounds(bounds);
}
