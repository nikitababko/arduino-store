const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
    res.render("discounts", {
        title: "Акции"
    });
});

module.exports = router;
