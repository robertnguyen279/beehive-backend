import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { authMiddleware } from '@src/middlewares/middy';
import User from '@src/models/User';
import createError from 'http-errors';

const removeFriend: APIGatewayProxyHandler = async (event) => {
  const { authUser } = JSON.parse(event.body);
  const { id } = event.pathParameters;

  const friendsId = authUser.friends.map((friend) => friend._id);

  if (!friendsId.includes(id)) {
    throw new createError.InternalServerError(
      JSON.stringify({ message: 'The person is not your friend.' }),
    );
  }

  await User.findByIdAndUpdate(
    id,
    {
      $pull: { friends: authUser._id },
    },
    { new: true },
  );

  await User.findByIdAndUpdate(
    authUser._id,
    {
      $pull: { friends: id },
    },
    { new: true },
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};

export const handler = authMiddleware(removeFriend);
