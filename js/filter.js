'use strict';

(function () {
  window.filterPin = function (pins) {

    var PIN_COUNT = 5;

    var filterPrice = function (pin, price) {
      switch (price) {
        case 'low':
          return pin.offer.price <= 10000;
        case 'middle':
          return pin.offer.price > 10000 && pin.offer.price <= 50000;
        case 'high':
          return pin.offer.price > 50000;
      }
      return true;
    };

    var filterType = function (pin, type) {
      return type === 'any' || pin.offer.type === type;
    };

    var filterRooms = function (pin, count) {
      if (count === 'any') {
        return true;
      }
      return Number(count) === pin.offer.rooms;
    };

    var filterGuests = function (pin, count) {
      if (count === 'any') {
        return true;
      }
      return Number(count) === pin.offer.guests;
    };

    var filterFeatures = function (pin, features) {
      for (var i = 0; i < features.length; i++) {
        if (!pin.offer.features.includes(features[i])) {
          return false;
        }
      }
      return true;
    };

    var inputs = Array.from(document.querySelectorAll('.map__filter'));

    var filteredFeatures = Array.from(document.querySelectorAll('.map__filter-set input:checked'));
    var features = filteredFeatures.map(function (e) {
      return e.value;
    });
    var filters = inputs.map(function (e) {
      return e.value;
    });

    var filteredPins = [];
    for (var i = 0; i < pins.length; i++) {
      if (filteredPins.length === PIN_COUNT) {
        return filteredPins;
      }

      if (
        filterType(pins[i], filters[0]) &&
        filterPrice(pins[i], filters[1]) &&
        filterRooms(pins[i], filters[2]) &&
        filterGuests(pins[i], filters[3]) &&
        filterFeatures(pins[i], features)
      ) {
        filteredPins.push(pins[i]);
      }
    }

    return filteredPins;
  };
})();
