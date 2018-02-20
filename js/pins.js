'use strict';

// -----------------СОЗДАЕТ РАЗНЫЕ МЕТКИ НА КАРТЕ-----------------
window.pins = (function () {
  var ads = window.ads;
  var mapPinButton = document.querySelector('template').content.querySelector('.map__pin');
  var mapPinListFragment = document.createDocumentFragment();

  for (var i = 0; i < ads.length; i++) {
    var mapPin = mapPinButton.cloneNode(true);

    mapPin.setAttribute('style', 'left:' + (ads[i].location.x - 25) + 'px; top: ' + (ads[i].location.y - 70) + 'px;');
    mapPin.setAttribute('data-ad', i);
    mapPin.querySelector('img').setAttribute('src', ads[i].author.avatar);

    mapPinListFragment.appendChild(mapPin);
  }
  return mapPinListFragment;
})();
