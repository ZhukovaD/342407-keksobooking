'use strict';

window.backend = (function () {
  var TIMEOUT = 10000; // 10s

  var responseHandler = function (xhr, onSuccess, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
  };

  return {
    loadData: function (onSuccess, onError) {
      var URL = 'https://js.dump.academy/keksobooking/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      responseHandler(xhr, onSuccess, onError);
      xhr.timeout = TIMEOUT;
      xhr.open('GET', URL);
      xhr.send();
    },

    sendData: function (formData, onSuccess, onError) {
      var URL = 'https://js.dump.academy/keksobooking';
      var xhr = new XMLHttpRequest();
      responseHandler(xhr, onSuccess, onError);
      formData.enctype = 'multipart/form-data';
      xhr.open('POST', URL);
      xhr.send(formData);
    }
  };
})();

