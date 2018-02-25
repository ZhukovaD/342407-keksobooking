'use strict';

window.util = (function () {
  return {
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    shuffleArray: function (arrayIn) {
      var array = arrayIn.slice();
      var randomArray = [];
      while (array.length > 0) {
        var randomIndex = Math.floor(Math.random() * array.length);
        randomArray.push(array[randomIndex]);
        array.splice(randomIndex, 1);
      }
      return randomArray;
    },

    createShuffledArrayRandomLength: function (arrayIn) {
      var shuffledArray = window.util.shuffleArray(arrayIn);
      shuffledArray.splice(window.util.getRandomNumber(0, arrayIn.length));
      return shuffledArray;
    }
  };
})();
