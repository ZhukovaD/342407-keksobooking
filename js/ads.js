'use strict';

// -----------------СОЗДАЕТ МАССИВ ОБЪЯВЛЕНИЙ-----------------
window.ads = (function () {
  var ADS_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var REALTY_TYPES = ['flat', 'house', 'bungalo'];
  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var USERS_AVATARS_INDICES = [1, 2, 3, 4, 5, 6, 7, 8];
  var arrayOut = [];
  var shuffledTitlesArray = window.util.shuffleArray(ADS_TITLES);
  var shuffledUsersAvatarsArray = window.util.shuffleArray(USERS_AVATARS_INDICES);

  for (var i = 0; i < 8; i++) {
    var coordinates = {
      x: window.util.getRandomNumber(300, 900),
      y: window.util.getRandomNumber(150, 500)
    };

    arrayOut.push(
        {
          author: {
            avatar: 'img/avatars/user0' + shuffledUsersAvatarsArray[i] + '.png'
          },
          offer: {
            title: shuffledTitlesArray[i],
            address: coordinates.x + ', ' + coordinates.y,
            price: window.util.getRandomNumber(1000, 1000000),
            type: REALTY_TYPES[window.util.getRandomNumber(0, REALTY_TYPES.length)],
            rooms: window.util.getRandomNumber(5, 1),
            guests: window.util.getRandomNumber(20, 1),
            checkin: CHECKIN_TIMES[window.util.getRandomNumber(0, CHECKIN_TIMES.length)],
            checkout: CHECKOUT_TIMES[window.util.getRandomNumber(0, CHECKOUT_TIMES.length)],
            features: window.util.createShuffledArrayRandomLength(FEATURES),
            description: '',
            photos: window.util.shuffleArray(PHOTOS)
          },
          location: coordinates
        }
    );
  }
  return arrayOut;

})();
