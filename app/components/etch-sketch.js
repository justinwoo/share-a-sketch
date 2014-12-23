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

function getErrorHandler(context) {
  return function (err, msg) {
    context.set('displayErrorMessage', true);
    context.set('errorMessage', 'We blew up with ' + err + msg);
  };
}

function appendPoints(d3Object, interval) {
  d3Object
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
}

export default Ember.Component.extend({
  trail: [],
  displayNewID: false,
  newID: null,
  newIDLink: null,
  interval: 10,
  cursorPosX: 0,
  cursorPosY: 0,
  displayHelp: false,
  displayErrorMessage: false,
  errorMessage: null,
  d3Model: null,
  isValid: Ember.computed(
    'trail',
    function () {
      return this.get('trail').length > 0;
    }
  ),
  initializeKeypresses: function () {
    var context = this;
    window.onkeypress = function (e) {
      if (e.which === keyCodes.question && e.shiftKey) {
        context.showHelp();
      }
      if (e.which === keyCodes.q && context.displayHelp) {
        context.hideHelp();
      }
      switch (e.which) {
        case keyCodes.h:
          case keyCodes.a:
          context.send('shiftLeft');
        break;
        case keyCodes.j:
          case keyCodes.s:
          context.send('shiftDown');
        break;
        case keyCodes.l:
          case keyCodes.d:
          context.send('shiftRight');
        break;
        case keyCodes.k:
          case keyCodes.w:
          context.send('shiftUp');
        break;
      }
    };
  },
  renderTrail: function () {
    var interval = this.get('interval');
    var trail = this.get('trail');
    appendPoints(
      this.get('d3Model').data(trail),
      interval
    );
  }.observes('trail'),
  didInsertElement: function () {
    var d3Model = window.d3.selectAll('.sketch-trail');
    var context = this;
    var sketchId = this.get('sketchId');
    var interval = this.get('interval');
    if (sketchId) {
      window.$.ajax({
        url: '/api/sketch/' + sketchId,
        method: 'GET',
      }).success(function (data) {
        context.set('trail', data.trail);
        // draw the elements from the data completely
        appendPoints(
          d3Model.selectAll('rect').data(data.trail).enter(),
          interval
        );
      }).fail(getErrorHandler(context));
    }
    this.set('d3Model', d3Model);
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
      var context = this;
      if (this.get('isValid')) {
        window.$.ajax({
          url: '/api/sketch',
          method: 'POST',
          data: {
            trail: this.get('trail')
          }
        }).success(function (response) {
          context.set('displayNewID', true);
          context.set('newID', response.id);
          context.set('newIDLink', '/sketches/' + response.id);
        }).fail(getErrorHandler(context));
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
