import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ShoppingCart {
    private _items: IProduct[] = [];

    constructor(private events: IEvents) {}

    // Получение массива товаров в корзине
    getItems(): IProduct[] {
        return this._items;
    }

    // Добавление товара в корзину
    addItem(item: IProduct): void {
        // Проверяем, есть ли уже такой товар в корзине
        if (!this.isInCart(item.id)) {
            this._items.push(item);
            this.events.emit('basket:changed');
        }
    }

    // Удаление товара из корзины
    removeItem(itemId: string): void {
        this._items = this._items.filter(item => item.id !== itemId);
        this.events.emit('basket:changed');
    }

    // Очистка корзины
    clear(): void {
        this._items = [];
        this.events.emit('basket:changed');
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