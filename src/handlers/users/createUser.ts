import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import connectToDatabase from '@src/services/mongoose';
import createError from 'http-errors';
import User from '@src/models/User';
import commonMiddleware from '@src/middlewares/middy';
import dotenv from 'dotenv';

dotenv.config();

const createUser: APIGatewayProxyHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectToDatabase();
  console.log(event.body);
  const user = new User(event.body);

  try {
    const doc = await user.save();
    return {
      statusCode: 200,
      body: JSON.stringify(doc),
    };
  } catch (error) {
    throw new createError.InternalServerError(JSON.stringify(error));
  }
};

export const handler = commonMiddleware(createUser);
