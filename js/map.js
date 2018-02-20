'use strict';

(function () {
  // -----------------ЗАДАЕТ НЕАКТИВНОЕ СОСТОЯНИЕ СТРАНИЦЫ-----------------
  // * делает все fieldset неактивными.
  var noticeFieldset = document.querySelector('.notice__form').querySelectorAll('fieldset');
  for (var i = 0; i < noticeFieldset.length; i++) {
    noticeFieldset[i].setAttribute('disabled', 'disabled');
  }

  //* находит начальные координаты метки
  var MAP_HEIGHT = 750;
  var MAP_WIDTH = 1200;
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var address = document.getElementsByName('address')[0];

  var initialMapPinCoordinates = {
    y: Math.floor(MAP_HEIGHT / 2 + MAP_PIN_HEIGHT / 2),
    x: Math.floor(MAP_WIDTH / 2 + MAP_PIN_WIDTH / 2)
  };

  //* записывает найденные координаты в поле address
  address.value = initialMapPinCoordinates.x + ', ' + initialMapPinCoordinates.y;

  // * активирует страницу при перетаскивании метки
  var mainPinHandle = document.querySelector('.map__pin--main');

  mainPinHandle.addEventListener('mouseup', function () {
    activatePage();
    setAddress();
  });

  // изменение координат метки
  var setAddress = function () {
    var changeMapPinCoordinates = {
      y: Math.floor(MAP_HEIGHT / 2 + MAP_PIN_HEIGHT),
      x: Math.floor(MAP_WIDTH / 2 + MAP_PIN_WIDTH / 2)
    };
    address.value = changeMapPinCoordinates.x + ', ' + changeMapPinCoordinates.y;
  };


  // -----------------ПЕРЕХОД СТРАНИЦЫ В АКТИВНОЕ СОСТОЯНИЕ-----------------
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

  var activatePage = function () {
    if (!activated) {

      map.classList.remove('map--faded');

      activateForm();

      var mapPinsList = document.createElement('div');
      mapPinsList.setAttribute('class', 'map__pin--list');
      document.querySelector('.map__pins').appendChild(mapPinsList);
      mapPinsList.appendChild(window.pins);
    }

    map.addEventListener('click', showAdCard);

    activated = true;
  };


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
        map.insertBefore(window.card.renderCard(window.ads[evtElement.dataset.ad]), mapFiltersContainer);
        evtElement.classList.add('map__pin--active');
        activeAdButton = evtElement;
        return;
      }
      evtElement = evtElement.parentNode;
      activeAdButton = evtElement;
    }

  };
})();
