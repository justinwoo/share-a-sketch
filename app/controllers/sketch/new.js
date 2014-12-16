import Ember from 'ember';

export default Ember.ObjectController.extend({
  interval: 10,
  cursorPosX: 0,
  cursorPosY: 0,
  isValid: Ember.computed(
    'trail',
    function () {
      return this.get('trail').length > 0;
    }
  ),
  actions: {
    save: function () {
      if (this.get('isValid')) {
        var transitionToRoute = this.transitionToRoute;
        this.get('model').save().then(function (sketch) {
          transitionToRoute('sketches.show', sketch);
        });
      } else {
        this.set('errorMessage', 'You can\'t save an empty sketch');
      }
    },
    moveLeft: function () {
      var interval = this.get('interval');
      var x = this.get('cursorPosX');
      if (x > 0) {
        this.set('cursorPosX', x - interval);
      }
    },
    moveUp: function () {
      var interval = this.get('interval');
      var y = this.get('cursorPosY');
      if (y > 0) {
        this.set('cursorPosY', y - interval);
      }
    },
    moveDown: function () {
      var interval = this.get('interval');
      var y = this.get('cursorPosY');
      if (y < 600) {
        this.set('cursorPosY', y + interval);
      }
    },
    moveRight: function () {
      var interval = this.get('interval');
      var x = this.get('cursorPosX');
      if (x < 800) {
        this.set('cursorPosX', x + interval);
      }
    }
  }
});
