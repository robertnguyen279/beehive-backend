import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import createError from 'http-errors';
import User from '@src/models/User';
import { commonMiddleware } from '@src/middlewares/middy';
import jwtDecode from 'jwt-decode';

interface DecodeToken {
  iss: string;
  email: string;
}

const loginByGoogle: APIGatewayProxyHandler = async (event) => {
  const { email, firstName, lastName, avatar, authToken } = JSON.parse(
    event.body,
  );

  try {
    const decodeToken: DecodeToken = jwtDecode(authToken);
    if (
      decodeToken.email !== email &&
      decodeToken.iss !== 'accounts.google.com'
    )
      throw new createError.InternalServerError('Token is invalid.');

    const user = await User.findOne({ email, accountType: 'GoogleAuth' });

    if (!user) {
      const newUser = new User({
        email,
        firstName,
        lastName,
        avatar,
        accountType: 'GoogleAuth',
      });
      const token = await newUser.generateSessionToken();
      await newUser.save();
      newUser.password = undefined;
      newUser.token = undefined;

      return {
        statusCode: 200,
        body: JSON.stringify({ user: newUser, token }),
      };
    }

    const token = await user.generateSessionToken();
    user.password = undefined;
    user.token = undefined;

    return {
      statusCode: 200,
      body: JSON.stringify({ user, token }),
    };
  } catch (error) {
    throw new createError.InternalServerError(JSON.stringify(error));
  }
};

export const handler = commonMiddleware(loginByGoogle);
