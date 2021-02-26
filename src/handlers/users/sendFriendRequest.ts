import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { authMiddleware } from '@src/middlewares/middy';
import User from '@src/models/User';
import createError from 'http-errors';

const sendFriendRequest: APIGatewayProxyHandler = async (event) => {
  const { authUser } = JSON.parse(event.body);
  const { id } = event.pathParameters;

  const friend = await User.findById(id);

  if (!friend) {
    throw new createError.InternalServerError(
      JSON.stringify({ message: 'Cannot find the friend.' }),
    );
  }

  if (
    friend.friends.includes(authUser._id) ||
    friend.requestsReceived.includes(authUser._id)
  ) {
    throw new createError.InternalServerError(
      JSON.stringify({ message: 'Cannot add friend.' }),
    );
  }

  friend.requestsReceived.push(authUser._id);
  await friend.save();

  await User.findByIdAndUpdate(authUser._id, {
    $push: { requestsSent: friend._id },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};

export const handler = authMiddleware(sendFriendRequest);
