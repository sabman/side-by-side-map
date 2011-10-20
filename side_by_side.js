var left_map = right_map = null;
var current_resource = 0;

$(document).ready(function() {
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

  map_options.zoomControl = false;
  map_options.panControl = false;
  map_options.streetViewControl = false;

  right_map = new google.maps.Map(document.getElementById("right_map_canvas"), map_options);
  right_map.mapTypes.set("simple", simpleRight);

});

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

