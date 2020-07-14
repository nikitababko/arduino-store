const { Router } = require("express");
const bcrypt = require("bcryptjs"); // Шифровальщик ключей для пароля юзера
const crypto = require("crypto"); // Шифровальная библиотека
const { validationResult } = require("express-validator/check");
const nodemailer = require("nodemailer"); // Мэйлер
const sendgrid = require("nodemailer-sendgrid-transport"); // Сервис для мейлов
const User = require("../models/user");
const keys = require("../keys/index");
const regEmail = require("../emails/registration");
const resetEmail = require("../emails/reset");
const { registerValidators } = require("../utils/validators");
const router = Router();

// Объект транспортер для емейлов
const transporter = nodemailer.createTransport(
    sendgrid({
        auth: { api_key: keys.SENDGRID_API_KEY }
    })
);

router.get("/login", async (req, res) => {
    res.render("auth/login", {
        title: "Авторизация",
        isLogin: true,
        // Сообщение об ошибки
        loginError: req.flash("loginError"),
        registerError: req.flash("registerError")
    });
});

router.get("/logout", async (req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth/login#login");
    });
});

router.post("/login", async (req, res) => {
    // Проверка на существования пользователя
    try {
        const { email, password } = req.body;

        const candidate = await User.findOne({ email });

        // Если пользователь существует, то мы будем с ним работать
        if (candidate) {
            // Проверка пароля на совпадение
            const areSame = await bcrypt.compare(password, candidate.password);
            // Если "areSame" = true, то мы заходим
            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err;
                    }
                    res.redirect("/");
                });
            } else {
                // Сообщение об ошибки
                req.flash("loginError", "Введен неверный пароль");
                res.redirect("/auth/login#login");
            }
        } else {
            // Сообщение об ошибки
            req.flash("loginError", "Такого пользователя не существует");
            // Редирект
            res.redirect("/auth/login#login");
        }
    } catch (error) {
        console.log(error);
    }
});

// Register
router.post("/register", registerValidators, async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validation email
        const errors = validationResult(req);
        // Проверка на ошибки
        if (!errors.isEmpty()) {
            req.flash("registerError", errors.array()[0].msg);
            return res.status(422).redirect("/auth/login#register");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            name,
            password: hashPassword,
            cart: { items: [] }
        });
        await user.save();
        // Отправляем письмо пользователю о его успешной регистрации
        await transporter.sendMail(regEmail(email));
        res.redirect("/auth/login#login");
    } catch (e) {
        console.log(e);
    }
});

//////////////////////////////// Восстановление пароля /////////////////////////////////
router.get("/reset", (req, res) => {
    res.render("auth/reset", {
        title: "Восстановить пароль",
        error: req.flash("error")
    });
});
// Обработка токена и защита
router.get("/password/:token", async (req, res) => {
    // Не допускаем на данную страницу посторонних, у кого нету токена
    if (!req.params.token) {
        return res.redirect("/auth/login");
    }

    try {
        // Находим пользвоателя, у которого есть определенный токен в базе данных
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: { $gt: Date.now() }
        });
        // Если у нас нету такого пользователя
        if (!user) {
            return res.redirect("/auth/login");
            // Если найден, то
        } else {
            res.render("auth/password", {
                title: "Восстановить доступ",
                error: req.flash("error"),
                userId: user._id.toString(),
                token: req.params.token
            });
        }
    } catch (error) {
        console.log(error);
    }
});
////////////////////////////////////////////////////////////////////////////////////////

// POST для восстановления пароля
router.post("/reset", (req, res) => {
    try {
        // Шифруем ключ
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                // Если ключ не сгенерировался, то ошибка
                req.flash("error", "Произошла неведомая ошибка, повторите попытку позже");
                return res.redirect("/auth/reset");
            }

            const token = buffer.toString("hex");
            const candidate = await User.findOne({ email: req.body.email });

            // Если такой человек найден, то можно работать
            if (candidate) {
                candidate.resetToken = token;
                // задаем время жизни токену
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                // Ждем сохранения юзера в базу данных
                await candidate.save();
                // Отправляем ему письмо
                await transporter.sendMail(resetEmail(candidate.email, token));
                res.redirect("/auth/login");
                // Иначе делаем другую логику
            } else {
                req.flash("error", "Такого email-а не существует");
                res.redirect("/auth/reset");
            }
        });
    } catch (error) {
        console.log(error);
    }
});

// Обработка защиты восстановления пароля
router.post("/password", async (req, res) => {
    try {
        // Ишем данную инфу о пользователе
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: { $gt: Date.now() }
        });
        // Если пользователь найден
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            // Удаляем все данные, связаныне с восстановлением
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            res.redirect("/auth/login");
        } else {
            req.flash("loginError", "Время жизни токена истекло");
            res.redirect("/auth/login");
        }
    } catch (error) {
        console.log * error;
    }
});

module.exports = router;
