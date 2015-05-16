$(document).ready(function() {
  L.mapbox.accessToken = 'pk.eyJ1IjoiYWxla2diZyIsImEiOiJCUUs2UVlRIn0.O4MCWY-5DPT3p3eMidpcuQ';
  
  var Map = function () {
    this.map = L.mapbox.map('map')
      .setView([40, -100], 4)
      .addLayer(L.mapbox.tileLayer('mapbox.streets'));
    this.geocoder = L.mapbox.geocoder('mapbox.places');
  };

  Map.prototype = {
    mapIt: function(startUp) {
      var marker = L.marker(startUp.latlng, {
          icon: L.mapbox.marker.icon({
            'title': startUp.name,
            'marker-color': '#f44',
            'marker-symbol': 'star',
            'marker-size': 'medium'
          })
        });
      markers.addLayer(marker);
    },
    startUpData: function(id) {
      $.ajax({
        dataType: 'jsonp',
        url: 'https://api.angel.co/1/tags/' + id + '/startups'
      }).done(function(data) {
        StartUp.prototype.initFromBundle(data.startups);
      }).fail(function() {
        console.log('error');
      });
    }, 
    searchBox: function() {
      $('.form').submit(function(event) {
        event.preventDefault();
        var searchQ = $("#query").val();
        $.ajax({
          dataType: 'jsonp',
          url: 'https://api.angel.co/1/search?query=' + searchQ + '&type=MarketTag'
            }).done(function(data) {
              tagNum = data[0].id;
              map.startUpData(tagNum);
            }).fail(function() {
          console.log('error');
        });
        $('.startups-list').html("");
      });
    }, 
    addLayer: function() {
      var markers = new L.MarkerClusterGroup();
        L.mapbox.featureLayer('alekgbg.ldc3jgl3').on('ready', function(e) {
      var clusterGroup = new L.MarkerClusterGroup();
      e.target.eachLayer(function(layer) {
        clusterGroup.addLayer(layer);
      });
      this.map.addLayer(markers);
      });
    }
  };

  var StartUp = function(name, location, markets) {
    this.latlng = '';
    this.location = location;
    this.name = name;
    this.markets = markets; 
  };

  StartUp.prototype = {
    assignLatLng: function(err, data) {
      this.latlng = L.latLng(data.latlng[0], data.latlng[1] );
      map.mapIt(this);
    }, 
    initFromBundle: function(array) {
      for (idx in array) {
        var company = array[idx];
        if ( company.locations !== undefined && company.locations[0] !== undefined) {
          markets = StartUp.prototype.companyMarkets(company);
          var startUp = new StartUp(company.name, company.locations[0].display_name, markets);
          map.geocoder.query(startUp.location, startUp.assignLatLng.bind(startUp));
          startUp.addToPage(startUp);
        } 
      }
    },
    addToPage: function(startUp) {
      var bullet = document.createElement("li");
      bullet.innerHTML = '<span><strong>name:</strong> ' + startUp.name + '</span><span><strong> location:</strong> ' + startUp.location + '</span><p><strong>markets:</strong> ' + String(startUp.markets) + '</p>';
      $('ul').append(bullet);
    },
    companyMarkets: function(startUp) {
      var markets = [];
      for (idx in startUp.markets) { 
        markets.push(startUp.markets[idx].display_name);
      }
      return markets;
    }
  };

  var markers = new L.MarkerClusterGroup();
  L.mapbox.featureLayer('alekgbg.ldc3jgl3').on('ready', function(e) {
    var clusterGroup = new L.MarkerClusterGroup();
    e.target.eachLayer(function(layer) {
        clusterGroup.addLayer(layer);
    });
    map.map.addLayer(markers);
  });

  var map = new Map();
  //3 is the tag number for mobile
  map.startUpData(3);
  map.addLayer();
  map.searchBox();



});