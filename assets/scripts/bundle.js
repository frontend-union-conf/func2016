import smoothScroll from 'smooth-scroll';

'use strict';

document.addEventListener("DOMContentLoaded", function(event) {
  smoothScroll.init({
    updateURL: false
  });
});

(() => {

let sticky = document.querySelector('[data-sticky]');
let stickyHeight = sticky.offsetHeight;
let stickyHeightNew = 6;
let stickyPoint = document.querySelector('[data-sticky-action]').offsetTop - stickyHeightNew;

let main = document.querySelector('main');
let mainPadding = stickyHeight.toString() + 'px';

let logoText = document.getElementById('logoText');

window.onscroll = () => {
  let y = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  if (y >= stickyPoint) {
    sticky.classList.add('header--sticky');
    main.style.paddingTop = mainPadding;
    logoText.style.display = "none";
  }
  else {
    sticky.classList.remove('header--sticky');
    main.style.paddingTop = 0;
    logoText.style.display = "block";
  }
};

let navToogle = document.querySelector('[data-toggle]');
let nav = document.querySelector('[data-navigation]')

navToogle.addEventListener("click",function(e){
  e.preventDefault();
  navToogle.classList.toggle('header__toggle--open');
  nav.classList.toggle('header__navigation--open');
},false);

let map;

let mapStyle = [{
  "featureType": "administrative",
  "elementType": "labels.text.fill",
  "stylers": [{
    "color": "#444444"
  }]
}, {
  "featureType": "landscape",
  "elementType": "all",
  "stylers": [{
    "color": "#f2f2f2"
  }]
}, {
  "featureType": "landscape",
  "elementType": "geometry.fill",
  "stylers": [{
    "color": "#f4f5f7"
  }]
}, {
  "featureType": "poi",
  "elementType": "all",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "road",
  "elementType": "all",
  "stylers": [{
    "saturation": -100
  }, {
    "lightness": 45
  }]
}, {
  "featureType": "road",
  "elementType": "labels.text.fill",
  "stylers": [{
    "color": "#271000"
  }]
}, {
  "featureType": "water",
  "elementType": "all",
  "stylers": [{
    "color": "#e3e6f4"
  }]
}];

let mapIsDraggable = window.innerWidth > 480 ? true : false;
let mapLatlng = {lat: 54.6843129, lng: 25.2917721};
let mapOptions = {
  zoom: 16,
  draggable: mapIsDraggable,
  center: mapLatlng,
  scrollwheel: false,
  streetViewControl: false,
  mapTypeControl: false,
  styles: mapStyle
};
let markerIcon = './assets/images/marker.png'
let marker = new google.maps.Marker({
  position: mapLatlng,
  icon: markerIcon
});

if (document.getElementById('map')){
  google.maps.event.addDomListener(window, 'load', initMap);
  google.maps.event.addDomListener(window, "resize", changeWidth);
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  marker.setMap(map);
}

function changeWidth() {
  var center = map.getCenter();
  google.maps.event.trigger(map, "resize");
  map.setCenter(center);
  map.setOptions({draggable: mapIsDraggable});
}

})();
