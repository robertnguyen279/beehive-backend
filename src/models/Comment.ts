import mongoose, { Document, model, Schema, Model } from 'mongoose';

export interface Comment {
  content: string;
  postBy: Schema.Types.ObjectId;
  comments: Array<Schema.Types.ObjectId>;
  lieks: Array<Schema.Types.ObjectId>;
}

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    postBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

const Comment =
  (mongoose.models.Post as Model<Document<Comment>>) ||
  model<Document<Comment>, Model<Document<Comment>>>('Comment', CommentSchema);

export default Comment;
