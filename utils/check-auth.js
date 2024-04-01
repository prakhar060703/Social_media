const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
require("dotenv").config();

console.log('qwerty123');

module.exports = (context) => {
    // context = { ... headers }
    console.log('qwerty');
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
      // Bearer ....

      console.log('authheader k andar');
      const token = authHeader.split('Bearer ')[1];
      if (token) {
        try {
            console.log('authheader k andar11');
          const user = jwt.verify(token, process.env.JWT_SECRET);
          return user;
        } catch (err) {
          throw new AuthenticationError('Invalid/Expired token');
        }
      }
      throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided');
  };