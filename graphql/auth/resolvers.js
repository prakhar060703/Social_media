const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

require('dotenv').config();

const createToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const resolvers = {
  Query: {
    async users() {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        throw new Error('Failed to fetch users');
      }
    },
  },
  Mutation: {
    async createUser(_, { email, password }) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({
          email,
          password: hashedPassword,
        });
        const savedUser = await newUser.save();

        // Generate JWT token
        const token = createToken(savedUser);

        // Return token and user
        return { token, user: savedUser };
      } catch (error) {
        throw new Error(error.message); // Throw error message
      }
    },
  },
};

module.exports = resolvers;
