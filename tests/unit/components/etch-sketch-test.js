import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('etch-sketch', 'EtchSketchComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function() {
  // creates the component instance
  var component = this.subject();
  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});

test('test cursor functionality', function () {
  var component = this.subject();
  this.append();
  Ember.run(function () {
    var interval = component.interval;
    ok(component.cursorPosX === 0);
    ok(component.cursorPosY === 0);
    component.send('shiftRight');
    ok(component.cursorPosX === interval);
    ok(component.cursorPosY === 0);
    component.send('shiftDown');
    ok(component.cursorPosX === interval);
    ok(component.cursorPosY === interval);
    component.send('shiftUp');
    ok(component.cursorPosX === interval);
    ok(component.cursorPosY === 0);
    component.send('shiftLeft');
    ok(component.cursorPosX === 0);
    ok(component.cursorPosY === 0);
  });
});
