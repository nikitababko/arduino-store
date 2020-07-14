const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
    text: {
        type: String
    }
});

module.exports = model("Review", reviewSchema);
