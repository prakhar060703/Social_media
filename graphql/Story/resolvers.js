const { AuthenticationError } = require('apollo-server');
const Story = require("../../models/Story");
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Query: {
    stories: async () => {
      try {
        return await Story.find();
      } catch (error) {
        throw new Error("Failed to fetch stories: " + error.message);
      }
    },
    story: async (_, { id }) => {
      try {
        const story = await Story.findById(id);
        if (!story) {
          throw new Error("Story not found");
        }
        return story;
      } catch (error) {
        throw new Error("Failed to fetch story: " + error.message);
      }
    },
    async getStoriesByUser(_, { username }, context) {
      try {
        // Check authentication
        const user = checkAuth(context);
        
        // Fetch stories by username
        const stories = await Story.find({ username }).sort({ createdAt: -1 });
        return stories;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    createStory: async (_, { title, content }, context) => {
      // Authenticate user
      const user = checkAuth(context);

      try {
        // Create new story with username information
        const newStory = new Story({
          title,
          content,
          username: user.username, // Include username
          createdAt: new Date().toISOString()
        });

        // Save the story
        const story = await newStory.save();

        return story;
      } catch (error) {
        throw new Error("Failed to create story: " + error.message);
      }
    },
    updateStory: async (_, { id, title, content }, context) => {
      // Authenticate user
      const user = checkAuth(context);

      try {
        const story = await Story.findById(id);
        if (!story) {
          throw new Error("Story not found");
        }

        // Check if the user is the author of the story
        if (story.user.toString() !== user.id) {
          throw new AuthenticationError('Action not allowed');
        }

        // Update story
        if (title !== undefined) {
          story.title = title;
        }

        if (content !== undefined) {
          story.content = content;
        }

        story.updatedAt = new Date(); // Update updatedAt field
        await story.save();

        return story;
      } catch (error) {
        throw new Error("Failed to update story: " + error.message);
      }
    },
    deleteStory: async (_, { id }, context) => {
      // Authenticate user
      const user = checkAuth(context);

      try {
        const story = await Story.findById(id);
        if (!story) {
          throw new Error("Story not found");
        }

        // Check if the user is the author of the story
        if (story.user.toString() !== user.id) {
          throw new AuthenticationError('Action not allowed');
        }

        // Delete story
        const deletedStory = await Story.findByIdAndDelete(id);
        if (!deletedStory) {
          throw new Error("Story not found");
        }

        return true; // Return true if story is deleted successfully
      } catch (error) {
        throw new Error("Failed to delete story: " + error.message);
      }
    },
  },
};
