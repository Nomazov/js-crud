// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

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


    // ↙️ cюди вводимо назву файлу з сontainer
    res.render('index', {
        // вказуємо назву папки контейнера, в якій знаходяться наші стилі
        style: 'index',
    })
    // ↑↑ сюди вводимо JSON дані
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
                isEmpty: list.le === 0,
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
