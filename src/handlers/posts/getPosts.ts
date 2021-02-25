import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import createError from 'http-errors';
import { authMiddleware } from '@src/middlewares/middy';
import Post from '@src/models/Post';
import Media from '@src/models/Media';
import User from '@src/models/User';
import Comment from '@src/models/Comment';

const getPosts: APIGatewayProxyHandler = async (event) => {
  const skip = event.queryStringParameters.skip
    ? parseInt(event.queryStringParameters.skip)
    : 0;
  const limit = event.queryStringParameters.limit
    ? parseInt(event.queryStringParameters.limit)
    : 10;

  try {
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'medias',
        model: Media,
        select: 'url',
      })
      .populate({
        path: 'likes',
        model: User,
        select: 'firstName lastName',
      })
      .populate({
        path: 'comments',
        model: Comment,
        select: 'content',
      });
    if (!posts) {
      throw new createError.InternalServerError(
        JSON.stringify({ message: 'Cannot find post.' }),
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        posts,
      }),
    };
  } catch (error) {
    throw new createError.InternalServerError(
      JSON.stringify({ message: error }),
    );
  }
};

export const handler = authMiddleware(getPosts);
