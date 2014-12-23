import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    return {
      sketchId: params.sketch_id
    };
  }
});
