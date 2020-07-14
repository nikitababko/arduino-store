const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
    res.render("policy", {
        title: "Политика",
        isPolicy: true
    });
});

module.exports = router;
