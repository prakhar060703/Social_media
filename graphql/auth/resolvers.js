const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");
require("dotenv").config();

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Query: {
    async users() {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        throw new Error("Failed to fetch users");
      }
    },
  },
  Mutation: {
    async login(_, { username, password }) {
      const { valid, errors } = validateLoginInput(username, password);

      if(!valid){
        throw new UserInputError("username not correct", { errors });
      }
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("user not found", { errors });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          errors.general = "wrong credentials";
          throw new UserInputError("wrong credentials", { errors });
        }
      }

     

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      try {
        // Validate user data
        const { valid, errors } = validateRegisterInput(
          username,
          email,
          password,
          confirmPassword
        );
        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }
        // (You can add your validation logic here)

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new UserInputError("Username is taken", {
            errors: {
              username: "this Username Taken",
            },
          });
        }

        // Hash password
        password = await bcrypt.hash(password, 11);

        // Create new user
        const newUser = new User({
          email,
          username,
          password,
          createdAt: new Date().toISOString(),
        });

        // Save the new user
        const res = await newUser.save();

        // Generate JWT token
        const token = generateToken(res);

        // Return user data and token
        return {
          ...res._doc,
          id: res._id,
          token,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};
