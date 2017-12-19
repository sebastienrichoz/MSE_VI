# Projet VI - Mountain Tracks Explorator

*Octobre - décembre 2017*

**Groupe**
- Antoine Drabble <antoine.drabble@master.hes-so.ch>
- Sébastien Richoz <sebastien.richoz@master.hes-so.ch>

**Public cible** : Toute personne à la recherche d’activités en montagne

**Intention/objectif** : Aider les personnes à la recherche d’activités en montagne à trouver des parcours (VTT, randonnée, ski, ...) en les explorant sur une carte en 2D.

**Source de données** : BikingSpots.ch et la montre à Sébastien (fichiers GPX) + https://www.prevision-meteo.ch/services pour les données météo.

**Technologie** : Javascript & HTML & CSS

**Court descriptif** :  Visualisation des parcours à l’aide de l’API de Google Maps avec détails de ceux-ci (profil altimétrique, distance...).

# Table des matières

1. [Introduction](#introduction)
2. [Etat de l'art](#%C3%89tat-de-lart)
3. [Conception](#conception)
   - [Technologies](#technologies)
   - [Source et format des données](#source-et-format-des-donnees)
   - [Architecture](#architecture)
4. [Réalisation](#realisation)
   - [Choix des couleurs](#choix-des-couleurs)
   - [Graphique du profil altimétrique](#graphique-du-profil-altimetrique)
   - [Graphique des prévisions météos](#graphique-des-previsions-meteos)
5. [Installation](#installation)
6. [Mode d'emploi](#mode-demploi)

## Introduction

Ce travail a pour but de réaliser une interface web interactive pour la recherche d’activités en montagne (VTT, randonnée, ski de randonnée) avec des fonctionnalités adaptées à ce genre de pratiques :

- Visualisation des parcours sur une carte
- Affichage du profil altimétrique du parcours
- Possibilité d’exporter le parcours au format GPX pour sa montre/smartphone ou de l'imprimer.
- etc.

L'idée consiste à répondre aux besoins d'utilisateurs voulant choisir et se préparer à une activité sportive avant de la pratiquer. Nous considérons que ces personnes se préparent entre une heure et cinq jours avant le début de leur activité.

L'application permettra de filtrer les activités et d’obtenir des informations détaillées sur chacune d’elles tout en gardant une visualisation générale afin de pouvoir rapidement changer de parcours.

Voici un aperçu de l'application:

![Aperçu de l'application](img/app.png?raw=true "Aperçu de l'application")

## État de l'art

Il existe déjà beaucoup d'applications offrant ce genre de fonctionnalités. Parmi elles nous distinguons deux grandes catégories : les préparateurs de parcours et les traqueurs d'activité.

Les préparateurs de parcours concernent la phase se déroulant **avant** l'activité à savoir la recherche de parcours, l'organisation, la préparation à celui-ci, etc. Suisse Mobile (http://www.schweizmobil.ch/fr/hiver.html) en fait partie. Ces applications affichent les mêmes données pour tous les utilisateurs.

Les traqueurs d'activité concernent quant à eux la phase se déroulant **après** l'activité à savoir la visualisation de son parcours et de ses performances (vitesse, temps de course par exemple). Ce sont des applications affichant des données spécifiques à chaque utilisateur. Garmin, Polar, Fitbit, Strava sont des exemples de traqueurs d'activité qui disposent d'une application mobile ou d'une montre adaptée pour la récolte de données.

Le projet développé durant ce cours entre dans la catégorie des préparateurs de parcours. Les solutions trouvées sur le web sont à notre goût incomplètes au niveau du regroupement des informations : certaines manquent ou sont incomplètes et d'autres sont de trop. De plus, il faut souvent cliquer sur plusieurs boutons/liens avant d'arriver à l'information souhaitée. Finalement l'utilisateur se perd et est contraint de récolter l'informations sur plusieurs sites web afin de préparer correctement son parcours.

À la différence de ces solutions, Mountain Tracks Explorator se veut plus pertinant, selon nous, vis-à-vis de la présentation des données nécessaires à une préparation minimale mais complète d'un parcours en montagne, tout en accédant en un minimum d'étape à l'information souhaitée.

## Conception

La phase de conception décrit les technologies utilisées, la source et le format des données, ainsi que l'architecture de l'application.

### Technologies

Ci-dessous sont présentées les technologies utilisées à l'élaboration de la visualisation.

#### HTML5, CSS3 et Javascript
Nous avons utilisé HTML5, CSS3 et Javascript afin d'avoir un développement simple et efficace ainsi que l'accès à beaucoup de librairies très utiles.

![Javascript, CSS3 & HTML5](img/htmljscss.png?raw=true)

#### Google Maps

L'application utilise l'[API](https://developers.google.com/maps/?hl=fr) javascript de Google Maps afin d'afficher la carte, les tracés etc.
Nous avons hésité entre l'utilisation de Google Maps et de Open Street Maps. Ayant de meilleures connaissances dans l'utilisation de Google Maps nous avons décidé de commencer par ça. Nous aimerions bien ajouté la possibilité de choisir Open Street Maps pour l'affichage de différents calques (privilégiant le relief ou la vision satellite par exemple) selon les envies de l'utilisateur.

![Google Maps API](img/googlemapsapi.png?raw=true)

#### jQuery

Nous avons utilisé la librairie [jQuery](https://jquery.com/). Elle permet de manipuler facilement les objets du DOM et nous a donc simplifier la tâche plutôt que d'avoir tout écrit en Javascript.

#### jQuery UI

Nous avons utilisé la librairie [jQuery UI](https://jqueryui.com/) afin d'afficher les sliders permettant de chosir les valeurs minimales et maximales des filtres.

![jQuery](img/jquery.jpg?raw=true)

#### Bootstrap

Nous avons utilisé [Bootstrap](https://getbootstrap.com/) pour certaines parties de la mise en page.

![Bootstrap](img/bootstrap.png?raw=true)

#### ChartJS

Nous avons utilisé [Chartjs](http://www.chartjs.org/) pour l'affichage des graphiques de la météo.

![ChartJS](img/chartjs.png?raw=true)

#### D3.js

Nous avons utilisé [D3.js](https://d3js.org/) pour l'affichage du graphique du profil altimétrique.

![D3JS](img/d3.png?raw=true)

### Source et format des données
Deux différentes sources de données ont été utilisées : une pour les parcours et l'autre pour les prévisions météo.

#### Les parcours

Les parcours sont stockés dans des fichiers GPX (GPS eXchange Format). Ce sont des fichiers au format XML qui contiennent plusieurs informations dont une liste de points qui représentent le parcours. Chaque point contient une latitude, une longitude, une altitude et un temps.

Voici un exemple de fichier GPX.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Polar Flow">
  <trk>
      <name>L'Isle - Croix</name>
      <type>mtb</type>
    
      <trkseg>
        <trkpt lat="46.61722967" lon="6.41248367">
          <ele>676.0</ele>
          <time>2017-09-10T18:12:53.000Z</time>
        </trkpt>
        <trkpt lat="46.61722967" lon="6.41248367">
          <ele>676.0</ele>
          <time>2017-09-10T18:12:54.000Z</time>
        </trkpt>
        <trkpt lat="46.61725133" lon="6.41251817">
          <ele>675.0</ele>
          <time>2017-09-10T18:12:55.000Z</time>
        </trkpt>
        <trkpt lat="46.617277" lon="6.41254933">
          <ele>673.0</ele>
          <time>2017-09-10T18:12:56.000Z</time>
        </trkpt>

        [...]

      </trkseg>
  </trk>
</gpx>
```

Description des balises utilisées :

- `<trk>` contient les informations sur le parcours
  - `<name>` est le nom résumant le parcours
  - `<type>` permet de différencier les trois types de parcours à savoir **mtb | hiking | skitouring**
  - `<trkseg>` contient les les points du parcours, appelés "trackpoints".
    - `<trkpt>` possède l'attribut `lat` et `lon` pour la latitude et la longitude.
      - `<ele>` est l'altitude.
      - `<time>` est le temps auquel le "trackpoint" a été mesuré

##### Filtrage des données GPX

Il existe encore d'autres balises qui viennent compléter le format GPX mais nous n'en avons pas besoin. Seuls le nom et le type du parcours ainsi que tous les "trackpoints" avec leur latitude, longitude et altitude nous sont utiles pour la représentation des parcours.

Le nombre de "trackpoints" est également conséquent (un point mesuré toutes les secondes) et alourdit l'application. Dans l'état des choses, tous les points sont pris en compte bien que seulement un dixième aurait suffit. La visualisation reste pour le moment agréable étant donnée du petit nombre de parcours présentés (une dizaine). À l'avenir il serait indispensable de ne représenter qu'un faible pourcentage de ces points pour des raisons de performance et obtenir ainsi une interaction toujours très réactive.

#### Prévisions météo

Les prévisions météo ont été récoltées sur l'API publique et gratuite de [https://www.prevision-meteo.ch/services](https://www.prevision-meteo.ch/services). La requête consiste à fournir un point GPS (lat + lon) et retourne un objet JSON contenant les prévisions météo détaillées du jour J0 (jour courant) au jour J+4.

L'objet JSON est très complet. Pour simplifier, seules les données utilisées sont décrites :

```json
{
  // Altitude du point de mesure
  "forecast_info": {
    "elevation": "725.44"
  },
  
  // Conditions actuelles
  "current_condition": {
    "date": "19.12.2017",
    "hour": "19:00",
    "tmp": -6, // Température en °C
    "condition": "Nuit nuageuse",
    "icon": "https://www.prevision-meteo.ch/style/images/icon/nuit-nuageuse.png",
  },
  
  // Prévisions du jour actuel
  "fcst_day_0": {
    "date": "19.12.2017",
    "day_long": "Mardi",
    "tmin": -7, // Température minimum en °C
    "tmax": -1, // Température maximum en °C
    "icon": "https://www.prevision-meteo.ch/style/images/icon/stratus-se-dissipant.png",
    
    // Prévision pour chaque heure de la journée
    "hourly_data": {
      "0H00": {
        "ICON": "https://www.prevision-meteo.ch/style/images/icon/nuit-claire-et-stratus.png",
        "TMP2m": -6.5, // Température [°C]
        "APCPsfc": 0, // Précipitations [mm] (pluie)
      },
      // ...
      "23H00": { /*... */ }
    }
  },
  
  // Prévisions des jours suivants
  "fcst_day_1" : { /* ... */ },
  "fcst_day_2" : { /* ... */ },
  "fcst_day_3" : { /* ... */ },
  "fcst_day_4" : { /* ... */ }
}
```

L' API limite la latitude entre 41.3 et 51.9 et la longitude entre -5.2 and 10.7 ce qui correspond au fenêtrage suivant :

![window-forecast](/Users/sebastien/Documents/MSE/VI/MSE_VI/doc/img/window-forecast.png)

Si un parcours se trouve en dehors de cette zone, la météo ne pourra pas être récupérées et l'application retournera un message d'erreur en lieu et place du graphe des prévisions météo :

![forecast-error](/Users/sebastien/Documents/MSE/VI/MSE_VI/doc/img/forecast-error.png)

### Architecture

## Réalisation

Cette phase de réalisation décrit comment les données ont été traitées afin de mettre en avant certains problèmes engendrés par celles-ci.

- Filtrage des .gpx
    - calcul du dénivelé (tout les t secondes sinon imprécis)
    - profil altimétrique (tout les t secondes sinon trop précis et lent)
- Estimation de la durée (ce n'est qu'une estimation!)
- screenshot final de la visu

### Choix des couleurs

Nous avons choisi d'utiliser une palette de couleurs disponible sur l'application [kuler](https://color.adobe.com/fr/Color-Blind-Safe-Colors-color-theme-8074910). Cette palette est color blind friendly et devrait donc permettre à un maximum de personnes d'utiliser les couleurs comme repères dans l'application. Nous n'avons malheureusement pas pu modifier les couleurs de Google Maps pour qu'elle soit accordée à cette palette de couleur.

![Palette de couleurs](img/colors.png?raw=true)

### Graphique du profil altimétrique

Nous avons réalisé un graphique qui montre le profil altimétrique du parcours à l'aide de d3js. Il représente l'altitude en mètre sur l'axe y et la distance en mètre sur l'axe x. Ce profil permet de voir assez facilement la montée et la descente à réaliser ainsi que la pente à chaque endroit du parcours. Lorsque la souris de l'utilisateur passe sur le graphique altimétrique, plusieurs informations sont affichées en fonction de la position sur l'axe x (distance). Sur la carte Google Maps en bas à gauche est affichée la position dans le parcours par rapport à la position de la souris de l'utilisateur à l'aide d'un rond bleu. 4 barres de progression affichent les informations sur le graphique en fonction de la position de la souris sur le graphique. Les informations affichées par ces 4 barres sont la distance [m], la montée cumulée [m], la descente cumulée [m] et la durée [hh:mm].

Le profil altimétrique est un bon indicateur de la difficulté du chemin et il peut être également utile pour les personnes à mobilité réduite pour savoir s'ils peuvent le faire.

L'image ci-dessous montre l'apparition du marqueur bleu sur le tracé en fonction de la position de la souris sur le profil altimétrique.

![Graphique altimétrique avec hover de la souris](img/altimetry_profile_hover.png?raw=true "Graphique altimétrique avec hover de la souris")

Afin d'afficher la pente nous avons essayé d'afficher un triangle rectangle représentant la pente à chaque point du graphe. Nous avons ensuite décidé de ne pas le garder car dans le cas d'une pente très forte il devient très grand et la localisation GPS n'étant pas toujours très précise il peut arriver que la distance parcourue soit petite mais la différence d'alitutde soit très grande. Nous avons aussi décidé que le graphique du profil altimétrique suffisait pour déterminer la pente à chaque endroit.

Cependant l'avantage du graphe de la pente est qu'il donnait une visualisation instantannée de la déclivité de celle-ci, l'échelle du profil altimétrique pouvant fausser son interprétation. Voilà à quoi ressemblait le prototype de la pente en fonction de la position de la souris sur le graphique.

![Affichage de la pente](img/gradient.png?raw=true "Affichage de la pente")

Nous avions commencé par utiliser des doughnut charts au lieu des progress bars en pensant d'abord à un aspect esthétique. Nous avons ensuite réalisé que les progress bar permettaient une meilleure comparaison des différentes propriétés. Voilà à quoi ressemblait le prototype des doughnut charts.

![Doughnut chart](img/doughnut.png?raw=true "Doughnut chart")

### Graphique des prévisions météo

Etant donné qu'une préparation implique souvent la consultation de la météo, cette information est fournie pour chaque parcours du jour actuel J0 au jour J+4. Bien que beaucoup de données sont à disposition comme la température, les précipitations, la vitesse du vent, le taux d'humidité, etc., nous avons décidé de ne retenir que la température [°C] et les précipitations de pluie [mm/h] car ce sont selon nous les éléments les plus importantes à la pratique d'activités outdoor.

Le graphe montre la température et les précipitations à chaque heure de la journée. La température est représentée par une courbe pour montrer l'évolution de celle-ci. Les barres verticales pour les précipitations se prêtent bien à la symbolique d'accumulation d'eau. Pour les couleurs, le bleu est bien assimilé à de l'eau et le rouge correspond à une température mais plutôt chaude. Nous l'avons tout de même laissé ainsi car elle se différencie bien des précipitations. Au survol des données, une pop-up noire affiche le détail des précipitations et de la température à l'heure spécifiée.

![weather-graph](/Users/sebastien/Documents/MSE/VI/MSE_VI/doc/img/weather-graph.png)

Lorsque le graphe est survolé, le marqueur orange sur le tracé s'affichent pour indiquer le point de mesure de la météo. En effet, en montagne, la température dépend beaucoup de l'altitude et il est important de savoir à quelle hauteur elle est mesurée. Le choix du point de mesure correspond à la centroïde du parcours.

![weather-mesure](/Users/sebastien/Documents/MSE/VI/MSE_VI/doc/img/weather-mesure.png)

#### Améliorations possibles

Nous avons envisagé d'implémenter une heat map affichant les précipitations à chaque heure au survol du graphe afin que l'utilisateur puisse visualiser leurs évolutions au long de la journés. Il s'est avéré que cela impliquait près de 20 requêtes à l'API météo par jour par parcours, ce qui risquait de ralentir l'application et de complexifier le projet. Par ailleurs l'API n'est probablement pas assez précise pour fournir des données météos différentes entre deux points GPS distants de quelques centaines de mètres, ce qui rend l'implémentation d'une heatmap peu relevante.

## Installation

**L'installation nécessite la version 3 de python.**

Le projet est stocké sur le repository github https://github.com/sebastienrichoz/MSE_VI.
- Télécharger son contenu
- Dans le dossier racine `$ cd MSE_VI`,
- Exécuter `$ python -m http.server`
- L'application est alors disponible sur `http://localhost:8000/`

## Mode d'emploi
L'application devrait être suffisament simple d'utilisation. Lorsqu'un marqueur est survolé il affiche des données générales et lorsqu'il est cliqué des données plus détaillées apparaissent sur la droite de l'écran. En survolant le profil altimétrique on obtient une interaction avec le tracé du parcours (un marqueur suit le tracé selon le positionnement du curseur sur le profil altimétrique).

Le graphique météo donne des informations météorologiques entre le jour J et J+4. Le point de mesure est affiché par un marqueur orange muni d'une icône thermomètre et correspond à la centroïde du tracé. Le graphique fournit la température et la quantité de précépitation pour toutes les heures de chaque jour.
