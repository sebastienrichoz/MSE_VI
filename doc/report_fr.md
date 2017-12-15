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

À la différence de ces solutions, Mountain Tracks Explorator se veut plus pertinant, selon nous, vis-à-vis de la présentation des données nécessaires à une préparation minimale mais complète d'un parcours en montagne, tout en accédant en un minimum d'étape l'information souhaitée.

## Conception

La phase de conception décrit les technologies utilisées, la source et le format des données, ainsi que l'architecture de l'application.

### Technologies

Ci-dessous sont présentées les technologies utilisées à l'élaboration de la visualisation.

#### HTML5, CSS3 et Javascript
Nous avons utilisé HTML5, CSS3 et Javascript afin d'avoir un développement simple et efficace ainsi que l'accès à beaucoup de librairies très utiles.

![Javascript, CSS3 & HTML5](img/htmljscss.png?raw=true)

#### Google Maps

L'application utilise l'API javascript de Google Maps afin d'afficher la carte, les tracés etc.
Nous avons hésité entre l'utilisation de Google Maps et de Open Street Maps. Ayant de meilleures connaissances dans l'utilisation de Google Maps nous avons décidé de commencer par ça. Nous aimerions bien ajouté la possibilité de choisir Open Street Maps pour l'affichage de différents calques (privilégiant le relief ou la vision satellite par exemple) selon les envies de l'utilisateur.

![Google Maps API](img/googlemapsapi.png?raw=true)

#### jQuery

Nous avons utilisé la librairie jQuery. Elle permet de manipuler facilement les objets du DOM et nous a donc simplifier la tâche plutôt que d'avoir tout écrit en Javascript.

![jQuery](img/jquery.jpg?raw=true)

#### Bootstrap

Nous avons utilisé Bootstrap pour certaines parties de la mise en page.

![Bootstrap](img/bootstrap.png?raw=true)

#### ChartJS

Nous avons utilisé ChartJS pour l'affichage des graphiques de la météo.

![ChartJS](img/chartjs.png?raw=true)

#### D3.js

Nous avons utilisé D3.js pour l'affichage du graphique du profil altimétrique.

![D3JS](img/d3.png?raw=true)

### Source et format des données
Deux différentes sources de données ont été utilisées : une pour les parcours et l'autre pour les prévisions météo.

#### Les parcours

Les parcours sont stockés dans des fichiers GPX (GPS eXchange Format). Ce sont des fichiers au format XML qui contiennent plusieurs informations dont une liste de points qui représente le parcours. Chaque point contient une latitude, une longitude, une altitude et un temps.

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

On peut voir dans la balise `trk` les propriétés nom et type du parcours. Ensuite la balise `trkseg` contient les balises de chaque point. La balise `trkpt` a l'attribut `lat` et `lon` pour la latitude et la longitude. Et il contient les éléments `ele` et `time` pour l'alitude et le temps.

#### Prévisions météo

### Architecture

## Réalisation

Cette phase de réalisation décrit comment les données ont été traitées afin de mettre en avant certains problèmes engendrés par celles-ci.

- Filtrage des .gpx
    - calcul du dénivelé (tout les t secondes sinon imprécis)
    - profil altimétrique (tout les t secondes sinon trop précis et lent)
- Estimation de la durée (ce n'est qu'une estimation!)
- screenshot final de la visu

### Graphique du profil altimétrique

Nous avons réalisé un graphique qui montre le profil altimétrique du parcours à l'aide de d3js. Il représente la hauteur sur l'axe y et la distance sur l'axe x. Ce profile permet de voir assez facilement la montée et la descente à réaliser ainsi que la pente à chaque endroit du parcours. Lorsque la souris de l'utilisateur passe sur le graphique altimétrique, plusieurs informations sont affichées en fonction de la position sur l'axe x (distance). Sur la carte Google Maps en bas à gauche est affiché la position dans le parcours par rapport à la position de la souris de l'utilisateur à l'aide d'un rond bleu en fonction. 4 barres de progression affichent les informations sur le graphique en fonction de la position de la souris sur le graphique. Les informations affichées par ces 4 barres sont la distance, la montée, la descente et la durée.

Le profile altimétrique est un assez bonne indicateur de la difficulté du chemin et il peut être également utile pour les personnes à mobilité réduite pour savoir s'ils peuvent le faire.

On peut voir dans l'image ci-dessous comment

![Graphique altimétrique avec hover de la souris](img/altimetry_profile_hover.png?raw=true "Graphique altimétrique avec hover de la souris")

Afin d'afficher la pente nous avons essayé d'afficher un triangle rectangle représentant la pente à chaque point du graphe. Nous avons ensuite décidé de ne pas le garder car dans le cas d'une pente très forte il devient très grand et la localisation GPS n'étant pas toujours très précise il peut arriver que la distance parcourue soit petite mais la différence d'alitutde soit très grande. Nous avons aussi décidé que le graphique du profile altimétrique suffisait pour déterminer la pente à chaque endroit.

Voilà à quoi ressemblait le prototype de la pente en fonction de la position de la souris sur le graphique.

![Affichage de la pente](img/gradient.png?raw=true "Affichage de la pente")

Nous avions commencé par utiliser des doughnut charts au lieu des progress bars en pensant d'abord à un aspect esthétique. Nous avons ensuite réalisés que les progress bar permettait une meilleure comparaison des différentes propriétés. Voilà à quoi ressemblait le prototype des doughnut charts.

![Doughnut chart](img/doughnut.png?raw=true "Doughnut chart")

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
