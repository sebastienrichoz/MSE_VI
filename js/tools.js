// Add one zero before minute i if smaller than 10
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Return the centroid of gps points in a keyvalue store containing lat and lng
function computeCentroid(points) {
    var latitude = 0;
    var longitude = 0;
    var n = points.length;
    for(i in points) {
        latitude += points[i].lat;
        longitude += points[i].lng;
    }
    return {lat: latitude/n, lng: longitude/n};
}

// return the distance between (lat1,lon1) and (lat2,lon2) in meter.
function GCDistance(lat1, lon1, lat2, lon2) {
    var radius = 6378137.0 ; // earth radius in meter
    var DE2RA = 0.01745329252; // degre to radian conversion
    if (lat1 == lat2 && lon1 == lon2) return 0;
    lat1 *= DE2RA;
    lon1 *= DE2RA;
    lat2 *= DE2RA;
    lon2 *= DE2RA;
    var d = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2);
    if (d >= 1)
        return 0;
    return (radius * Math.acos(d));
};

// https://stackoverflow.com/questions/7342957/how-do-you-round-to-1-decimal-place-in-javascript
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

String.prototype.toHHhMM = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    return hours+'h'+minutes;
}

// Return the estimated time in seconds for a specifix activity,
// distance, and elevations parameters.
// source: http://www.gr5.fr/temps_marche/index.html
function timeEstimation_s(activityType, distance_m,
    elevationGain_m, elevationLoss_m) {

    var A = (distance_m / 1000.0) / ActivityType.properties[activityType].flatSpeed_km_h;
    var B = (elevationGain_m / ActivityType.properties[activityType].climbSpeed_m_h) +
            (elevationLoss_m / ActivityType.properties[activityType].descentSpeed_m_h);

    var tmp = (A + B) / 2;

    // Convert result to time in seconds
    var h = Math.floor(tmp);
    tmp = (tmp - h) * 60;
    var m = Math.floor(tmp);
    var s = Math.round((tmp - m) * 60);

    return h*3600 + m*60 + s;
}

// Read gpx fileUrl and return a track
function getTrack(fileUrl) {
    var track;
    $.ajax({
        url: "gpx/" + fileUrl,
        dataType: "xml",
        async: false,
        success: function(xml) {

            var name;
            var activityType;
            var points = [];
            var centroid;
            var distance_m = 0.0;
            let elevations = [];
            let elevationGain_m = 0.0;
            let elevationLoss_m = 0.0;
            var estimatedTime_s = 0.0;
            let elevationGains = [];
            let elevationLosses = [];
            var estimatedTimes = [];
            var times = [];
			var distances = [];
            let gpx = "gpx/" + fileUrl;

            // Get name
            $(xml).find("name").each(function(){
                name = $(this).text();
            });

            // Get activity type
            $(xml).find("type").each(function(){
                var code = $(this).text();

                for (var i in ActivityType) {
                    if (code == ActivityType.properties[ActivityType[i]].code) {
                        activityType = ActivityType[i];
                        break;
                    }
                }
            });

            // Get points, elevations and times
            $(xml).find("trkpt").each(function() {
                var lat = $(this).attr("lat");
                var lon = $(this).attr("lon");
                points.push({lat: parseFloat(lat), lng: parseFloat(lon)});
                $(this).find("ele").each(function(){
                        elevations.push(parseFloat($(this).text()));
                    });
                $(this).find("time").each(function(){
                        times.push(Date.parse($(this).text()));
                 });
            });

            // Compute compute Centroid
            var centroid = computeCentroid(points);

            // Compute distance average and distances between each points
            var delta;
            for(var j = 0; j < points.length - 1; j++){
                // distance
				var d = GCDistance(points[j].lat, points[j].lng, points[j+1].lat, points[j+1].lng);
                distance_m += d;
				distances.push(distance_m);
            }

			// Compute speeds with jump 60
			var speeds_jump_60 = [];
            var jump = 60;
            for(var j = jump; j < distances.length; j+=jump){
				var d = distances[j] - distances[j-jump];
                speeds_jump_60.push((d/1000)/((times[j]-times[j-jump]) / 1000 / 3600));
            }

			// Compute altitudes with jump 60
			var altitudes_jump_60 = [];
            var jump = 60;
            for(var j = 0; j < elevations.length; j+=jump){
                // altitudes
                altitudes_jump_60.push(elevations[j]);
                if (j+jump > elevations.length){
                    altitudes_jump_60.push(elevations[elevations.length - 1]);
					break;
				}
            }

            // We can't compute elevation at each point because it becomes
            // irrelevant (usually to high) as the GPS hasn't a trustable
            // precision.
            // So we decided to take elevation at every 60 points which
            // represent one minute
            var len = elevations.length;
            var jump = 60;
            for(var j = 0; j < elevations.length - 1; j+=jump){
                // elevations
                if (j+jump > len)
                    break;
                delta = elevations[j+jump] - elevations[j];
				elevationGains.push(elevationGain_m);
				elevationLosses.push(elevationLoss_m);
                if (delta > 0)
                    elevationGain_m += delta;
                else
                    elevationLoss_m -= delta;
            }
			elevationGains.push(elevationGain_m);
			elevationLosses.push(elevationLoss_m);

			// Calculate estimated times at each points
			for(var j = 0; j < distances.length; j++){
				estimatedTimes.push(timeEstimation_s(activityType, distances[j],
					elevationGains[Math.floor(j/60)], elevationLosses[Math.floor(j/60)]));
			}

            // Compute time estimation
            estimatedTime_s = timeEstimation_s(activityType, distance_m,
                elevationGain_m, elevationLoss_m);

            track = new Track(name, activityType, points, distance_m, elevations,
                centroid, elevationGain_m, elevationLoss_m, estimatedTime_s,
                elevationGains, elevationLosses, estimatedTimes, times,
                distances, speeds_jump_60, altitudes_jump_60, gpx);
        }
    });
    return track;
}

// Read GPX files and return an array of tracks
function getTracks(filesUrl) {
    var tracks = [];
    for(var i = 0; i < filesUrl.length; i++) {
        tracks.push(getTrack(filesUrl[i]));
    }
    return tracks;
}

function Download(url) {
    document.getElementById('my_iframe').src = url;
};
