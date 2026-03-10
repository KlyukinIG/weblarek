import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ShoppingCart {
    private _items: IProduct[] = [];

    constructor(private events: EventEmitter) {}

    // Получение массива товаров в корзине
    getItems(): IProduct[] {
        return this._items;
    }

    // Добавление товара в корзину
    addItem(item: IProduct): void {
        // Проверяем, есть ли уже такой товар в корзине
        if (!this.isInCart(item.id)) {
            this._items.push(item);
            this.events.emit('cart:changed', { 
                items: this._items,
                count: this.getCount(),
                total: this.getTotalPrice()
            });
        }
    }

    // Удаление товара из корзины
    removeItem(itemId: string): void {
        this._items = this._items.filter(item => item.id !== itemId);
        this.events.emit('cart:changed', { 
            items: this._items,
            count: this.getCount(),
            total: this.getTotalPrice()
        });
    }

    // Очистка корзины
    clear(): void {
        this._items = [];
        this.events.emit('cart:changed', { 
            items: this._items,
            count: 0,
            total: 0
        });
    }

    // Получение общей стоимости товаров
    getTotalPrice(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    // Получение количества товаров
    getCount(): number {
        return this._items.length;
    }

    // Проверка наличия товара в корзине
    isInCart(itemId: string): boolean {
        return this._items.some(item => item.id === itemId);
    }
}