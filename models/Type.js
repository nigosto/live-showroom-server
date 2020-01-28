const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typeSchema = new Schema({
  name: {
      type: Schema.Types.String,
      required: true
  },
  models: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Model'
      }
  ]
});

const Type = mongoose.model('Type', typeSchema);

module.exports = Type;