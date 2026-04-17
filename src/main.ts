
import './scss/styles.scss';

import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { AppApi } from "./components/models/AppApi";
import { API_URL, CDN_URL } from "./utils/constants";

//Модель данных
import { ProductCatalog } from "./components/models/ProductCatalog";
import { ShoppingCart } from "./components/models/ShoppingCart";
import { Buyer } from "./components/models/Buyer";

//View компоненты 
import { Header } from "./components/view/Header";
import { Gallery } from "./components/view/Gallery";
import { Modal } from "./components/view/Modal";
import { Basket } from "./components/view/Basket";
import { Success } from "./components/view/Success";
import { OrderForm } from "./components/view/form/OrderForm";
import { ContactsForm } from "./components/view/form/ContactsForm";
import { CardCatalog } from "./components/view/card/CardCatalog";
import { CardPreview } from "./components/view/card/CardPreview";
import { CardBasket } from "./components/view/card/CardBasket";


// Создаём брокер событий
const events = new EventEmitter();

// Создаём модели данных 
const catalog = new ProductCatalog(events);  
const cart = new ShoppingCart(events);       
const buyer = new Buyer(events);            

// Создаём API
const apiBase = new Api(API_URL);            
const api = new AppApi(apiBase);           

// Находим элементы
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('.modal') as HTMLElement;
const headerContainer = document.querySelector('.page__wrapper') as HTMLElement;

// Создаём View компоненты
const gallery = new Gallery(galleryContainer);    
const modal = new Modal(modalContainer, events);   
const header = new Header(events, headerContainer);  


let currentOrderForm: OrderForm | null = null;     // текущая форма заказа
let currentContactsForm: ContactsForm | null = null; // текущая форма контактов


// Функция для преобразования типа оплаты
function convertPayment(payment: 'card' | 'cash' | null): 'online' | 'cash' | '' {
    if (payment === 'card') {
        return 'online';
    }
    if (payment === 'cash') {
        return 'cash';
    }
    return '';
}


//Загрузка товаров
async function loadProducts() {
    try {
        console.log('Загружаем товары с сервера');
        const products = await api.getProducts();
        console.log(`Загружено ${products.length} товаров`);
        catalog.setItems(products);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

// Запускаем загрузку
loadProducts();


//ОТОБРАЖЕНИЕ КАТАЛОГА
// Когда товары загружены или обновлены - перерисовываем галерею
events.on('catalog:changed', () => {
// Обновляем каталог
    const products = catalog.getItems();
    
    // Создаём карточку
    const cards = products.map(product => {
        const template = document
            .querySelector<HTMLTemplateElement>('#card-catalog')!
            .content.firstElementChild!.cloneNode(true) as HTMLElement;
        
        const card = new CardCatalog(template, events, product.id);
        
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = CDN_URL + product.image;  
        
        return card.render(); 
    });
    
    // Отображаем все карточки в галерее
    gallery.catalog = cards;
});

// ОТКРЫТИЕ ПРЕВЬЮ ТОВАРА
// Когда пользователь кликнул на карточку
events.on('card:select', (data: { id: string }) => {
    catalog.setPreview(data.id); 
});

// ПОКАЗ ПРЕВЬЮ В МОДАЛЬНОМ ОКНЕ 
events.on('preview:changed', () => {
    const product = catalog.getPreview();
    if (!product) {
        console.log('Товар не найден');
        return;
    }
    
    const template = document
        .querySelector<HTMLTemplateElement>('#card-preview')!
        .content.firstElementChild!.cloneNode(true) as HTMLElement;
    
    // Создаём карточку
    const card = new CardPreview(template, events, product.id);
    
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = CDN_URL + product.image;
    card.description = product.description || '';
    
    // Проверяем, есть ли товар в корзине
    card.buttonState = cart.isInCart(product.id);
    
    // Открываем модальное окно
    modal.open(card.render());
});

// ДОБАВЛЕНИЕ/УДАЛЕНИЕ ТОВАРА
// Когда пользователь нажал "Купить" или "Удалить" в превью
events.on('card:buy', (data: { id: string }) => {
    const product = catalog.getProduct(data.id);
    if (!product) {
        return;
    }
    
    if (cart.isInCart(data.id)) {
// Удаляем из корзины
        cart.removeItem(data.id);
    } else {
        // Проверяем, есть ли цена (нельзя купить товар без цены)
        if (product.price === null) {
            return;
        }
// Добавляем в корзину
        cart.addItem(product);
    }
    
    // Закрываем модальное окно после действия
    modal.close();
});

// ОБНОВЛЕНИЕ СЧЁТЧИКА В ХЕДЕРЕ
// Когда корзина изменилась (добавили/удалили товар)
events.on('basket:changed', () => {
//Получили количество товаров в корзине
    const count = cart.getCount();
//Обновляем счетчик корзины
    header.counter = String(count);  
});

// ОТКРЫТИЕ КОРЗИНЫ 
// Когда пользователь нажал на иконку корзины в хедере
events.on('basket:open', () => {
    renderBasket(); 
});

// Функция для отображения корзины
function renderBasket() {
// Получаем товары в корзине
    const cartItems = cart.getItems();
   
    // Создаём карточки для каждого товара в корзине
    const items = cartItems.map((item, index) => {
        const template = document
            .querySelector<HTMLTemplateElement>('#card-basket')!
            .content.firstElementChild!.cloneNode(true) as HTMLLIElement;
        
        const card = new CardBasket(template, events, item.id);
        card.title = item.title;
        card.price = item.price;
        card.index = index + 1; 
        
        return card.render();
    });
    
    // Создаём корзину
    const basketTemplate = document
        .querySelector<HTMLTemplateElement>('#basket')!
        .content.firstElementChild!.cloneNode(true) as HTMLElement;
    
    const basket = new Basket(basketTemplate, events);
    basket.items = items;  
    basket.total = cart.getTotalPrice(); 
    
    // Открываем модальное окно с корзиной
    modal.open(basket.render());
}

//  УДАЛЕНИЕ ИЗ КОРЗИНЫ 
// Когда пользователь нажал кнопку удаления в корзине
events.on('basket:remove', (data: { id: string }) => {
    cart.removeItem(data.id);
    renderBasket();  
});

//  НАЧАЛО ОФОРМЛЕНИЯ ЗАКАЗА 
// Когда пользователь нажал "Оформить" в корзине
events.on('order:start', () => {
    renderOrderForm();
});

// Функция для отображения формы заказа
function renderOrderForm() {
    const template = document
        .querySelector<HTMLTemplateElement>('#order')!
        .content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    
    currentOrderForm = new OrderForm(template, events);
// Открытие первой формы
    modal.open(currentOrderForm.render());
}

// ИЗМЕНЕНИЕ ДАННЫХ В ФОРМЕ ЗАКАЗА
// Когда пользователь выбрал оплату или ввёл адрес
events.on('order:change', (data: { payment: 'card' | 'cash' | null; address: string }) => {
    
    // Сохраняем данные в модель покупателя
    if (data.payment) {
        buyer.setField('payment', convertPayment(data.payment));
    }
    buyer.setField('address', data.address);
    
    // Получаем ошибки валидации из модели
    const errors = buyer.validate();
    console.log('Ошибки валидации:', errors);
    
    if (currentOrderForm) {
        // Показываем ошибки в форме
        currentOrderForm.setErrors({
            payment: errors.payment,
            address: errors.address
        });
        
        // Обновляем состояние кнопки "Далее"
        const hasPayment = data.payment !== null;
        const hasAddress = data.address.trim() !== '';
        currentOrderForm.valid = hasPayment && hasAddress;
    }
});

// ПЕРЕХОД К ФОРМЕ КОНТАКТОВ 
// Когда пользователь нажал "Далее" в форме заказа
events.on('order:submit', () => {
    renderContactsForm();
});

// Функция для отображения формы контактов
function renderContactsForm() {
    const template = document
        .querySelector<HTMLTemplateElement>('#contacts')!
        .content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    
    currentContactsForm = new ContactsForm(template, events);
// Открытие второй формы
    modal.open(currentContactsForm.render());

}

//  ИЗМЕНЕНИЕ ДАННЫХ В ФОРМЕ КОНТАКТОВ 
// Когда пользователь ввёл email или телефон
events.on('contacts:change', (data: { email: string; phone: string }) => {
 
    // Сохраняем данные в модель покупателя
    buyer.setField('email', data.email);
    buyer.setField('phone', data.phone);
    
    // Получаем ошибки валидации из модели
    const errors = buyer.validate();
    console.log('Ошибки валидации:', errors);
    
    if (currentContactsForm) {
        currentContactsForm.setErrors({
            email: errors.email,
            phone: errors.phone
        });
        
        // Обновляем состояние кнопки "Оплатить"
        const emailValid = data.email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
        const phoneValid = data.phone.trim() !== '' && /^[\d\s+()-]{10,}$/.test(data.phone);
        currentContactsForm.valid = emailValid && phoneValid;
    }
});

// ОПЛАТА ЗАКАЗА 
// Когда пользователь нажал "Оплатить"
events.on('order:pay', async () => {
    // Проверяем, все ли данные валидны
    if (!buyer.isValid()) {
        console.log('❌ Данные не валидны, проверьте форму');
        
        // Показываем ошибки в форме, если она ещё открыта
        const errors = buyer.validate();
        if (currentContactsForm) {
            currentContactsForm.setErrors({
                email: errors.email,
                phone: errors.phone
            });
        }
        return;
    }
    
    try {
        console.log('💳 Отправляем заказ на сервер...');
        
        // Формируем данные для отправки
        const orderData = {
            payment: buyer.getData().payment,
            address: buyer.getData().address,
            email: buyer.getData().email,
            phone: buyer.getData().phone,
            items: cart.getItems().map(item => item.id),
            total: cart.getTotalPrice(),
        };
        
        // Отправляем заказ на сервер
        const response = await api.postOrder(orderData);
        console.log(`✅ Заказ оформлен! ID: ${response.id}, Сумма: ${response.total}`);
        
        // Показываем сообщение об успехе
        const successTemplate = document
            .querySelector<HTMLTemplateElement>('#success')!
            .content.firstElementChild!.cloneNode(true) as HTMLElement;
        
        const success = new Success(successTemplate, events);
        success.total = cart.getTotalPrice();
        
        modal.open(success.render());
        console.log('🎉 Показано сообщение об успехе');
        
        // Очищаем корзину и данные покупателя
        cart.clear();
        buyer.clear();
        
        // Обновляем счётчик в хедере
        header.counter = String(cart.getCount());
        
        currentOrderForm = null;
        currentContactsForm = null;
        
    } catch (error) {
        console.error('❌ Ошибка при оформлении заказа:', error);
        alert('Произошла ошибка. Попробуйте ещё раз.');
    }
});

// ЗАКРЫТИЕ ПОСЛЕ УСПЕХА 
// Когда пользователь нажал "За новыми покупками!"
events.on('success:close', () => {
    modal.close();

    currentOrderForm = null;
    currentContactsForm = null;
});

// ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА (общее) 
// Когда модальное окно закрылось (крестик, оверлей, Escape)
events.on('modal:close', () => {
    currentOrderForm = null;
    currentContactsForm = null;
});
