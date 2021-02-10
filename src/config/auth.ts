export default {
  jwt: {
    secret: process.env.APP_SECRET || 'deafult',
    expiresIn: '1d',
  },
};
