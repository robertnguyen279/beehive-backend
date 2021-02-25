import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
// import createError from 'http-errors';
import { authMiddleware } from '@src/middlewares/middy';
import Media from '@src/models/Media';
import Post from '@src/models/Post';

interface Media {
  url: string;
  name: string;
  type: string;
}

interface Body {
  authUser: any;
  medias: Array<Media>;
  content: string;
}

const createPost: APIGatewayProxyHandler = async (event) => {
  const { authUser, medias, content }: Body = JSON.parse(event.body);

  const postParams = {
    postBy: authUser._id,
    content,
    medias: [],
  };

  if (medias) {
    await Promise.all(
      medias.map(async (media) => {
        const newMedia = new Media({
          postBy: authUser._id,
          name: media.name,
          url: media.url,
          type: media.type,
        });
        const mediaDoc = await newMedia.save();
        postParams.medias.push(mediaDoc._id);
      }),
    );
  }

  const newPost = new Post(postParams);

  const postDoc = await newPost.save();

  return {
    statusCode: 200,
    body: JSON.stringify({
      post: postDoc,
    }),
  };
};

export const handler = authMiddleware(createPost);
