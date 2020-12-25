import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { echo } from '@src/helpers/example';

const hello: APIGatewayProxyHandler = async (event) => ({
  statusCode: 200,
  body: JSON.stringify({
    message: echo('This is just a simple test'),
    input: event,
  }),
});

export const handler = hello;
