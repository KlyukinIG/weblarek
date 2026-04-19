// src/main.ts

import './scss/styles.scss';

import { EventEmitter } from "./components/base/Events";  
import { Api } from "./components/base/Api";              
import { AppApi } from "./components/models/AppApi";      
import { API_URL, CDN_URL } from "./utils/constants";     
import { cloneTemplate } from "./utils/utils";            

import { ProductCatalog } from "./components/models/ProductCatalog";  
import { ShoppingCart } from "./components/models/ShoppingCart";      
import { Buyer } from "./components/models/Buyer";                   

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

const cardCatalogTemplate = document.querySelector<HTMLTemplateElement>('#card-catalog')!;
const cardPreviewTemplate = document.querySelector<HTMLTemplateElement>('#card-preview')!;
const cardBasketTemplate = document.querySelector<HTMLTemplateElement>('#card-basket')!;
const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket')!;
const orderTemplate = document.querySelector<HTMLTemplateElement>('#order')!;
const contactsTemplate = document.querySelector<HTMLTemplateElement>('#contacts')!;
const successTemplate = document.querySelector<HTMLTemplateElement>('#success')!;

const events = new EventEmitter();

const catalog = new ProductCatalog(events); 
const cart = new ShoppingCart(events);      
const buyer = new Buyer(events);             

const apiBase = new Api(API_URL);            
const api = new AppApi(apiBase);             


const galleryContainer = document.querySelector('.gallery') as HTMLElement;     
const modalContainer = document.querySelector('.modal') as HTMLElement;        
const headerContainer = document.querySelector('.page__wrapper') as HTMLElement; 

const gallery = new Gallery(galleryContainer);    
const modal = new Modal(modalContainer, events);  
const header = new Header(events, headerContainer); 


const basket = new Basket(cloneTemplate(basketTemplate), events);           
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);   
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events); 
const success = new Success(cloneTemplate(successTemplate), events);        

let currentPreviewCard: CardPreview | undefined;

function convertPayment(payment: 'card' | 'cash' | null): 'online' | 'cash' | '' {
    if (payment === 'card') return 'online';
    if (payment === 'cash') return 'cash';
    return '';  
}

async function loadProducts() {
    try {
        const products = await api.getProducts();  
        catalog.setItems(products);          
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

function updateCatalog() {
    const products = catalog.getItems(); 
    
    const cards = products.map(product => {
        const container = cloneTemplate(cardCatalogTemplate) as HTMLElement;
        const card = new CardCatalog(container, {
            onClick: () => events.emit('card:select', { id: product.id })
        });
        
        card.title = product.title;                          
        card.price = product.price;                         
        card.category = product.category;                   
        card.image = CDN_URL + product.image;               
        
        return card.render();
    });
    
    gallery.catalog = cards;
}

function updateBasket() {
    const cartItems = cart.getItems(); 
    
    const items = cartItems.map((item, index) => {
        const container = cloneTemplate(cardBasketTemplate) as HTMLElement;
        
        const card = new CardBasket(container, {
            onClick: () => events.emit('basket:remove', { id: item.id })
        });
        
        card.title = item.title;        
        card.price = item.price;           
        card.index = index + 1;           
        
        return card.render();
    });
    
    basket.items = items;                  
    basket.total = cart.getTotalPrice();   
}

function updatePreview() {
    const product = catalog.getPreview(); 
    if (!product) return;
    
    const container = cloneTemplate(cardPreviewTemplate) as HTMLElement;
    
    const card = new CardPreview(container, {
        onClick: () => events.emit('card:buy', { id: product.id })
    });
    
    card.title = product.title;                          
    card.price = product.price;                          
    card.category = product.category;                  
    card.image = CDN_URL + product.image;                
    card.description = product.description || '';        
    card.buttonState = cart.isInCart(product.id);        
    
    currentPreviewCard = card;
    modal.open(card.render());  
}

function updateOrderForm() {
    const data = buyer.getData();  
    
    let payment: 'card' | 'cash' | null = null;
    if (data.payment === 'online') {
        payment = 'card';
    } else if (data.payment === 'cash') {
        payment = 'cash';
    }
    
    orderForm.selectedPayment = payment;  
    orderForm.address = data.address;     
    
    const errors = buyer.validate();     
    orderForm.setErrors({
        payment: errors.payment,
        address: errors.address
    });
    orderForm.isValid = !errors.payment && !errors.address;
}

function updateContactsForm() {  
    const data = buyer.getData();
    contactsForm.email = data.email;   
    contactsForm.phone = data.phone;  
    
    const errors = buyer.validate();
    contactsForm.setErrors({
        email: errors.email,
        phone: errors.phone
    });
    contactsForm.isValid = !errors.email && !errors.phone;
}


loadProducts();  

events.on('catalog:changed', () => {
    updateCatalog(); 
});

events.on('basket:changed', () => {
    updateBasket();                                  
    header.counter = String(cart.getCount());        
});


events.on('basket:open', () => {
    modal.open(basket.render());  
});

events.on('preview:changed', () => {
    updatePreview();
});

events.on('card:select', (data: { id: string }) => {
    catalog.setPreview(data.id);  
});

events.on('card:buy', (data: { id: string }) => {
    const product = catalog.getProduct(data.id);
    if (!product) return;
    
    if (cart.isInCart(data.id)) {
        cart.removeItem(data.id);  
    } else {
        if (product.price === null) return;  
        cart.addItem(product);              
    }
    
    modal.close();  
    
    if (currentPreviewCard) {
        currentPreviewCard.buttonState = cart.isInCart(data.id);
    }
});

events.on('basket:remove', (data: { id: string }) => {
    cart.removeItem(data.id);
});

events.on('order:changed', () => {
    updateOrderForm();     
    updateContactsForm();  
});

events.on('order:start', () => {
    updateOrderForm();      
    modal.open(orderForm.render());
});

events.on('order:paymentSelected', (data: { payment: 'card' | 'cash' }) => {
    buyer.setField('payment', convertPayment(data.payment));
});


events.on('order:inputChanged', (data: { address: string }) => {
    buyer.setField('address', data.address);
});

events.on('order:submit', () => {
    const errors = buyer.validate();
    if (!errors.payment && !errors.address) {
        updateContactsForm();      
        modal.open(contactsForm.render()); 
    }
});

events.on('contacts:inputChanged', (data: { email: string; phone: string }) => {
    buyer.setField('email', data.email);
    buyer.setField('phone', data.phone);
});


events.on('order:pay', async () => {
    const errors = buyer.validate();
    if (errors.email || errors.phone) {
        updateContactsForm();  
        return;                
    }
    
    try {
        const orderData = {
            payment: buyer.getData().payment,
            address: buyer.getData().address,
            email: buyer.getData().email,
            phone: buyer.getData().phone,
            items: cart.getItems().map(item => item.id), 
            total: cart.getTotalPrice(),
        };
        
        const response = await api.postOrder(orderData);
        
        success.total = response.total;
        modal.open(success.render());
        
        cart.clear();
        buyer.clear();
        currentPreviewCard = null;
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

events.on('success:close', () => {
    modal.close();
});

