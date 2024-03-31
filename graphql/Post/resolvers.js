
const Post = require("../../models/Post");

module.exports = {
  Query: {
    postes: async () => {
      try {
        return await Post.find();
      } catch (error) {
        throw new Error("Failed to fetch stories: " + error.message);
      }
    },
    post: async (_, { id }) => {
      try {
        const post = await Post.findById(id);
        if (!post) {
          throw new Error("Story not found");
        }
        return post;
      } catch (error) {
        throw new Error("Failed to fetch story: " + error.message);
      }
    },


  },
  Mutation: {
    
    async createPost(_, { title, content }) {
      return await Post.create({ title, content });
    },
    updatePost: async (_, { id, title, content }) => {
      try {
        const post = await Post.findById(id);
        if (!post) {
          throw new Error("Post not found");
        }

        if (title !== undefined) {
          post.title = title;
        }

        if (content !== undefined) {
          post.content = content;
        }

        post.updatedAt = new Date(); // Update updatedAt field
        await post.save();

        return post;
      } catch (error) {
        throw new Error("Failed to update story: " + error.message);
      }
    },

    deletePost: async (_, { id }) => {
      try {
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) {
          throw new Error("Story not found");
        }
        return true; // Return true if story is deleted successfully
      } catch (error) {
        throw new Error("Failed to delete story: " + error.message);
      }
    },


  },
};
