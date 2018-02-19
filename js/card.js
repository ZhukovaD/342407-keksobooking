'use strict';

window.card = (function () {
  return {
    renderCard: function (adsArrayElement) {
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
    }
  };
})();
