import mongoose, { Document, model, Schema, Model } from 'mongoose';

export interface Media {
  name: string;
  url: string;
  type: ['image', 'video'];
  postBy: Schema.Types.ObjectId;
  comments: Array<Schema.Types.ObjectId>;
  likes: Array<Schema.Types.ObjectId>;
}

const MediaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['video', 'image'],
    },
    postBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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

const Media =
  (mongoose.models.Media as Model<Document<Media>>) ||
  model<Document<Media>, Model<Document<Media>>>('Media', MediaSchema);

export default Media;
