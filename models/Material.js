const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialSchema = new Schema({
  path: {
      type: Schema.Types.String,
      required: true
  },
  model: {
      type: Schema.Types.ObjectId,
      ref: 'Model',
      required: true
  },
  name: {
      type: Schema.Types.String,
      required: true
  }
});

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;