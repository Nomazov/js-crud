// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
    static #list = [];

    constructor(email, login, password) {
        this.email = email;
        this.login = login;
        this.password = password;
        this.id = new Date().getTime()
    }

    verifyPassword = (password) => this.password === password;

    static add = (user) => this.#list.push(user);

    static getList = () => this.#list;

    static getById = (id) => this.#list.find((user) => user.id === id);

    static deleteById = (id) => {
        const index = this.#list.findIndex((user) => user.id === id);

        if (index !== -1) {
            this.#list.splice(index, 1)
            return true;
        } else {
            return false
        }
    }

    static updateById = (id, { email }) => {
        const user = this.getById(id);

        if (user) {
            this.update(user, data);

            return true;
        } else {
            return false;
        }
    }

    static update = (user, { email }) => {
        if (email) {
            user.email = email;
        }
    }

}


class Product {
    static #list = [];

    constructor(name, price, description) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.id = Math.random();
        this.createDate = new Date().toISOString();
    };

    static getList = () => this.#list;

    static add = (product) => this.#list.push(product);

    static getById = (id) => this.#list.find(product => product.id === id);

    static updateById(id, data) {
        const product = this.getById(Number(id));

        if (product) {
            if (data.name) {
                product.name = data.name;
            };
            if (data.price) {
                product.price = data.price;
            };
            if (data.description) {
                product.description = data.description;
            };
            return true;
        } else {
            return false;
        };
    };

    static deleteByID(id) {
        const index = this.getById(id);

        if (index !== -1) {
            this.#list.splice(index, 1)
            return true;
        } else {
            return false
        };
    };
};

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
    // res.render генерує нам HTML сторінку

    const list = User.getList();

    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('user-index', {
        // вказуємо назву папки контейнера, в якій знаходяться наші стилі
        style: 'user-index',

        data: {
            users: {
                list,
                isEmpty: list.length === 0,
            }
        }
    })
    // ↑↑ сюди вводимо JSON дані
})


router.post('/user-create', function (req, res) {

    const { email, login, password } = req.body;

    const user = new User(email, login, password);

    User.add(user);

    console.log(User.getList());

    res.render('user-info', {

        style: 'user-info',
        info: "Користувач створений"
    })

})


router.get('/user-delete', function (req, res) {

    const { id } = req.query;

    User.deleteById(Number(id));

    res.render('user-info', {

        style: 'user-info',
        info: "Користувач видалений"
    })

})


router.post('/user-update', function (req, res) {

    const { email, password, id } = req.body;

    let result = false;

    const user = User.getById(Number(id));

    if (user.verifyPassword(password)) {
        User.update(user, { email });
        result = true;
    }

    res.render('user-info', {

        style: 'user-info',
        info: result
            ? "Email пошта оновлена"
            : "Сталася помилка"
    })

})

router.get('/product-create', function (req, res) {



    res.render('product-create', {

        style: 'product-create',


    })

})



router.post('/product-create', function (req, res) {

    const { name, price, description } = req.body;
    const product = new Product(name, price, description);
    Product.add(product);

    console.log(Product.getList());

    res.render('alert', {

        style: 'alert',
        info: 'Товар успішно створений'
    })

})



router.get('/product-list', function (req, res) {

    const list = Product.getList();

    res.render('product-list', {

        style: 'product-list',

        data: {
            products: {
                list,
                isEmpty: list.length === 0,
            }
        }
    })

})



router.get('/product-edit', function (req, res) {

    const { id } = req.query;

    const product = Product.getById(Number(id))

    if (!product) {
        res.render('alert', {
            style: 'alert',
            info: 'Товар з таким ID не знайдено'
        })
    }

    res.render('product-edit', {

        style: 'product-edit',

        product,
    })

})




router.post('/product-edit', function (req, res) {

    const { name, price, description, id } = req.body;

    const product = Product.getById(Number(id));

    if (!product) {
        res.render('alert', {
            style: 'alert',
            info: 'Товар з таким ID не знайдено'
        })
    } else {
        product.name = name;
        product.price = price;
        product.description = description;
    }

    res.render('alert', {

        style: 'alert',

        info: 'Дані успішно оновлено'
    })

})


router.get('/product-delete', function (req, res) {

    const { id } = req.query;

    const product = Product.deleteByID(Number(id))

    if (!product) {
        res.render('alert', {
            style: 'alert',
            info: 'Товар з таким ID не знайдено'
        })
    }

    res.render('alert', {

        style: 'alert',

        info: 'Дані успішно видалено'
    })

})



// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
