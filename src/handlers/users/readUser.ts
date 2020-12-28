import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { authMiddleware } from '@src/middlewares/middy';

const readUser: APIGatewayProxyHandler = async (event) => {
  const { user } = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};

export const handler = authMiddleware(readUser);
