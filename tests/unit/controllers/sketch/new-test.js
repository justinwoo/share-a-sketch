import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:sketch/new', 'SketchNewController', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

// Replace this with your real tests.
test('movement actually works', function() {
  var controller = this.subject();
  var interval = controller.interval;
  ok(controller.cursorPosX === 0);
  ok(controller.cursorPosY === 0);
  controller.send('moveRight');
  ok(controller.cursorPosX === interval);
  ok(controller.cursorPosY === 0);
  controller.send('moveDown');
  ok(controller.cursorPosX === interval);
  ok(controller.cursorPosY === interval);
  controller.send('moveUp');
  ok(controller.cursorPosX === interval);
  ok(controller.cursorPosY === 0);
  controller.send('moveLeft');
  ok(controller.cursorPosX === 0);
  ok(controller.cursorPosY === 0);
});
