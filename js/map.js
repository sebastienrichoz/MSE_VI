function initMap() {
    var customStyled =
    [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ebe3cd"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#523735"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f1e6"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#c9b2a6"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#dcd2be"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ae9e90"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#93817c"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.government",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#a5b076"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#447530"
                }
            ]
        },
        {
            "featureType": "poi.school",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f1e6"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#fdfcf8"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f8c967"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#e9bc62"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e98d58"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#db8555"
                }
            ]
        },
        {
            "featureType": "road.local",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#806b63"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#8f7d77"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#ebe3cd"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#b9d3c2"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#92998d"
                }
            ]
        }
    ]
    var myLatLng = {lat: -25.363, lng: 131.044};
    var bounds = new google.maps.LatLngBounds();
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        streetViewControl: false,
    });
    map.set('styles',customStyled);




    var files = ['VTT_2017-05-25_10-00-01.gpx',
    'VTT_2017-09-10_17-12-49.gpx',
    'VTT_2017-09-13_16-22-44.gpx',
    'VTT_2017-09-15_10-17-33.gpx',
    'VTT_2017-09-22_09-11-32.gpx'];
    var gpxs = [];
    for(var i = 0; i < files.length; i++){
        $.ajax({
            url: "gpx/" + files[i],
            dataType: "xml",
            async: false,
            success: function(xml) {
                var points = [];
                $(xml).find("trkpt").each(function() {
                    var lat = $(this).attr("lat");
                    var lon = $(this).attr("lon");
                    points.push({lat: parseFloat(lat), lng: parseFloat(lon)});
                });
                gpxs.push(points);
                var marker = new google.maps.Marker({
                    position: computeCentroid(points),
                    map: map,
                    title: files[i]
                });
                bounds.extend(marker.position);

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        $("#map").width("50%");
                        $("#data").show();
                        $("#trail-details").show();
                        console.log(marker);
                        google.maps.event.trigger(map, 'resize');
                        map.setCenter(marker.position);

                        var totalDistance = 0;
                        for(var j = 0; j < points.length - 1; j++){
                            totalDistance += GCDistance(points[j].lat, points[j].lng, points[j+1].lat, points[j+1].lng);
                        }
                        $("#distance").text(Math.floor(totalDistance) + "m");


                        // Show trail
                        var trailDetails = new google.maps.Map(document.getElementById("trail-details"), {
                            mapTypeId: google.maps.MapTypeId.TERRAIN,
                            streetViewControl: false,
                        });
                        trailDetails.set('styles',customStyled);
                        console.log(files[i]);


                        var p = [];
                        var bounds = new google.maps.LatLngBounds ();
                        for(var j in gpxs[i]){
                            p.push(gpxs[i][j]);
                            bounds.extend(gpxs[i][j]);
                        }
                        var poly = new google.maps.Polyline({
                            // use your own style here
                            path: p,
                            strokeColor: "#FF00AA",
                            strokeOpacity: .7,
                            strokeWeight: 4
                        });

                        poly.setMap(trailDetails);

                        // fit bounds to track
                        trailDetails.fitBounds(bounds);

                        // Show data
                        $('#title').text(files[i]);

                    }
                })(marker, i));
            }
        });
    }
    map.fitBounds(bounds);
}
