const { Router } = require("express");
const Product = require("../models/product");
const auth = require("../middleware/auth");
const router = Router();

// Добавили "auth", что бы закрыть "add" для незареганных
router.get("/", auth, (req, res) => {
    res.render("add", {
        title: "Добавить курс",
        isAdd: true,
    });
});

// Обработчик для формы
// Handler for the form
// Добавили "auth", что бы закрыть "создание курса"
router.post("/", auth, async (req, res) => {
    // console.log(req.body);
    // Схема из модели баззы данных
    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        product3d: req.body.product3d,
        intro: req.body.intro,
        text_one: req.body.text_one,
        img_one: req.body.img_one,
        text_two: req.body.text_two,
        img_two: req.body.img_two,
        text_three: req.body.text_three,
        subtitle_one: req.body.subtitle_one,
        text_four: req.body.text_four,
        img_three: req.body.img_three,
        text_five: req.body.text_five,
        subtitle_two: req.body.subtitle_two,
        text_six: req.body.text_six,
        img_four: req.body.img_four,
        subtitle_three: req.body.subtitle_three,
        text_seven: req.body.text_seven,
        img_five: req.body.img_five,
        subtitle_four: req.body.subtitle_four,
        text_eight: req.body.text_eight,
        subtitle_five: req.body.subtitle_five,
        text_nine: req.body.text_nine,
        subtitle_six: req.body.subtitle_six,
        text_ten: req.body.text_ten,
        img_six: req.body.img_six,
        text_eleven: req.body.text_eleven,
        img_seven: req.body.img_seven,
        text_twelve: req.body.text_twelve,
        img_eight: req.body.img_eight,
        text_thirteen: req.body.text_thirteen,

        userId: req.user._id,
    });

    try {
        await product.save();
        res.redirect("/products");
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
