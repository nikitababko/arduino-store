// Импортируем модули из нода
const express = require("express");
const path = require("path");
const csrf = require("csurf"); // Защита сессии от перехвата данных
const flash = require("connect-flash"); // Сообщение об ошибки
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session"); // Создание сессии
const MongoStore = require("connect-mongodb-session")(session); // Хранение сессии с БД

// Импорт файла конфигурации
const keys = require("./keys");

// Импорт middleware
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const errorHandler = require("./middleware/error");
const fileMiddleware = require("./middleware/file");

// Imports routes
const homeRoutes = require("./routes/home");
const productsRoutes = require("./routes/products");
const deliveryRoutes = require("./routes/delivery");
const payRoutes = require("./routes/pay");
const policyRoutes = require("./routes/policy");
const aboutUsRoutes = require("./routes/about-us");
const addRoutes = require("./routes/add");
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const servicesRoutes = require("./routes/services");
const registrRoutes = require("./routes/registr");
const discountsRoutes = require("./routes/discounts");

// Main var
const app = express();

// Datebase
const store = new MongoStore({
    collection: "sessions",
    uri: keys.MONGODB_URI,
});

// Настройка "handlebars"
const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

// Делаем папку "Public" статической
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));

// Нужно для обработчика формы
app.use(express.urlencoded({ extended: true }));

// Настройка сессии
app.use(
    session({
        secret: keys.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store,
    })
);
app.use(fileMiddleware.single("avatar")); // Выбираем название поля, где у нас содержится фото (картинка) юзера
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

// Ригистрируем роуты "routes"
app.use("/", homeRoutes);
app.use("/products", productsRoutes);
app.use("/delivery", deliveryRoutes);
app.use("/pay", payRoutes);
app.use("/policy", policyRoutes);
app.use("/about-us", aboutUsRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/services", servicesRoutes);
app.use("/registr", registrRoutes);
app.use("/discounts", discountsRoutes);

// Регистрация 404 ошибки
app.use(errorHandler);

//////////////////////////////// Порт ///////////////////////////
const PORT = process.env.PORT || 3000;

// База данных
async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        app.listen(PORT, () => {
            console.log(`Server is runnig on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();
///////////////////////////////////////////////////////////////////////
