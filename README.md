# Mountain Track Explorator

This app let users explore different mountain activities like mountain bike, hiking or skitouring on a 2D google map in order to find their specific track for their personal activity.

TODO screenshot of app

## Technologies
HTML5, CSS3, Javascript.

Libraries/framework : [bootstrap](https://getbootstrap.com/), [d3js](https://d3js.org/)

## Data sources
- For the tracks, we used the gpx files from our own activities.
- The weather forecasts come from `https://www.prevision-meteo.ch/services`.
  - limitation of latitude between 41.3 and 51.9 and longitude between -5.2 and 10.7

## Requirements
For running the app python 3 is needed.

## Development
- Enable local file access in your browser
  - chrome on mac `$ open /Applications/Google\ Chrome.app --args --allow-file-access-from-files`
- Open index.html page

TODO livereload python http server

## Run the app
- Download this repo on your machine
- cd `MSE_VI`
- `python -m http.server` to start a local http server serving the folder
- Browse to `http://localhost:8000/`

## Authors
- Antoine Drabble <antoine.drabble@master.hes-so.ch>
- Faten Labidi <faten.labidi@master.hes-so.ch>
- Sébastien Richoz <sebastien.richoz@master.hes-so.ch>
