(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['yacollections'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('yacollections'));
  } else {
    // Browser globals (root is window)
    root.Wrap = factory(root.collections);
  }
})(this, 
function (collections) {
  'use strict';
  function Wrap(Decoration, options) {
    var decorated; //:Map

    if (typeof Decoration !== 'function') {
      throw new Error('Decoration must be a function, instead:', typeof Decoration);
    }

    (function () {
      var mapOptions = {};
      if (options && options.getHashCode)
        mapOptions.getHashCode = options.getHashCode;
      decorated = new collections.Map(mapOptions);    
    })();

    this.around = function (target, options) {
      if (!target) {
        throw new Error('target must be an object');
      }
      if (!decorated.has(target)) {
        var result = Object.create(target);
        Decoration.call(result, options);
        decorated.set(target, result);
        return result;
      }
      return decorated.get(target);
    };
  }

  return Wrap;
});