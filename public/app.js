const toCurrency = (price) => {
    return new Intl.NumberFormat("ru-RU", {
        currency: "rub",
        style: "currency",
    }).format(price);
};

const toDate = (date) => {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).format(new Date(date));
};

document.querySelectorAll(".price").forEach((node) => {
    node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll(".date").forEach((node) => {
    node.textContent = toDate(node.textContent);
});

const $card = document.querySelector("#card");
if ($card) {
    $card.addEventListener("click", (event) => {
        if (event.target.classList.contains("js-remove")) {
            const id = event.target.dataset.id;

            // Переменная для защиты кнопки "Удалить"
            const csrf = event.target.dataset.csrf;

            location.reload();

            fetch("/card/remove/" + id, {
                method: "delete",
                // Для защиты кнопки "Удалить"
                headers: {
                    "X-XSRF-TOKEN": csrf,
                },
            })
                .then((res) => res.json())
                .then((card) => {
                    if (card.courses.length) {
                        const html = card.courses
                            .map((c) => {
                                return `
                                    <tr>
                                        <td>${c.title}</td>
                                        <td>${c.count}</td>
                                        <td>
                                        <button class="btn btm-small js-remove" data-id="${c.id}">Удалить</button>
                                        </td>
                                    </tr>
                                `;
                            })
                            .join("");
                        $card.querySelector("tbody").innerHTML = html;
                        $card.querySelector(".price").textContent = toCurrency(card.price);
                    } else {
                        $card.innerHTML = "<p>Корзина пуста</p>";
                    }
                });
        }
    });
}

// 3d product
const product3d = document.querySelector(".product-3d");
document.querySelector(".product-img").addEventListener("click", () => {
    product3d.style.display = "block";
});
document.querySelector(".product-3d__btn").addEventListener("click", () => {
    product3d.style.display = "none";
});
//============== Button burger-menu ============================//
const toggeSwitch = document.querySelector(".burger-btn");
const burgerMenu = document.querySelector(".burger-btn__menu");

const navBar = document.querySelector(".header__nav");

toggeSwitch.addEventListener("click", () => {
    burgerMenu.classList.toggle("burger-btn__menu--active");
    navBar.classList.toggle("header__nav--active");
});

// Инициализация стилей материалайза для аутентификации
// var instance = M.Tabs.init(document.querySelectorAll(".tabs"));
