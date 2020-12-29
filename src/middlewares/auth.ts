import createError from 'http-errors';
import User from '@src/models/User';

const authMiddleware = (): any => ({
  before: (handler, next) => {
    if (!handler.event.headers.Authorization) {
      throw new createError.Unauthorized(
        JSON.stringify({ error: 'You are unauthorized.' }),
      );
    }

    const token = handler.event.headers.Authorization.split(' ')[1];
    return User.findByToken(token).then((user) => {
      console.log(user);
      if (!user) {
        throw new createError.Unauthorized(
          JSON.stringify({ error: 'You are unauthorized.' }),
        );
      }

      const oldBody = JSON.parse(handler.event.body);
      const newBody = JSON.stringify({ ...oldBody, user });
      handler.event.body = newBody;
      return next();
    });
  },
});

export default authMiddleware;
