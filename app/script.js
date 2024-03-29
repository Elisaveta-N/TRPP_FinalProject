const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar){
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close){
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}


var cartId = "cart";

/** Функции для работы с корзиной (хранение данных в localStorage): 
 * saveCart: Сохранение корзины;
 * getCart: Получение корзины;
 * clearCart: Очистка корзины
*/
var localAdapter = {

    /** Сохранение корзины */
    saveCart: function (object) {

        var stringified = JSON.stringify(object);
        localStorage.setItem(cartId, stringified);
        return true;

    },
    /** Получение корзины */
    getCart: function () {

        return JSON.parse(localStorage.getItem(cartId));

    },
    /** Очистка корзины */
    clearCart: function () {

        localStorage.removeItem(cartId);

    }

};

var storage = localAdapter;
/**
 * getHtml: Получение элемента из html документа;
 * setHtml: Добавление элемента в html документ;
 * itemData: Получение конкретного товара;
 * updateView: Обновление корзины;
 * emptyView: Очистка корзины;
 * updateTotal: Обновление итоговой стоимости;
 */
var helpers = {

    /** Получение элемента из html документа */
    getHtml: function (id) {

        return document.getElementById(id).innerHTML;

    },
    /** Добавление элемента в html документ */
    setHtml: function (id, html) {

        document.getElementById(id).innerHTML = html;
        return true;

    },
    /** Получение конкретного товара */
    itemData: function (object) {

        var count = object.querySelector(".count"),
            patt = new RegExp("^[1-9]([0-9]+)?р");
        count.value = (patt.test(count.value) === true) ? parseInt(count.value) : 1;

        var item = {

            name: object.getAttribute('data-name'),
            price: object.getAttribute('data-price'),
            id: object.getAttribute('data-id'),
            count: count.value,
            total: parseInt(object.getAttribute('data-price')) * parseInt(count.value)

        };
        return item;

    },
    /** Обновление корзины */
    updateView: function () {

        var items = cart.getItems(),
            template = this.getHtml('cartT'),
            compiled = _.template(template, {
                items: items
            });
        this.setHtml('cartItems', compiled);
        this.updateTotal();

    },
    /** Очистка корзины */
    emptyView: function () {

        this.setHtml('cartItems', '<p>Тут ничего нет</p>');
        this.updateTotal();

    },
    /** Обновление итоговой стоимости */
    updateTotal: function () {

        this.setHtml('totalPrice', cart.total + 'р');

    }

};

/**
 * getItems: Получение списка товаров;
 * setItems: Добавление товаров;
 * clearItems: Удаление товаров;
 * addItem: Добавление товара в список;
 * containsItem: Проверка товара на присутствие в корзине;
 * updateItem: Обновление количества тровара в корзине
 */
var cart = {

    count: 0,
    total: 0,
    items: [],
    /** Получение списка товаров */
    getItems: function () {

        return this.items;

    },
    /** Добавление товаров */
    setItems: function (items) {

        this.items = items;
        for (var i = 0; i < this.items.length; i++) {
            var _item = this.items[i];
            this.total += _item.total;
        }

    },
    /** Удаление товаров */
    clearItems: function () {

        this.items = [];
        this.total = 0;
        storage.clearCart();
        helpers.emptyView();

    },
    /** Добавление товара в список */
    addItem: function (item) {

        if (this.containsItem(item.id) === false) {

            this.items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                count: item.count,
                total: item.price * item.count
            });

            storage.saveCart(this.items);


        } else {

            this.updateItem(item);

        }
        this.total += item.price * item.count;
        this.count += item.count;
        helpers.updateView();

    },
    /** Проверка товара на присутствие в корзине */
    containsItem: function (id) {

        if (this.items === undefined) {
            return false;
        }

        for (var i = 0; i < this.items.length; i++) {

            var _item = this.items[i];

            if (id == _item.id) {
                return true;
            }

        }
        return false;

    },
    /** Обновление количества тровара в корзине */
    updateItem: function (object) {

        for (var i = 0; i < this.items.length; i++) {

            var _item = this.items[i];

            if (object.id === _item.id) {

                _item.count = parseInt(object.count) + parseInt(_item.count);
                _item.total = parseInt(object.total) + parseInt(_item.total);
                this.items[i] = _item;
                storage.saveCart(this.items);

            }

        }

    }

};

document.addEventListener('DOMContentLoaded', function () {

    if (storage.getCart()) {

        cart.setItems(storage.getCart());
        helpers.updateView();

    } else {

        helpers.emptyView();

    }
    var products = document.querySelectorAll('.product button');
    [].forEach.call(products, function (product) {

        product.addEventListener('click', function (e) {

            var item = helpers.itemData(this.parentNode);
            cart.addItem(item);


        });

    });

    document.querySelector('#clear').addEventListener('click', function (e) {

        cart.clearItems();

    });


});