import middy from '@middy/core';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import httpSecurityHeaders from '@middy/http-security-headers';
import cors from '@middy/http-cors';
import auth from './auth';
import connectToDB from './dbConnect';

export const commonMiddleware = (handler) =>
  middy(handler).use([
    httpErrorHandler(),
    httpEventNormalizer(),
    httpSecurityHeaders(),
    cors(),
    connectToDB(),
  ]);

export const authMiddleware = (handler) =>
  middy(handler).use([
    httpErrorHandler(),
    httpEventNormalizer(),
    httpSecurityHeaders(),
    cors(),
    connectToDB(),
    auth(),
  ]);
