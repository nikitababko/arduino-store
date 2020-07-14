const { Router } = require("express");
const router = Router();
const Review = require("../models/review");

router.get("/", (req, res) => {
    res.render("index", {
        title: "Главная",
        isHome: true
    });
});

// add review
router.post("/", async (req, res) => {
    const review = new Review({
        text: req.body.text
    });
    try {
        await review.save();
        res.redirect("/products");
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
