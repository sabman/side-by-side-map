var left_map = right_map = null;
var current_resource = 0;
var user_marker = null;

$(document).ready(function() {
  loc = parse_hash();
  backdrop_styles = get_backdrop_styles();
  var center = new google.maps.LatLng(32.321, -86.900);
  var zoom = 8;
  map_options = {
    zoom: zoom,
    center: center,
    zoomControl: true,
    minZoom: 7,
    maxZoom: 11,
    mapTypeControl: false,
    mapTypeId: "simple"
  };
  var initial_hash = window.location.hash;
  simpleLeft = new google.maps.StyledMapType(backdrop_styles, { name: "resource demographics" });
  simpleRight = new google.maps.StyledMapType(backdrop_styles, { name: "resource demographics" });

  left_map = new google.maps.Map(document.getElementById("left_map_canvas"), map_options);
  left_map.mapTypes.set("simple", simpleLeft);
  left_map.overlayMapTypes.push(make_tile_layer('https://s3.amazonaws.com/saburq_tiles/'));

  map_options.zoomControl = false;
  map_options.panControl = false;
  map_options.streetViewControl = false;

  right_map = new google.maps.Map(document.getElementById("right_map_canvas"), map_options);
  right_map.mapTypes.set("simple", simpleRight);

  window.leftMapLoaded = false;
  google.maps.event.addListener(left_map, 'tilesloaded', function(){
    window.leftMapLoaded=true;
    $('#left_map_canvas').trigger('mapLoaded');
    google.maps.event.clearListeners(left_map, 'tilesloaded');
    $('#left_map_canvas').unbind('mapLoaded');
  });
  window.rightMapLoaded = false;
  google.maps.event.addListener(right_map, 'tilesloaded', function(){
    window.rightMapLoaded=true;
    $('#right_map_canvas').trigger('mapLoaded');
    google.maps.event.clearListeners(right_map, 'tilesloaded');
    $('#right_map_canvas').unbind('mapLoaded');
  });

  $('#left_map_canvas, #right_map_canvas').bind('mapLoaded', function(){
    if(window.leftMapLoaded && window.rightMapLoaded){
      sync_maps([left_map, right_map]);
      // if (markerLat != null){
      //   show_user_marker(markerLat, markerLng);
      // }
      if (loc) {
        if (loc[3] != 'false') {
          // highlight_resource(loc[3]);
        }
      }
    }
  });

}); // $(document).ready

function make_tile_layer(tile_prefix){
  options = {
    getTileUrl: function(coord, zoom) {
      return tile_prefix + zoom + "/" + coord.x + "/" + coord.y + ".png";
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: true
  }
  return new google.maps.ImageMapType(options);
}

function make_hash(map) {
  var parts = [map.getCenter().lat(), map.getCenter().lng(), map.getZoom(), current_resource]
  if (left_map.user_marker != null){
    parts.push(left_map.user_marker.getPosition().lat());
    parts.push(left_map.user_marker.getPosition().lng());
  }
  return parts.join(",");
}

function show_user_marker(lat, lng) {
  for (var i = 0; i < maps.length; i++) {
    if (maps[i].user_marker == null) {
      maps[i].user_marker = new google.maps.Marker();
      maps[i].user_marker.setMap(maps[i]);
    }
    maps[i].user_marker.setPosition(new google.maps.LatLng(lat, lng));
  }
}

function MapMoveListener(map) {
  this.listener = google.maps.event.addListener(map, 'bounds_changed', function() {
    if (!window.ignore_move_end) {
      window.ignore_move_end = true;
      for (var i = 0; i < maps.length; i++) {
        if (maps[i] != map) { 
          // set the other map's zoom to this one's
          maps[i].setCenter(map.getCenter());
          maps[i].setZoom(map.getZoom());
        }
      }
      // set the url hash to this map's view
      window.location.hash = make_hash(map);
      setTimeout("window.ignore_move_end = false;",100)
    }
  });
}

function sync_maps(maps) {
  window.maps = maps;
  window.ignore_move_end = false;
  for (var i = 0; i < maps.length; i++) {
    var mml = new MapMoveListener(maps[i]);
  }
}

function get_backdrop_styles(){
  return( [
    {
      featureType: "",
      elementType: "all",
      stylers: [
        { saturation: -100 }
      ]
    },{
      featureType: "landscape.man_made",
      elementType: "all",
      stylers: [

      ]
    },{
      featureType: "administrative.country",
      elementType: "all",
      stylers: [
        { visibility: "off" }
      ]
    },{
      featureType: "administrative.province",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ],
      elementType: "geometry",
      stylers: [
        { visibility: "on" },
        { hue: "#00d4ff" },
        { saturation: 60 },
        { lightness: -20 },
        { gamma: 1.51 }
      ]
    },{
      featureType: "administrative.locality",
      elementType: "all",
      stylers: [
        { visibility: "off" }
      ]
    },{
      featureType: "administrative.neighborhood",
      elementType: "all",
      stylers: [
        { visibility: "off" }
      ]
    },{
      featureType: "administrative.land_parcel",
      elementType: "all",
      stylers: [
        { visibility: "off" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { gamma: 2 },
        { lightness: 20 }
      ]
    },{
      featureType: "poi",
      elementType: "all",
      stylers: [
        { visibility: "off" }
      ]
    },{
      featureType: "all",
      elementType: "all",
      stylers: [

      ]
    }
  ]);
}

// parse hash representing the current map view 
// e.g. #41.829105021970754,-87.60210789929194,14,4
function parse_hash(s) {
  if (s == null) { s = window.location.hash; }
  if (!s) { return; }
  //IE gives you a # at the start. sonova
  s = s.replace('#','');
  parts = s.split(",");
  lat = parseFloat(parts[0]);
  lng = parseFloat(parts[1]);
  zoom = parseInt(parts[2]);
  resource = parseInt(parts[3]);
  if (parts.length == 6) {
    var markerLat = parts[4];
    var markerLng = parts[5];
    return [lat, lng, zoom, resource, markerLat, markerLng];
  } else {
    return [lat, lng, zoom, resource];
  }
  return null;
}
