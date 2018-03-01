'use strict';

window.filterData = (function () {
  return {
    filterPin: function (pins) {

      var filterPrice = function (price) {
        return function (pin) {
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
      };

      var filterType = function (type) {
        return function (pin) {
          return type === 'any' || pin.offer.type === type;
        };
      };

      var filterRooms = function (count) {
        return function (pin) {
          if (count === 'any') {
            return true;
          }
          return Number(count) === pin.offer.rooms;
        };
      };

      var filterGuests = function (count) {
        return function (pin) {
          if (count === 'any') {
            return true;
          }
          return Number(count) === pin.offer.guests;
        };
      };

      var filterFeatures = function (features) {
        return function (pin) {
          for (var i = 0; i < features.length; i++) {
            if (!pin.offer.features.includes(features[i])) {
              return false;
            }
          }
          return true;
        };
      };

      var inputs = Array.from(document.querySelectorAll('.map__filter'));

      var filteredFeatures = Array.from(document.querySelectorAll('.map__filter-set input:checked'));
      var features = filteredFeatures.map(function (e) {
        return e.value;
      });
      var filters = inputs.map(function (e) {
        return e.value;
      });
      return pins
          .filter(filterType(filters[0]))
          .filter(filterPrice(filters[1]))
          .filter(filterRooms(filters[2]))
          .filter(filterGuests(filters[3]))
          .filter(filterFeatures(features));
    }
  };
})();
