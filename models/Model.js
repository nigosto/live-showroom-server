const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
  path: {
      type: Schema.Types.String,
      required: true
  },
  type: {
      type: Schema.Types.ObjectId,
      ref: 'Type',
      required: true
  },
  name: {
      type: Schema.Types.String,
      required: true
  },
  materials: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Material'
      }
  ],
  image: {
      type: Schema.Types.String
  }
});

const Model = mongoose.model('Model', modelSchema);

module.exports = Model;