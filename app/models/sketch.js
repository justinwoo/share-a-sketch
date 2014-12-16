import DS from 'ember-data';

export default DS.Model.extend({
  trail: DS.attr('object', { defaultValue: [] })
});
