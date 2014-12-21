import Ember from 'ember';

var keyCodes = {
  h: 104,
  j: 106,
  k: 107,
  l: 108,
  w: 119,
  a: 97,
  s: 115,
  d: 100,
  question: 63,
  q: 113
};

export default Ember.Component.extend({
  trail: [],
  interval: 10,
  cursorPosX: 0,
  cursorPosY: 0,
  displayHelp: false,
  d3Model: null,
  isValid: Ember.computed(
    'trail',
    function () {
      return this.get('trail').length > 0;
    }
  ),
  initializeKeypresses: function () {
    var ctx = this;
    window.onkeypress = function (e) {
      if (e.which === keyCodes.question && e.shiftKey) {
        ctx.showHelp();
      }
      if (e.which === keyCodes.q && ctx.displayHelp) {
        ctx.hideHelp();
      }
      switch (e.which) {
        case keyCodes.h:
          case keyCodes.a:
          ctx.send('shiftLeft');
        break;
        case keyCodes.j:
          case keyCodes.s:
          ctx.send('shiftDown');
        break;
        case keyCodes.l:
          case keyCodes.d:
          ctx.send('shiftRight');
        break;
        case keyCodes.k:
          case keyCodes.w:
          ctx.send('shiftUp');
        break;
      }
    };
  },
  renderTrail: function () {
    var interval = this.get('interval');
    var trail = this.get('trail');
    this.get('d3Model')
    .data(trail)
    .append('rect')
    .attr('class', 'point')
    .attr('width', interval)
    .attr('height', interval)
    .attr('x', function (print) {
      return print.split(',')[0];
    })
    .attr('y', function (print) {
      return print.split(',')[1];
    });
  }.observes('trail'),
  didInsertElement: function () {
    this.set('d3Model', window.d3.selectAll('.sketch-trail'));
    this.initializeKeypresses();
  },
  moveCursor: function (key, newValue) {
    var x = this.get('cursorPosX');
    var y = this.get('cursorPosY');
    var print = x + ',' + y;
    var trail = this.get('trail');
    if (trail.indexOf(print) === -1) {
      this.set('trail', [print].concat(trail));
    }
    this.set(key, newValue);
  },
  actions: {
    save: function () {
      if (this.get('isValid')) {
        console.log('save this stuff');
      } else {
        this.set('errorMessage', 'You can\'t save an empty sketch');
      }
    },
    clear: function () {
      this.set('trail', []);
      this.get('d3Model').selectAll('.point').remove();
    },
    shiftLeft: function () {
      var interval = this.get('interval');
      var x = this.get('cursorPosX');
      if (x > 0) {
        this.moveCursor('cursorPosX', x - interval);
      }
    },
    shiftUp: function () {
      var interval = this.get('interval');
      var y = this.get('cursorPosY');
      if (y > 0) {
        this.moveCursor('cursorPosY', y - interval);
      }
    },
    shiftDown: function () {
      var interval = this.get('interval');
      var y = this.get('cursorPosY');
      if (y < 600 - interval) {
        this.moveCursor('cursorPosY', y + interval);
      }
    },
    shiftRight: function () {
      var interval = this.get('interval');
      var x = this.get('cursorPosX');
      if (x < 800 - interval) {
        this.moveCursor('cursorPosX', x + interval);
      }
    }
  }
});
