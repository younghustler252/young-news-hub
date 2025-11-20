const mongoose = require('mongoose');
const { Schema } = mongoose;

const likeSchema = new Schema(
  {
    // 👤 User who liked
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 📄 Post that was liked (optional if comment is liked)
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },

    // 💬 Comment that was liked (optional if post is liked)
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// ✅ Ensure a like is tied to either a post OR a comment (not both)
likeSchema.pre('validate', function (next) {
  if (!this.post && !this.comment) {
    return next(new Error('A like must reference either a post or a comment.'));
  }
  if (this.post && this.comment) {
    return next(new Error('A like cannot reference both a post and a comment.'));
  }
  next();
});

// ✅ Indexes for uniqueness
likeSchema.index(
  { user: 1, post: 1 },
  { unique: true, partialFilterExpression: { post: { $exists: true } } }
);

likeSchema.index(
  { user: 1, comment: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true } } }
);

module.exports = mongoose.model('Like', likeSchema);
