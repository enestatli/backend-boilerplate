const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Entity',
    },
    content: {
      type: String,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;

//TODO: if needed add later!

// responseTo: {
//   type: Schema.Types.ObjectId,
//   ref: 'User',
// },
