'use strict';

(function () {
  // -----------------ЗАДАЕТ НЕАКТИВНОЕ СОСТОЯНИЕ СТРАНИЦЫ-----------------
  // делает все fieldset неактивными.
  var noticeFieldset = document.querySelector('.notice__form').querySelectorAll('fieldset');
  for (var i = 0; i < noticeFieldset.length; i++) {
    noticeFieldset[i].setAttribute('disabled', 'disabled');
  }

  // находит начальные координаты метки
  var MAP_HEIGHT = 750;
  var MAP_WIDTH = 1200;
  var MAP_SKY_HEIGHT = 180;
  var MAP_FILTERS_HEIGHT = 50;
  var MAP_PIN_MAIN_WIDTH = 65;
  var MAP_PIN_MAIN_HEIGHT = 65;
  var MAP_PIN_WIDTH = 60;
  var MAP_PIN_HEIGHT = 80;
  var MAP_PIN_BORDER = 15;
  var address = document.getElementsByName('address')[0];

  var initialMapPinCoordinates = {
    x: Math.floor(MAP_WIDTH / 2 + MAP_PIN_MAIN_WIDTH / 2),
    y: Math.floor(MAP_HEIGHT / 2 + MAP_PIN_MAIN_HEIGHT / 2)
  };

  // записывает найденные координаты в поле address
  address.value = initialMapPinCoordinates.x + ', ' + initialMapPinCoordinates.y;

  // активирует страницу при перетаскивании метки
  var mainPinHandle = document.querySelector('.map__pin--main');

  // активация страницы
  // установка адреса, если юзер НЕ передвинул метку
  mainPinHandle.addEventListener('mouseup', function () {
    activatePage();
  });


  var activated = false;
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var map = document.querySelector('.map');


  var activateForm = function () {
    var noticeForm = document.querySelector('.notice__form');
    noticeForm.classList.remove('notice__form--disabled');
    for (i = 0; i < noticeFieldset.length; i++) {
      noticeFieldset[i].removeAttribute('disabled');
    }
  };
  var pins;
  var pinsList;
  var renderPins = function (pinList) {
    pinsList = pinList.slice();
    pinsList = pinsList.splice(0, 5);

    var mapPinsList = document.createElement('div');
    mapPinsList.classList.add('map__pin--list');
    document.querySelector('.map__pins').appendChild(mapPinsList);

    var mapPinButton = document.querySelector('template').content.querySelector('.map__pin');
    var mapPinListFragment = document.createDocumentFragment();

    for (i = 0; i < pinsList.length; i++) {
      var mapPin = mapPinButton.cloneNode(true);

      mapPin.setAttribute('style', 'left:' + (pinsList[i].location.x - 25) + 'px; top: ' + (pinsList[i].location.y - 70) + 'px;');
      mapPin.setAttribute('data-ad', i);
      mapPin.querySelector('img').setAttribute('src', pinsList[i].author.avatar);

      mapPinListFragment.appendChild(mapPin);
    }


    mapPinsList.appendChild(mapPinListFragment);
  };

  var showPins = function (pinList) {
    pins = pinList.slice();

    renderPins(pinList);
  };

  var showPinsError = function () {
    var modalError = document.querySelector('.error');
    modalError.style.display = 'block';
    document.querySelector('.error__toggle').addEventListener('click', function () {
      modalError.style.display = 'none';
    });
  };

  var activatePage = function () {
    if (!activated) {

      map.classList.remove('map--faded');

      activateForm();

      window.backend.loadData(showPins, showPinsError);


      var changeMapPinCoordinates = {
        y: Math.floor(MAP_HEIGHT / 2 + MAP_PIN_HEIGHT),
        x: Math.floor(MAP_WIDTH / 2 + MAP_PIN_WIDTH / 2)
      };

      address.value = changeMapPinCoordinates.x + ', ' + changeMapPinCoordinates.y;

    }

    map.addEventListener('click', showAdCard);

    activated = true;
  };

  // перетаскивание метки
  // установка адреса, если юзер передвинул метку
  mainPinHandle.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };


    var dragged = false;
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var positionX;
      var positionY;

      // ограничения перетаскивания по X
      if (mainPinHandle.offsetLeft - shift.x < MAP_PIN_WIDTH / 2 + MAP_PIN_BORDER) {
        positionX = MAP_PIN_WIDTH / 2 + MAP_PIN_BORDER;
      } else if (mainPinHandle.offsetLeft - shift.x > MAP_WIDTH - MAP_PIN_WIDTH / 2 - MAP_PIN_BORDER) {
        positionX = MAP_WIDTH - MAP_PIN_WIDTH / 2 - MAP_PIN_BORDER;
      } else {
        positionX = mainPinHandle.offsetLeft - shift.x;
      }

      // ограничения перетаскивания по Y
      if (mainPinHandle.offsetTop - shift.y < MAP_SKY_HEIGHT - MAP_PIN_HEIGHT) {
        positionY = MAP_SKY_HEIGHT - MAP_PIN_HEIGHT;
      } else if (mainPinHandle.offsetTop - shift.y > MAP_HEIGHT - MAP_FILTERS_HEIGHT - MAP_PIN_HEIGHT / 2) {
        positionY = MAP_HEIGHT - MAP_FILTERS_HEIGHT - MAP_PIN_HEIGHT / 2;
      } else {
        positionY = mainPinHandle.offsetTop - shift.y;
      }
      mainPinHandle.style.top = positionY + 'px';
      mainPinHandle.style.left = positionX + 'px';
      address.value = Math.floor(positionX + MAP_PIN_WIDTH / 2) + ', ' + Math.floor(positionY + MAP_PIN_HEIGHT);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          mainPinHandle.removeEventListener('click', onClickPreventDefault);
        };
        mainPinHandle.addEventListener('click', onClickPreventDefault);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });


  // делает метку, у которой показано объявление, красной
  var activeAdButton = null;

  var showAdCard = function (evt) {

    if (document.querySelector('.popup') !== null) {
      document.querySelector('.popup').parentNode.removeChild(document.querySelector('.popup'));
    }
    if (activeAdButton !== null) {
      activeAdButton.classList.remove('map__pin--active');
    }

    var evtElement = evt.target;
    while (!evtElement.classList.contains('map')) {
      if (evtElement.classList.contains('map__pin') && !evtElement.classList.contains('map__pin--main')) {
        map.insertBefore(window.card.renderCard(pinsList[evtElement.dataset.ad]), mapFiltersContainer);
        evtElement.classList.add('map__pin--active');
        activeAdButton = evtElement;
        return;
      }
      evtElement = evtElement.parentNode;
    }
  };


  var filterPins = function () {

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


      var pinFeaturesArr = Array.from(p.offer.features);
      features.map(function (f) {
        if (!pinFeaturesArr.includes(f)) {
          filtered *= 0;
        }
      });
      return (filtered === 1);
    });

    renderPins(filteredPins);
  };

  var updateFilters = function (evt) {
    var evtElement = evt.target;
    while (!evtElement.classList.contains('map')) {
      if (evtElement.classList.contains('map__filters')) {
        filterPins();
        return;
      }
      evtElement = evtElement.parentNode;
    }
  };

  document.addEventListener('change', updateFilters);

})();
