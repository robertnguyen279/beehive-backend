import connectToDatabase from '@src/services/mongoose';

const dbConnection = (): any => ({
  before: (handler, next) => {
    handler.context.callbackWaitsForEmptyEventLoop = false;
    connectToDatabase().then(next());
  },
});

export default dbConnection;
