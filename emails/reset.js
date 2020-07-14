// Восстановление пароля
const keys = require("../keys");

module.exports = function(email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: "Восстановление доступа", // Тема письма
        html: `
        <h1>Вы забыли пароль?</h1>
        <p>Если нет, то проигнорируйте данное письмо</p>
        <p>Иначе восспользуйтесь ссылкой ниже:</p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановить доступ</p>
        <hr>
        <a href="${keys.BASE_URL}">"HIC" - магазин по продаже "Arduino</a>
        ` // Передаем данные в формате "html"};
    };
};
