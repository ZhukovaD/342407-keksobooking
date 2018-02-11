'use strict';

var ADS_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var REALTY_TYPES = ['flat', 'house', 'bungalo'];
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var USERS_AVATARS_INDICES = [1, 2, 3, 4, 5, 6, 7, 8];


// -----------------ФУНКЦИИ-----------------------------

// Возвращает рандомное число в пределах
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};


// Перемешивает массив
var arrayShuffle = function (arrayIn) {
  var array = arrayIn.slice();
  var randomArray = [];
  while (array.length > 0) {
    var randomIndex = Math.floor(Math.random() * array.length);
    randomArray.push(array[randomIndex]);
    array.splice(randomIndex, 1);
  }
  return randomArray;
};


// Возвращает массив произвольной длины от 0 до длины указанного массива
// Содержит объекты из указанного массива
// Объекты в массив записываются в случайном порядке
var createShuffledArray = function (arrayIn) {
  var shuffledArray = arrayShuffle(arrayIn);
  shuffledArray.splice(getRandomNumber(0, arrayIn.length));
  return shuffledArray;
};


// Создает массив из 8 объектов с определенной структурой
var createAdsArray = function () {
  var arrayOut = [];
  var shuffledTitlesArray = arrayShuffle(ADS_TITLES);
  var shuffledUsersAvatarsArray = arrayShuffle(USERS_AVATARS_INDICES);

  for (var i = 0; i < 8; i++) {
    var coordinates = {
      x: getRandomNumber(300, 900),
      y: getRandomNumber(150, 500)
    };

    arrayOut.push(
      {
        author: {
          avatar: 'img/avatars/user0' + shuffledUsersAvatarsArray[i] + '.png'
        },
        offer: {
          title: shuffledTitlesArray[i],
          address: coordinates.x + ', ' + coordinates.y,
          price: getRandomNumber(1000, 1000000),
          type: REALTY_TYPES[getRandomNumber(0, REALTY_TYPES.length)],
          rooms: getRandomNumber(5, 1),
          guests: getRandomNumber(20, 1),
          checkin: CHECKIN_TIMES[getRandomNumber(0, CHECKIN_TIMES.length)],
          checkout: CHECKOUT_TIMES[getRandomNumber(0, CHECKOUT_TIMES.length)],
          features: createShuffledArray(FEATURES),
          description: '',
          photos: arrayShuffle(PHOTOS)
        },
        location: coordinates
      }
    );
  }
  return arrayOut;
};


// Создает DOM-элементы на основе данных объектов из массива объявлений
// Заполняет их данными из массива (координаты и аватар)
var renderPins = function (adsArray) {
  var mapPinButton = document.querySelector('template').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < adsArray.length; i++) {
    var mapPin = mapPinButton.cloneNode(true);

    mapPin.setAttribute('style', 'left:' + (adsArray[i].location.x - 25) + 'px; top: ' + (adsArray[i].location.y - 70) + 'px;');
    mapPin.querySelector('img').setAttribute('src', adsArray[i].author.avatar);

    fragment.appendChild(mapPin);
  }
  return fragment;
};


// Создает DOM-элемент объявления на основе первого по порядку элемента из массива similarAds и шаблона .map__card
// Заполняет его данными из объекта
var renderCard = function (adsArrayElement) {
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

  var realtyRus;
  switch (adsArrayElement.offer.type) {
    case ('flat'):
      realtyRus = 'Квартира';
      break;
    case ('house'):
      realtyRus = 'Дом';
      break;
    case ('bungalo'):
      realtyRus = 'Бунгало';
  }

  var mapCard = mapCardTemplate.cloneNode(true);
  mapCard.querySelector('h3').textContent = adsArrayElement.offer.title;
  mapCard.querySelector('p').textContent = adsArrayElement.offer.address;
  mapCard.querySelector('.popup__price').textContent = adsArrayElement.offer.price + '\u20BD/ночь';
  mapCard.querySelector('h4').textContent = realtyRus;
  mapCard.querySelectorAll('p')[2].textContent = adsArrayElement.offer.rooms + ' комнаты для ' + adsArrayElement.offer.guests + ' гостей';
  mapCard.querySelectorAll('p')[3].textContent = 'Заезд после ' + adsArrayElement.offer.checkin + ', выезд до ' + adsArrayElement.offer.checkout;
  mapCard.querySelectorAll('p')[4].textContent = adsArrayElement.offer.description;


  // Выводит доступные удобства из списка offer.features в список .popup__features (сначала очищает список шаблона)
  var popupFeatures = mapCard.querySelector('.popup__features');

  while (popupFeatures.firstChild) {
    popupFeatures.removeChild(popupFeatures.firstChild);
  }


  // --Устанавливает атрибут "класс" в соответствии со значением offer.features[i]
  for (var i = 0; i < adsArrayElement.offer.features.length; i++) {
    var popup = document.createElement('li');
    popup.setAttribute('class', 'feature feature--' + adsArrayElement.offer.features[i]);
    popupFeatures.appendChild(popup);
  }


  // --Выводит фотографии из списка offer.photos в список .popup__pictures (сначала очищает список шаблона)
  // --Записывает в атрибут src изображения одну из строк массива pictures
  // --Указывает размеры фотографий в атрибутах
  var popupPicturesList = mapCard.querySelector('.popup__pictures');
  popupPicturesList.removeChild(popupPicturesList.querySelector('li'));

  for (i = 0; i < adsArrayElement.offer.photos.length; i++) {
    var popupPicturesItem = document.createElement('li');
    var popupImage = document.createElement('img');
    popupImage.setAttribute('src', adsArrayElement.offer.photos[i]);
    popupImage.setAttribute('width', '105px');
    popupImage.setAttribute('height', '85px');
    popupPicturesItem.appendChild(popupImage);
    popupPicturesList.appendChild(popupPicturesItem);
  }

  // --Заменяет src у аватарки пользователя
  mapCard.querySelector('img').setAttribute('src', adsArrayElement.author.avatar);

  return mapCard;
};


// --------------------------------------------------------

// НЕАКТИВНОЕ СОСТОЯНИЕ СТРАНИЦЫ

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



// ПЕРЕХОД СТРАНИЦЫ В АКТИВНОЕ СОСТОЯНИЕ
var activated = false;
var mapPinsList;
var similarAds = createAdsArray();
var mapFiltersContainer = document.querySelector('.map__filters-container');

var activatePage = function () {
  if (!activated) {
    var map = document.querySelector('.map');
    map.classList.remove('map--faded');
    var noticeForm = document.querySelector('.notice__form');
    noticeForm.classList.remove('notice__form--disabled');
    for (var i = 0; i < noticeFieldset.length; i++) {
      noticeFieldset[i].removeAttribute('disabled');
    }

    similarAds = createAdsArray();
    mapPinsList = document.querySelector('.map__pins');
    mapPinsList.appendChild(renderPins(similarAds));

  } else {
    updatePins();
  }

  document.addEventListener('click', function (evn) {
    for (var i = 0; i < evn.path.length; i++) {
      if (evn.path[i].className === 'map__pin') {
        map.insertBefore(renderCard(similarAds[getRandomNumber(0, similarAds.length)]), mapFiltersContainer);
      }
    }
  });


  activated = true;
};


// -----------------------------------------
var updatePins = function () {
  mapPinsList = document.querySelector('.map__pins');
  var pinList = [];
  while(mapPinsList.childNodes[0]) {
    if (mapPinsList.childNodes[0].className != 'map__pin')
      pinList.push(mapPinsList.childNodes[0]);
    mapPinsList.removeChild(mapPinsList.firstChild);
  }

  for (var i = 0; i < pinList.length; i++){
    mapPinsList.appendChild(pinList[i]);
  }
  similarAds = createAdsArray();
  mapPinsList.appendChild(renderPins(similarAds));
};
