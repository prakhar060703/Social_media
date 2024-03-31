
const Story = require("../../models/Story");

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


  },
  Mutation: {
    
    async createStory(_, { title, content }) {
      return await Story.create({ title, content });
    },
    updateStory: async (_, { id, title, content }) => {
      try {
        const story = await Story.findById(id);
        if (!story) {
          throw new Error("Story not found");
        }

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

    deleteStory: async (_, { id }) => {
      try {
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
