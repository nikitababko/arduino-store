const { Schema, model } = require("mongoose");

// Схема пользователя
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    password: {
        type: String,
        required: true
    },
    avatarUrl: String,
    resetToken: String,
    resetTokenExp: Date,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                }
            }
        ]
    }
});

// Логика для добавления в корзину
userSchema.methods.addToCart = function(product) {
    // Клонируем массив айтемов
    /*
    Можно так
    const items = this.cart.items.concat();
    */

    // Либо используем оператор "spread - ..."
    const items = [...this.cart.items];
    // Находим индекс, где на каждой операции находим объект курсов
    const idx = items.findIndex(c => {
        return c.productId.toString() === product._id.toString();
    });
    /*Если индекс >=, то Значит,  что в корзине уже есть такой курс и мы должны увеличить кол-во */
    if (idx >= 0) {
        items[idx].count = items[idx].count + 1;
        // clonedItems[idx].count += 1;

        // Иначе добавляем туда курс
    } else {
        items.push({
            productId: product._id,
            count: 1
        });
    }
    this.cart = { items };
    return this.save();

    /* Либо можно так записать
    const clonedItems = [...this.cart.items];
    const idx = clonedItems.findIndex(c => {
        return c.courseId.toString() === course._id.toString();
    });

    if (idx >= 0) {
        clonedItems[idx].count = clonedItems[idx].count + 1;
        // clonedItems[idx].count += 1;

        // Иначе добавляем туда курс
    } else {
        clonedItems.push({
            courseId: course._id,
            count: 1
        });
    }

    const newCart = { items: clonedItems };
    this.cart = newCart;
    */
};

userSchema.methods.removeFromCart = function(id) {
    let items = [...this.cart.items];
    const idx = items.findIndex(c => c.productId.toString() === id.toString());

    if (items[idx].count === 1) {
        items = items.filter(c => c.productId.toString() !== id.toString());
    } else {
        items[idx].count--;
    }

    this.cart = { items };
    return this.save();
};

// Метод для очистки для роута "orders"
userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
};

// Регистрируем модель "User" и передаем в нее "userSchema"
module.exports = model("User", userSchema);
