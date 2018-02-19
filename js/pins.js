'use strict';

// -----------------СОЗДАЕТ РАЗНЫЕ МЕТКИ НА КАРТЕ-----------------
window.pins = (function () {
  var adsArray = window.ads;
  var mapPinButton = document.querySelector('template').content.querySelector('.map__pin');
  var mapPinListFragment = document.createDocumentFragment();

  for (var i = 0; i < adsArray.length; i++) {
    var mapPin = mapPinButton.cloneNode(true);

    mapPin.setAttribute('style', 'left:' + (adsArray[i].location.x - 25) + 'px; top: ' + (adsArray[i].location.y - 70) + 'px;');
    mapPin.setAttribute('data-ad', i);
    mapPin.querySelector('img').setAttribute('src', adsArray[i].author.avatar);

    mapPinListFragment.appendChild(mapPin);
  }
  return mapPinListFragment;
})();
