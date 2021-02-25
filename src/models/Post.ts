import mongoose, { Document, model, Schema, Model } from 'mongoose';

export interface Post {
  content: string;
  postBy: Schema.Types.ObjectId;
  medias: Array<Schema.Types.ObjectId>;
  comments: Array<Schema.Types.ObjectId>;
  likes: Array<Schema.Types.ObjectId>;
}

const PostSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    postBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    medias: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Media',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Post =
  (mongoose.models.Post as Model<Document<Post>>) ||
  model<Document<Post>, Model<Document<Post>>>('Post', PostSchema);

export default Post;
