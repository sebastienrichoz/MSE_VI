# Mountain Tracks Explorator

This app let users explore different mountain activities like mountain bike, hiking or skitouring on a 2D google map in order to find their specific track for their personal activity.

- Landing page : [https://sebastienrichoz.github.io/MSE_VI/](https://sebastienrichoz.github.io/MSE_VI/)
- Direct link to application : [https://mountain-tracks-explorator.herokuapp.com/](https://mountain-tracks-explorator.herokuapp.com/)

![Aperçu de l'application](doc/img/app.png?raw=true "Aperçu de l'application")

## Technologies
HTML5, CSS3, Javascript.

Libraries/framework : [Bootstrap](https://getbootstrap.com/), [D3.js](https://d3js.org/), [Chartjs](http://www.chartjs.org/), [Google Maps API](https://developers.google.com/maps/?hl=fr), [jQuery](https://jquery.com/), [jQuery UI](https://jqueryui.com/)

## Data sources
- For the tracks, we used the gpx files from our own activities.
- The weather forecasts come from `https://www.prevision-meteo.ch/services`.
  - limitation of latitude between 41.3 and 51.9 and longitude between -5.2 and 10.7

## Development
If you have an http server supporting PHP (Xampp, Mampp, Wampp, ...)
- Clone this repo
- Place its content in your server
- Identifiy `<script>` tag loading google map api and change the link with your own API key.
- Run index.php in your browser

Without server supporting PHP
- Clone the repo
- Enable local file access in your browser
  - chrome on mac `$ open /Applications/Google\ Chrome.app --args --allow-file-access-from-files`
- Rename index.php into index.html page and add your Google Map API key

## Authors
- Antoine Drabble <antoine.drabble@master.hes-so.ch>
- Sébastien Richoz <sebastien.richoz@master.hes-so.ch>
