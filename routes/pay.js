const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
    res.render("pay", {
        title: "Оплата",
        isPay: true
    });
});

module.exports = router;
