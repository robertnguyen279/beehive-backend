import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import createError from 'http-errors';
import { authMiddleware } from '@src/middlewares/middy';
import Post from '@src/models/Post';
import Media from '@src/models/Media';
import User from '@src/models/User';
import Comment from '@src/models/Comment';

const updatePost: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  try {
    const post = await Post.findById(id)
      .populate({
        path: 'medias',
        model: Media,
        select: 'url',
      })
      .populate({
        path: 'likes',
        model: User,
        select: 'fullName',
      })
      .populate({
        path: 'comments',
        model: Comment,
        select: 'content',
      });

    if (!post) {
      throw new createError.InternalServerError(
        JSON.stringify({ message: 'Cannot find post.' }),
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        post,
      }),
    };
  } catch (error) {
    throw new createError.InternalServerError(
      JSON.stringify({ message: error }),
    );
  }
};

export const handler = authMiddleware(updatePost);
