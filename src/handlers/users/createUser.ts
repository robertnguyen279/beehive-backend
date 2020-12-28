import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import connectToDatabase from '@src/services/mongoose';
import createError from 'http-errors';
import User from '@src/models/User';
import commonMiddleware from '@src/middlewares/middy';

const createUser: APIGatewayProxyHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToDatabase();
  let user = new User(event.body);

  try {
    user.password = await User.generateHashPassword(user.password);
    const token = await user.generateSessionToken();
    const doc = await user.save();
    return {
      statusCode: 200,
      body: JSON.stringify({ user: doc, token }),
    };
  } catch (error) {
    throw new createError.InternalServerError(JSON.stringify(error));
  }
};

export const handler = commonMiddleware(createUser);
