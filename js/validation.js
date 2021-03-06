'use strict';

// -----------------ВАЛИДАЦИЯ ФОРМЫ-----------------
(function () {
// Изменение время заселения/выезда
  var checkinTime = document.querySelector('#timein');
  var checkoutTime = document.querySelector('#timeout');

  var setTime = function (evt) {
    if (evt.target.name === 'timein') {
      checkoutTime.value = evt.target.value;
    } else {
      checkinTime.value = evt.target.value;
    }
  };

  checkinTime.addEventListener('change', setTime);
  checkoutTime.addEventListener('change', setTime);


  // Изменение минимальной цены в зависимости от типа жилья
  var realtyType = document.querySelector('#type');
  var realtyPrice = document.querySelector('#price');

  var updateRealtyPrice = function () {
    switch (realtyType.value) {
      case 'flat':
        realtyPrice.min = 1000;
        break;
      case 'bungalo':
        realtyPrice.min = 0;
        break;
      case 'house':
        realtyPrice.min = 5000;
        break;
      case 'palace':
        realtyPrice.min = 10000;
    }
  };

  realtyType.addEventListener('change', updateRealtyPrice);


  // Изменение кол-ва гостей в зависимости от кол-ва комнат
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');
  var roomTextArr = ['для 1 гостя', 'для 2 гостей', 'для 3 гостей', 'не для гостей'];

  var updateRoomRules = function () {
    while (capacity.hasChildNodes()) {
      capacity.removeChild(capacity.firstChild);
    }
    var option;
    var createOption = function (optionElementValue, roomTextElement) {
      option = document.createElement('option');
      option.value = optionElementValue;
      option.text = roomTextArr[roomTextElement];
      capacity.add(option);
    };

    switch (roomNumber.value) {
      case '1':
        createOption(1, 0);
        break;
      case '2':
        for (var i = 1; i < 3; i++) {
          createOption(i, i - 1);
        }
        break;
      case '3':
        for (i = 1; i < 4; i++) {
          createOption(i, i - 1);
        }
        break;
      case '100':
        createOption(100, 3);
    }
  };

  roomNumber.addEventListener('change', updateRoomRules);
  updateRoomRules();
})();
