const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EntitySchema = new Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      maxlength: 200,
    },
    views: {
      type: Number,
      default: 0,
    },
    privacy: {
      type: Number,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

var Entity = mongoose.model('Entity', EntitySchema);

module.exports = Entity;

//TODO: if needed add later!

// entity description minlength should be 15
