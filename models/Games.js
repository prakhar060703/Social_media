const { model, Schema } = require('mongoose');

const gameSchema = new Schema({
    title: String,
    platform: {
        type: [String],
        required: true // Ensures platform is always present
    }
});

module.exports = model('Games', gameSchema);
