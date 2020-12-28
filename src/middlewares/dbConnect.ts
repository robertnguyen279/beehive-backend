import connectToDatabase from '@src/services/mongoose';

const dbConnection = () => {
  return {
    before: (handler, next) => {
      handler.context.callbackWaitsForEmptyEventLoop = false;
      connectToDatabase().then(next());
    },
  };
};

export default dbConnection;
