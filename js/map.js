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
  var showPins = function (pinList) {
    pins = pinList;
    var mapPinsList = document.createElement('div');
    mapPinsList.classList.add('map__pin--list');
    document.querySelector('.map__pins').appendChild(mapPinsList);

    var mapPinButton = document.querySelector('template').content.querySelector('.map__pin');
    var mapPinListFragment = document.createDocumentFragment();

    for (i = 0; i < pinList.length; i++) {
      var mapPin = mapPinButton.cloneNode(true);

      mapPin.setAttribute('style', 'left:' + (pinList[i].location.x - 25) + 'px; top: ' + (pinList[i].location.y - 70) + 'px;');
      mapPin.setAttribute('data-ad', i);
      mapPin.querySelector('img').setAttribute('src', pinList[i].author.avatar);

      mapPinListFragment.appendChild(mapPin);
    }

    mapPinsList.appendChild(mapPinListFragment);
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

      var mapPinsList = document.createElement('div');
      mapPinsList.setAttribute('class', 'map__pin--list');
      document.querySelector('.map__pins').appendChild(mapPinsList);
      window.backend.loadData(showPins, showPinsError);


      var changeMapPinCoordinates = {
        y: Math.floor(MAP_HEIGHT / 2 + MAP_PIN_HEIGHT),
        x: Math.floor(MAP_WIDTH / 2 + MAP_PIN_WIDTH / 2)};

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
        map.insertBefore(window.card.renderCard(pins[evtElement.dataset.ad]), mapFiltersContainer);
        evtElement.classList.add('map__pin--active');
        activeAdButton = evtElement;
        return;
      }
      evtElement = evtElement.parentNode;
    }
  };

})();
