
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
    return (radius * Math.acos(d));
};
