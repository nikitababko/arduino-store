const { Schema, model } = require("mongoose");

// Создаем схему
const productSchema = new Schema({
    title: {
        type: String,
        // Подчеркиваем важность поля "title"
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: String,
    product3d: String,

    intro: String,
    text_one: String,
    img_one: String,
    text_two: String,
    img_two: String,
    text_three: String,
    subtitle_one: String,
    text_four: String,
    img_three: String,
    text_five: String,
    subtitle_two: String,
    text_six: String,
    img_four: String,
    subtitle_three: String,
    text_seven: String,
    img_five: String,
    subtitle_four: String,
    text_eight: String,
    subtitle_five: String,
    text_nine: String,
    subtitle_six: String,
    text_ten: String,
    img_six: String,
    text_eleven: String,
    img_seven: String,
    text_twelve: String,
    img_eight: String,
    text_thirteen: String,

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

productSchema.method("toClient", function () {
    const product = this.toObject();

    product.id = product._id;
    delete product._id;

    return product;
});

module.exports = model("Product", productSchema);
