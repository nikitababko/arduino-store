const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
    res.render("about-us", {
        title: "О нас",
        isAboutUs: true
    });
});

module.exports = router;
