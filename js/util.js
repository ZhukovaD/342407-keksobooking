'use strict';

window.util = (function () {
  var CLOSE_KEYCODE = 27;
  var OPEN_KEYCODE = 13;

  return {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === CLOSE_KEYCODE) {
        action();
      }
    },

    isEnterEvent: function (evt, action) {
      if (evt.keyCode === OPEN_KEYCODE) {
        action();
      }
    }
  };

})();
