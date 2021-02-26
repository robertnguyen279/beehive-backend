import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { commonMiddleware } from '@src/middlewares/middy';
import createError from 'http-errors';
import User from '@src/models/User';

const getUsers: APIGatewayProxyHandler = async (event) => {
  const skip = event.queryStringParameters.skip
    ? parseInt(event.queryStringParameters.skip)
    : 0;
  const limit = event.queryStringParameters.limit
    ? parseInt(event.queryStringParameters.limit)
    : 7;
  const sortby = event.queryStringParameters.sortBy;

  try {
    const users = await User.find()
      .select('firstName lastName avatar')
      .sort([[sortby, 'desc']])
      .limit(limit)
      .skip(skip);

    return {
      statusCode: 200,
      body: JSON.stringify({ users }),
    };
  } catch (error) {
    throw new createError.InternalServerError(JSON.stringify(error));
  }
};

export const handler = commonMiddleware(getUsers);
