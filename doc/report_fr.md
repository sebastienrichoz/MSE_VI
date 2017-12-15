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
Afin de déployer rapidement la visualisation, celle-ci a été développée en Javascript, HTML5 et CSS3 avec utilisation de l’API Google maps et des librairies d3js ainsi que chartjs pour les graphes.

### Source et format des données

#### Les parcours

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
L'application devrait être suffisament simple d'utilisation. Lorsqu'un marqueur est survolé il affiche des données générales et lorsqu'il est cliqué des données plus détaillées apparaissent sur la droite de l'écran. En survolant le profil altimétrique on obtient une interaction avec le tracé du parcours (un point suit le profil altimétrique selon le positionnement du curseur).
