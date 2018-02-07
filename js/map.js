'use strict';

var similarAds = [];
var ADS_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var REALTY_TYPES = ['flat', 'house', 'bungalo'];
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var USERS_AVATARS_INDICES = [1, 2, 3, 4, 5, 6, 7, 8];

var mapPinsList = document.querySelector('.map__pins');
var mapPinItem = document.querySelector('.map__pin');
var fragment = document.createDocumentFragment();


// -----------------ФУНКЦИИ-----------------------------

// Возвращает рандомное число в пределах
var getRandomNumber = function (max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
};


// Возвращает рандомный элемент массива
var getRandomElement = function (arrayIn) {
  return arrayIn[Math.floor(Math.random() * arrayIn.length)];
};


// Возвращает массив произвольной длины от 0 до длины указанного массива
// Содержит объекты из указанного массива
// Объекты в массив записываются в случайном порядке
var shuffledArray = [];

var createShuffledArray = function (arrayIn) {
  var arrayCounter = Math.floor(Math.random() * arrayIn.length);
  var arrayCopy = arrayIn.slice();
  shuffledArray = [];
  for (var i = 0; i < arrayCounter; i++) {
    var randomIndex = Math.floor(Math.random() * arrayCopy.length);
    shuffledArray.push(arrayCopy[randomIndex]);
    arrayCopy.splice(randomIndex, 1);
  }
  return shuffledArray;
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

// --------------------------------------------------------


// 1. Создает массив из 8 объектов с определенной в задании структурой
var shuffledTitlesArray = arrayShuffle(ADS_TITLES);
var shuffledUsersAvatarsArray = arrayShuffle(USERS_AVATARS_INDICES);

for (var i = 0; i < 8; i++) {
  var coordinates = {
    x: getRandomNumber(900, 300),
    y: getRandomNumber(500, 150)
  };

  similarAds.push(
      {
        author: {
          avatar: 'img/avatars/user0' + shuffledUsersAvatarsArray[i] + '.png'
        },
        offer: {
          title: shuffledTitlesArray[i],
          address: coordinates.x + ', ' + coordinates.y,
          price: getRandomNumber(1000000, 1000),
          type: getRandomElement(REALTY_TYPES),
          rooms: getRandomNumber(5, 1),
          guests: getRandomNumber(20, 1),
          checkin: getRandomElement(CHECKIN_TIMES),
          checkout: getRandomElement(CHECKOUT_TIMES),
          features: createShuffledArray(FEATURES),
          description: '',
          photos: arrayShuffle(PHOTOS)
        },
        location: {
          x: coordinates.x,
          y: coordinates.y
        }
      }
  );
}

// console.log(similarAds);

// 2. Делает карту активной
var map = document.querySelector('.map');
map.classList.remove('map--faded');


// 3. Создает DOM-элементы на основе данных объектов из массива similarAds
// 3.1 Заполняет их данными из массива (координаты и аватар)
for (i = 0; i < similarAds.length; i++) {
  var mapPin = mapPinItem.cloneNode(true);

  mapPin.setAttribute('style', 'left:' + (similarAds[i].location.x - 25) + 'px; top: ' + (similarAds[i].location.y - 70) + 'px;');
  mapPin.querySelector('img').setAttribute('src', similarAds[i].author.avatar);

  fragment.appendChild(mapPin);
}


// 4. Отрисовываетсгенерированные DOM-элементы в блок .map__pins
mapPinsList.appendChild(fragment);


// 5. Создает DOM-элемент объявления на основе первого по порядку элемента из массива similarAds и шаблона .map__card
// Заполняет его данными из объекта
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

var realtyRus;
switch (similarAds[0].offer.type) {
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
mapCard.querySelector('h3').textContent = similarAds[0].offer.title;
mapCard.querySelector('p').textContent = similarAds[0].offer.address;
mapCard.querySelector('.popup__price').textContent = similarAds[0].offer.price + '\u20BD/ночь';
mapCard.querySelector('h4').textContent = realtyRus;
mapCard.querySelectorAll('p')[2].textContent = similarAds[0].offer.rooms + ' комнаты для ' + similarAds[0].offer.guests + ' гостей';
mapCard.querySelectorAll('p')[3].textContent = 'Заезд после ' + similarAds[0].offer.checkin + ', выезд до ' + similarAds[0].offer.checkout;
mapCard.querySelectorAll('p')[4].textContent = similarAds[0].offer.description;


// 5.1 Выводит доступные удобства из списка offer.features в список .popup__features (сначала очищает список шаблона)
// Устанавливает атрибут "класс" в соответствии со значением offer.features[i]
var popupFeatures = mapCard.querySelector('.popup__features');

for (i = 0; i < FEATURES.length; i++) {
  popupFeatures.removeChild(popupFeatures.querySelector('.feature'));
}

for (i = 0; i < similarAds[0].offer.features.length; i++) {
  var popup = document.createElement('li');
  popup.setAttribute('class', 'feature feature--' + similarAds[0].offer.features[i]);
  popupFeatures.appendChild(popup);
}


// 5.2 Выводит фотографии из списка offer.photos в список .popup__pictures (сначала очищает список шаблона)
// Записывает в атрибут src изображения одну из строк массива pictures
// Указывает размеры фотографий в атрибутах
var popupPicturesList = mapCard.querySelector('.popup__pictures');
popupPicturesList.removeChild(popupPicturesList.querySelector('li'));

for (i = 0; i < similarAds[0].offer.photos.length; i++) {
  var popupPicturesItem = document.createElement('li');
  var popupImage = document.createElement('img');
  popupImage.setAttribute('src', similarAds[0].offer.photos[i]);
  popupImage.setAttribute('width', '105px');
  popupImage.setAttribute('height', '85px');
  popupPicturesItem.appendChild(popupImage);
  popupPicturesList.appendChild(popupPicturesItem);
}


// 5.3 Заменяет src у аватарки пользователя
mapCard.querySelector('img').setAttribute('src', similarAds[0].author.avatar);


// 5.4 Вставляет полученный DOM-элемент объявления в блок .map перед блоком .map__filters-container
var mapFiltersContainer = document.querySelector('.map__filters-container');
map.insertBefore(mapCard, mapFiltersContainer);


