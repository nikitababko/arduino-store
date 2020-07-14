const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
    res.render("registr", {
        title: "Информация"
    });
});

module.exports = router;
