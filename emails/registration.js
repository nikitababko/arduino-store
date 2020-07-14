// Отправка емейлов при регистрации
const keys = require("../keys");

module.exports = function(email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: "Аккаунт был создан", // Тема письма
        html: `
        <h1>Добро пожаловать в наш магазин</h1>
        <p>Вы успешно создали аккаунт с email-ом ${email}</p>
        <hr>
        <a href="${keys.BASE_URL}">Магазин по продаже "Arduino</a>
        ` // Передаем данные в формате "html"
    };
};
