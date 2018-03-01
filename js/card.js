'use strict';

window.card = (function () {
  return {
    renderCard: function (ad) {
      var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

      var realtyRus;
      switch (ad.offer.type) {
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
      mapCard.querySelector('h3').textContent = ad.offer.title;
      mapCard.querySelector('p').textContent = ad.offer.address;
      mapCard.querySelector('.popup__price').textContent = ad.offer.price + '\u20BD/ночь';
      mapCard.querySelector('h4').textContent = realtyRus;
      mapCard.querySelectorAll('p')[2].textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
      mapCard.querySelectorAll('p')[3].textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
      mapCard.querySelectorAll('p')[4].textContent = ad.offer.description;


      // Выводит доступные удобства из списка offer.features в список .popup__features (сначала очищает список шаблона)
      var popupFeatures = mapCard.querySelector('.popup__features');
      popupFeatures.innerHTML = '';


      // Устанавливает атрибут "класс" в соответствии со значением offer.features[i]
      // Скрывает список фич, если их нет
      var featuresFragment = document.createDocumentFragment();
      if (ad.offer.features.length !== 0) {
        for (var i = 0; i < ad.offer.features.length; i++) {
          var popup = document.createElement('li');
          popup.setAttribute('class', 'feature feature--' + ad.offer.features[i]);
          featuresFragment.appendChild(popup);
        }
        popupFeatures.appendChild(featuresFragment);
      } else {
        popupFeatures.style.display = 'none';
      }


      // --Выводит фотографии из списка offer.photos в список .popup__pictures (сначала очищает список шаблона)
      // --Записывает в атрибут src изображения одну из строк массива pictures
      // --Указывает размеры фотографий в атрибутах
      var popupPicturesList = mapCard.querySelector('.popup__pictures');
      popupPicturesList.innerHTML = '';

      var imagesFragment = document.createDocumentFragment();
      for (i = 0; i < ad.offer.photos.length; i++) {
        var popupPicturesItem = document.createElement('li');
        var popupImage = document.createElement('img');

        popupImage.setAttribute('src', ad.offer.photos[i]);
        popupImage.setAttribute('width', '105px');
        popupImage.setAttribute('height', '85px');
        popupPicturesItem.appendChild(popupImage);
        imagesFragment.appendChild(popupPicturesItem);
      }
      popupPicturesList.appendChild(imagesFragment);

      // --Заменяет src у аватарки пользователя
      mapCard.querySelector('img').setAttribute('src', ad.author.avatar);

      return mapCard;
    }
  };
})();
