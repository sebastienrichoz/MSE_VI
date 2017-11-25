var ActivityType = {
  MTB: 1,
  HIKING: 2,
  SKITOUR: 3,
  OTHER: 4,
  properties: {
    1: {
        name: "VTT",
        marker_url: "img/mtb_marker.png",
        icon_url: "img/mtb_icon.png",
        code: "mtb",
        flatSpeed_km_h: 18.0,
        climbSpeed_m_h: 500.0,
        descentSpeed_m_h: 1600.0},
    2: {
        name: "Randonnée",
        marker_url: "img/hiking_marker.png",
        icon_url: "img/hiking_icon.png",
        code: "hiking",
        flatSpeed_km_h: 4.0,
        climbSpeed_m_h: 200.0,
        descentSpeed_m_h: 600.0},
    3: {
        name: "Ski de randonnée",
        marker_url: "img/skitour_marker.png",
        icon_url: "img/skitour_icon.png",
        code: "skitour",
        flatSpeed_km_h: 4.0,
        climbSpeed_m_h: 400.0,
        descentSpeed_m_h: 1600.0},
    4: {
        name: "Autre",
        marker_url: "TODO",
        icon_url: "TODO",
        code: "other",
        flatSpeed_km_h: 4.0,
        climbSpeed_m_h: 200.0,
        descentSpeed_m_h: 600.0}
  }
};

class Track {
    /**
     * name: name of the track
     * type: ActivityType (MTB|HIKING|SKITOURING)
     * points: [{
     *      lat: parseFloat(lat),
     *      lng: parseFloat(lon),
     * }]
     * distance_m: total distance of the track in meters
     * elevations: Array of elevations of the track (in meter)
     * elevation_gain_m: Total of positive elevation of the track
     * elevation_loss: Total of negative elevation of the track
     * estimatedTime_s: total estimated time of the track in seconds
     * times: Array of Date
     */
    constructor(name, activityType, points, distance_m, elevations,
                elevationGain_m, elevationLoss_m, estimatedTime_s, times) {
        this.name = name;
        this.activityType = activityType;
        this.points = points;
        this.distance_m = distance_m;
        this.elevations = elevations;
        this.elevationGain_m = elevationGain_m;
        this.elevationLoss_m = elevationLoss_m;
        this.estimatedTime_s = estimatedTime_s;
        this.times = times;
    }


};
