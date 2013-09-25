/* global describe: false */
/* global it: false */
/* global expect: false */
/* global beforeEach: false */
/* global jasmine: false */
/* jshint maxstatements: 30 */

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['src/wrap'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('../src/wrap'));
  } else {
    // Browser globals (root is window)
    root.specWrap = factory(root.Wrap);
  }
})(this, 
function (Wrap) {
'use strict';


describe('Wrap', function (argument) {

  it('is a function', function () {
    expect(Wrap).toEqual(jasmine.any(Function));
  });

  it('creates new instance, passing function to the constructor', function () {
    expect(function () {
      var wrap = new Wrap(function () {});
      expect(wrap).toEqual(jasmine.any(Object));
    }).not.toThrow();
  });

  it('throws an exception if the constructor is invoked without an argument', function () {
    expect(function () {
      var wrap = new Wrap();
    }).toThrow();
  });

  describe('instance', function () {
    var wrap;
    var mywrap;
    var Decoration;
    var original;
    beforeEach(function () {
      Decoration = jasmine.createSpy('Decoration');
      wrap = new Wrap(Decoration);
      original = {
        foo: function () {
          return 'foo';
        },
        bar:'bar',
        over: 1
      };
      mywrap = new Wrap(function () {
        this.baz = 'baz';
        this.over = 3;
      });
    });

    it('has a around function', function () {
      expect(wrap.around).toEqual(jasmine.any(Function));
    });

    it('wraps around an object, resulting in a new object', function () {
      var modified = wrap.around(original);
      expect(modified).toEqual(jasmine.any(Object));
      expect(Decoration).toHaveBeenCalled();
      expect(Decoration.calls.length).toBe(1);
      expect(Decoration.calls[0].object).toBe(modified);
    });

    it('creates different wrapped object from different wraps', function () {
      var mydec = mywrap.around(original);
      var yourdec = wrap.around(original);
      expect(mydec).not.toBe(yourdec);
    });

    describe('wrapped original', function () {
      var result;
      beforeEach(function () {
        result = mywrap.around(original);
      });

      it('returns the same object on subsequent wraps of the same original', function () {
        var result2 = mywrap.around(original);
        expect(result2).toBe(result);
      });

      it('added the Decoration properties to the original ones in the wrapped object', function () {
        expect(result.foo).toBe(original.foo);
        expect(result.bar).toBe(original.bar);
        expect(result.baz).toEqual('baz');
      });

      it('overwrite properties with the same names without changing the original', function () {
        expect(result.over).toBe(3);
        expect(original.over).toBe(1);
      });
    });
  });
});

});