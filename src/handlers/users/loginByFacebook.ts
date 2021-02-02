import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import createError from 'http-errors';
import User from '@src/models/User';
import { commonMiddleware } from '@src/middlewares/middy';

const loginByFacebook: APIGatewayProxyHandler = async (event) => {
  const { email, name, avatar } = JSON.parse(event.body);

  try {
    const user = await User.findOne({ email, accountType: 'FacebookAuth' });

    if (!user) {
      const newUser = new User({
        email,
        firstName: name,
        avatar,
        accountType: 'FacebookAuth',
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

export const handler = commonMiddleware(loginByFacebook);
