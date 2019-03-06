'use strict'        // let the browser know we're serious

// debug statement letting us know the file is loaded
console.log('Loaded map.js')

// your mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoidmFub2RvbSIsImEiOiJjanNndmRsYjcxdXpvNGFvYXZrM3ZqZTU3In0.AufqiUBrMbrHLFmUOX5Viw'

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/vanodom/cjsqb4l938jyn1fs856uwuz02',
})

// create an instance of NavigationControl
let navigation = new mapboxgl.NavigationControl({
    showCompass: false
})

// add the navigation to your map
map.addControl(navigation, 'top-left')

// create an instance of ScaleControl
let scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
})

// add the scale to your map
map.addControl(scale, 'bottom-right')

let geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserLocation: true,
    fitBoundsOptions: {
    }
})

map.addControl(geolocate, 'top-left')

// this is an event handler

geolocate.on('geolocate', function(event) {
    let current_location = [event.coords.longitude, event.coords.latitude]


    // get the rat-sightings from the layer data
    let features = map.queryRenderedFeatures({ layers: ['rat-sightings'] })
    console.log(features)

    // get the location of the click
    //let current_location = [event.lngLat.lng, event.lngLat.lat]
    //console.log("Click location:", current_location)

    // if there aren't any features, don't continue
    if (features.length == 0) return

    // create variables to hold the closest feature found so far
    let closest_distance = Infinity
    let closest_feature = null

    // we're going to check each feature
    for (let feature of features) {

        // calculate the distance using turf
        let distance = turf.distance(turf.point(feature.geometry.coordinates), turf.point(current_location))

        // if the distance is less than the closest distance we've seen so far, update the variables
        if (distance < closest_distance) {
            closest_distance = distance
            closest_feature = feature
        }        

    }

    // closest_distance should now be set to the minimum value test
    // closest_feature should be set to the feature itself
    console.log("Closest feature:", closest_feature.geometry.coordinates, "(", closest_distance, "m)")

    // additional handler code goes here
   // calculate bearing
    let bearing = turf.bearing(turf.point(current_location), turf.point(closest_feature.geometry.coordinates))
    console.log("Bearing:", bearing)

    // turn the pointer in that direction
    var pointer = document.getElementById('pointer')
    pointer.style.transform = 'rotate(' + bearing + 'deg)'

    map.flyTo({ center: current_location })
})