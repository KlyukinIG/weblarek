import './scss/styles.scss';

import { Buyer } from './components/models/Buyer';
import { ProductCatalog } from './components/models/ProductCatalog';
import { ShoppingCart } from './components/models/ShoppingCart';
import {apiProducts} from './utils/data';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { AppApi } from './components/models/AppApi';
import { API_URL } from './utils/constants';


const event = new EventEmitter();
const catalog = new ProductCatalog(event);
const buyer = new Buyer(event);
const cart = new ShoppingCart(event);
const baseUrl = API_URL;

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
  //Методы модели католога
  catalog.setItems(items);
  console.log('Товары в катологе:',catalog.getItems());
  console.log('Первый товар в кталоге:',catalog.getProduct(items[0].id));
  catalog.setPreview(items[0].id)
  console.log('Товар для подробного отображения:',catalog.getPreview());
  //Методы модели корзины
  cart.addItem(items[0]);
  console.log('Получаем товары из корзины:', cart.getItems());
  console.log('Получаем количество товаров в корзне:', cart.getCount());
  console.log('Получаем стоимость товаров в корзне:', cart.getTotalPrice());
  console.log('Проверяем наличие товара в корзине:', cart.isInCart(items[0].id));
  cart.removeItem(items[0].id);
  console.log('Проверяем наличие товара в корзине:', cart.isInCart(items[0].id));
  cart.addItem(items[1]);
  console.log('Получаем товары из корзины:', cart.getItems());
  cart.clear();
  console.log('Получаем товары из корзины:', cart.getItems());
  //Методы модели покупатель
  buyer.setField('payment','cash');
  console.log('Данные покупателя:', buyer.getData());
  console.log('Проверка не заполненых полей покупателя:', buyer.validate());
  console.log('Очистка всех данных покупателя:', buyer.clear());
  console.log('Данные покупателя:', buyer.getData());
}).catch(error => console.error('Ошибка при получении данных с сервера:', error));


