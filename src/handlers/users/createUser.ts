import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import createError from 'http-errors';
import User from '@src/models/User';
import { commonMiddleware } from '@src/middlewares/middy';

const createUser: APIGatewayProxyHandler = async (event) => {
  let user = new User(JSON.parse(event.body));

  try {
    user.password = await User.generateHashPassword(user.password);
    const token = await user.generateSessionToken();
    const doc = await user.save();
    doc.password = undefined;
    doc.token = undefined;

    return {
      statusCode: 200,
      body: JSON.stringify({ user: doc, token }),
    };
  } catch (error) {
    throw new createError.InternalServerError(JSON.stringify(error));
  }
};

export const handler = commonMiddleware(createUser);
