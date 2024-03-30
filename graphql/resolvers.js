const Games = require("../models/Games");


module.exports = {
  Query: {
    async games() {
      try {
        // Fetch all games from the database
        const games = await Games.find();
        // Map the MongoDB _id to the id expected by GraphQL
        return games.map((game) => ({
          id: game._id.toString(), // Convert MongoDB _id to string
          title: game.title,
          platform: game.platform,
          // Add other fields if necessary
        }));
      } catch (error) {
        throw new Error("Failed to fetch games");
      }
    },
    async game(_, args) {
      try {
        const game = await Games.findOne({ _id: args.id }); // Find a single game by ID
        if (!game) {
          throw new Error("Game not found");
        }
        return {
          id: game._id.toString(), // Convert MongoDB _id to string
          title: game.title,
          platform: game.platform,
          // Add other fields if necessary
        };
      } catch (error) {
        throw new Error("Failed to fetch the game");
      }
    },
  },

  Mutation: {
    async addGame(_, { game }) {
      const { title, platform } = game; // Destructure 'game' object here
      const addedGame = new Games({
        title: title,
        platform: platform,
      });
      const res = await addedGame.save();

      // Return the added game object with its properties
      return {
        id: res.id,
        title: res.title,
        platform: res.platform,
      };
    },
  },
};
