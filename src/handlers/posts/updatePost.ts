import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import createError from 'http-errors';
import { authMiddleware } from '@src/middlewares/middy';
import Post from '@src/models/Post';

interface Body {
  authUser: any;
  content: string;
}

const updatePost: APIGatewayProxyHandler = async (event) => {
  const { content, authUser }: Body = JSON.parse(event.body);
  const { id } = event.pathParameters;
  const post = await Post.findById(id);

  if (!post) {
    throw new createError.InternalServerError(
      JSON.stringify({ message: 'Cannot find post.' }),
    );
  }
  if (JSON.stringify(post.postBy) !== JSON.stringify(authUser._id)) {
    throw new createError.Unauthorized(
      JSON.stringify({ message: 'You are unauthorized.' }),
    );
  }

  post.content = content;
  const postDoc = await post.save();

  return {
    statusCode: 200,
    body: JSON.stringify({
      post: postDoc,
    }),
  };
};

export const handler = authMiddleware(updatePost);
