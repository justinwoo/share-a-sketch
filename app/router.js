import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('sketch', { path: 'sketches/:sketch_id' }, function() { });
  this.route('sketch/new');
});

export default Router;
