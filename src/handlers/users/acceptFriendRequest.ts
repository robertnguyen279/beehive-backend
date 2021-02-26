import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { authMiddleware } from '@src/middlewares/middy';
import User from '@src/models/User';
import createError from 'http-errors';

const acceptFriendRequest: APIGatewayProxyHandler = async (event) => {
  const { authUser } = JSON.parse(event.body);
  const { id } = event.pathParameters;

  const friendsId = authUser.friends.map((friend) => friend._id);
  const requestsReceivedIds = authUser.requestsReceived.map((user) => user._id);

  if (friendsId.includes(id)) {
    throw new createError.InternalServerError(
      JSON.stringify({ message: 'Friend is already existed.' }),
    );
  }

  if (!requestsReceivedIds.includes(id)) {
    throw new createError.InternalServerError(
      JSON.stringify({ message: 'Cannot add friend.' }),
    );
  }

  await User.findByIdAndUpdate(
    id,
    {
      $pull: { requestsSent: authUser._id },
      $push: { friends: authUser._id },
    },
    { new: true },
  );

  await User.findByIdAndUpdate(
    authUser._id,
    { $pull: { requestsReceived: id }, $push: { friends: id } },
    { new: true },
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};

export const handler = authMiddleware(acceptFriendRequest);
