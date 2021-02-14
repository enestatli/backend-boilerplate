const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DislikeSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    entityId: {
      type: Schema.Types.ObjectId,
      ref: 'Entity',
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

const Dislike = mongoose.model('Dislike', DislikeSchema);

module.exports = Dislike;
