$(document).ready(function() {
  L.mapbox.accessToken = 'pk.eyJ1IjoiYWxla2diZyIsImEiOiJCUUs2UVlRIn0.O4MCWY-5DPT3p3eMidpcuQ';
  
  var Map = function () {
    this.map = L.mapbox.map('map')
      .setView([40, -100], 5)
      .addLayer(L.mapbox.tileLayer('mapbox.streets'));
    this.geocoder = L.mapbox.geocoder('mapbox.places');
  };

  // var map = L.mapbox.map('map')
  //     .setView([40, -100], 5)
  //     .addLayer(L.mapbox.tileLayer('mapbox.streets'));

  // var geocoder = L.mapbox.geocoder('mapbox.places');

  var StartUp = function(name, location) {
    this.latlng = '',
    this.location = location,
    this.name = name
  }

  StartUp.prototype = {
    assignLatLng: function(err, data) {
      this.latlng = L.latLng(data.latlng[0], data.latlng[1] );
      mapIt(this);
      console.log(this.latlng);
    }, 
    initFromBundle: function(array) {
      for (idx in array) {
        var company = array[idx];
        if ( company.locations !== undefined && company.locations[0] !== undefined) {
          var startUp = new StartUp(company.name, company.locations[0]['display_name']);
          map.geocoder.query(startUp.location, startUp.assignLatLng.bind(startUp));
        }
      }
    }
  }

  var markers = new L.MarkerClusterGroup();

  var mapIt = function(startUp) {
    var marker = L.marker(startUp.latlng, {
        icon: L.mapbox.marker.icon({
          'title': startUp.name,
          'marker-color': '#f44',
          'marker-symbol': 'star',
          'marker-size': 'medium'
        })
      });
    markers.addLayer(marker);
  };

  var startUpData = function(id) {
    $.ajax({
      dataType: 'jsonp',
      url: 'https://api.angel.co/1/tags/3/startups'
    }).done(function(data) {
      StartUp.prototype.initFromBundle(data.startups);
    }).fail(function() {
      console.log('error');
    });
  };

  L.mapbox.featureLayer('alekgbg.ldc3jgl3').on('ready', function(e) {
    // The clusterGroup gets each marker in the group added to it
    // once loaded, and then is added to the map
    var clusterGroup = new L.MarkerClusterGroup();
    e.target.eachLayer(function(layer) {
        clusterGroup.addLayer(layer);
    });
    map.map.addLayer(markers);
  });

  var map = new Map();
  startUpData();





});