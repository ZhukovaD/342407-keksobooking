'use strict';

window.filterData = (function () {
  return {
    filterPin: function (pins) {
      var mapPinsList = document.querySelector('.map__pin--list');
      mapPinsList.parentNode.removeChild(mapPinsList);

      var formInputs = document.querySelector('.map__filters').querySelectorAll('.map__filter');
      var formInputsArray = Array.from(formInputs);
      var cbFeatures = document.getElementsByName('features');
      var cbFeaturesArray = Array.from(cbFeatures);
      var filters = [];
      var features = [];
      var filteredFeatures = cbFeaturesArray.filter(function (cb) {
        if (cb.checked) {
          return true;
        } else {
          return false;
        }
      });

      filteredFeatures.map(function (e) {
        features.push(e.value);
      });


      formInputsArray.map(function (e) {
        filters.push(e.value);
      });

      var filteredPins;

      filteredPins = pins.filter(function (p) {
        var filtered = 1;
        if (p.offer.type !== filters[0] && filters[0] !== 'any') {
          filtered *= 0;
        }

        var priceInput = filters[1];
        switch (priceInput) {
          case 'low':
            if (p.offer.price >= 10000) {
              filtered *= 0;
            }
            break;
          case 'middle':
            if (p.offer.price < 10000 || p.offer.price >= 50000) {
              filtered *= 0;
            }
            break;
          case 'high':
            if (p.offer.price < 50000) {
              filtered *= 0;
            }
            break;

        }

        var rooms = filters[2];
        if (p.offer.rooms !== Number(rooms) && rooms !== 'any') {
          filtered *= 0;
        }

        var guests = filters[3];
        if (p.offer.guests !== Number(guests) && guests !== 'any') {
          filtered *= 0;
        }


        var pinFeatures = Array.from(p.offer.features);
        features.map(function (f) {
          if (!pinFeatures.includes(f)) {
            filtered *= 0;
          }
        });
        return (filtered === 1);
      });

      // renderPins(filteredPins);
      return filteredPins;
    }
  };
})();
