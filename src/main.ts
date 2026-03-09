import './scss/styles.scss';

import { Buyer } from './components/models/Buyer';
import { ProductCatalog } from './components/models/ProductCatalog';
import { ShoppingCart } from './components/models/ShoppingCart';
import {apiProducts} from './utils/data';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { AppApi } from './components/models/AppApi';

const event = new EventEmitter();
const catalog = new ProductCatalog(event);
const buyer = new Buyer(event);
const cart = new ShoppingCart(event);
const baseUrl = 'https://larek-api.nomoreparties.co/api/weblarek'

catalog.setItems(apiProducts.items);

console.log('Массив товаров из каталога: ', catalog.getItems());

const products = catalog.getItems();
cart.addItem(products[0]);

console.log('Товаров в корзине: ', cart.getItems());
console.log('Стоимость товаров: ', cart.getTotalPrice());
console.log('Информация о покупателе: ', buyer.getData());


const api = new Api(baseUrl);
const appApi =new AppApi(api);

appApi.getProducts().then(items => {
  console.log('Товары на сервере:', items);
  catalog.setItems(items);
  console.log('Товары в катологе:',catalog.getItems())
})


