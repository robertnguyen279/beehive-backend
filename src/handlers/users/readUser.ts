import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { authMiddleware } from '@src/middlewares/middy';

const readUser: APIGatewayProxyHandler = async (event) => {
  const { authUser } = JSON.parse(event.body);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(authUser),
  };
};

export const handler = authMiddleware(readUser);
