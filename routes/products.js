const { Router } = require("express");
const Product = require("../models/product");
const Review = require("../models/review");
const auth = require("../middleware/auth");
const router = Router();

// "Get" запрос, который мы передаем в "index.js"
router.get("/", async (req, res) => {
    const products = await Product.find()
        // Выводит всю инфу о польователе
        .populate("userId")
        /* Выводит только "name" 
        .populate("userId", "email name")
        */
        //    Выводит все атрибуты заказа на страницу
        .select();
    /* Выводит только "price title", "img" отображаться не будет 
        .select("price title");
         */

    // console.log(products);
    const review = await Review.find();
    // console.log(review);
    res.render("products", {
        isProducts: true,
        title: "Товары",
        text: review.text,
        review,
        products,
    });
});

//////////////////////////////////// Админка ///////////////////////////////////
// Роутер для "product-edit.hbs"
router.get("/:id/edit", auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect("/");
    }
    // Получаем
    const product = await Product.findById(req.params.id);

    res.render("product-edit", {
        title: `Изменить ${product.title}`,
        product,
    });
});

// Редактирование "product.hbs"
router.post("/edit", auth, async (req, res) => {
    const { id } = req.body;
    // delete req.body.id;
    await Product.findByIdAndUpdate(id, req.body);
    // await Product.findById(id, req.body);
    res.redirect("/products");
});

// Удалить курс в редактировании
router.post("/remove", auth, async (req, res) => {
    try {
        await Product.deleteOne({
            _id: req.body.id,
        });
        res.redirect("/products");
    } catch (error) {
        console.log(error);
    }
});

// Просмотр продукта
router.get("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);

    res.render("product", {
        layout: "empty",
        title: `${product.title}`,
        img: product.img,
        price: product.price,
        product3d: product.product3d,

        intro: product.intro,
        text_one: product.text_one,
        img_one: product.img_one,
        text_two: product.text_two,
        img_two: product.img_two,
        text_three: product.text_three,
        subtitle_one: product.subtitle_one,
        text_four: product.text_four,
        img_three: product.img_three,
        text_five: product.text_five,
        subtitle_two: product.subtitle_two,
        text_six: product.text_six,
        img_four: product.img_four,
        subtitle_three: product.subtitle_three,
        text_seven: product.text_seven,
        img_five: product.img_five,
        subtitle_four: product.subtitle_four,
        text_eight: product.text_eight,
        subtitle_five: product.subtitle_five,
        text_nine: product.text_nine,
        subtitle_six: product.subtitle_six,
        text_ten: product.text_ten,
        img_six: product.img_six,
        text_eleven: product.text_eleven,
        img_seven: product.img_seven,
        text_twelve: product.text_twelve,
        img_eight: product.img_eight,
        text_thirteen: product.text_thirteen,
    });
});

// Reviews
// router.post("/review", async (req, res) => {
//     const review = new Review({
//         text: req.body.text
//     });
//     try {
//         await review.save();
//         res.redirect("/products");
//     } catch (error) {
//         console.log(error);
//     }
// });
////////////////////////////////////////////////////////////////////////////////////
module.exports = router;
