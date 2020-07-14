const { Router } = require("express");
const Order = require("../models/order");
const auth = require("../middleware/auth");
const router = Router();

router.get("/", auth, async (req, res) => {
    try {
        const orders = await Order.find({
            /* Если юзер с полем "userId" у нас совпадает с "req.user._id",
             то тогда это все наши заказы */
            "user.userId": req.user._id
        }).populate("user.userId");
        res.render("orders", {
            title: "Заказы",
            isOrders: true,
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.products.reduce((total, c) => {
                        return (total += c.count * c.product.price);
                    }, 0)
                };
            })
        });
    } catch (error) {
        console.log(error);
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const user = await req.user.populate("cart.items.productId").execPopulate();

        const products = user.cart.items.map(i => ({
            count: i.count,
            product: { ...i.productId._doc }
        }));

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            products: products
        });

        await order.save();
        // Метод для очистки, находится в моделе "user"
        await req.user.clearCart();

        res.redirect("/orders");
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
