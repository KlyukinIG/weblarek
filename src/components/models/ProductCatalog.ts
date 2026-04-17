import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class ProductCatalog {
    private _items: IProduct[] = [];
    private _preview: string | null = null;

    constructor(private events: IEvents) {}

    // Сохранение массива товаров
    setItems(items: IProduct[]): void {
        this._items = items;
        this.events.emit('catalog:changed');
    }

    // Получение массива всех товаров
    getItems(): IProduct[] {
        return this._items;
    }

    // Получение товара по id
    getProduct(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    // Сохранение товара для подробного отображения
    setPreview(id: string): void {
        this._preview = id;
        this.events.emit('preview:changed');
    }

    // Получение товара для подробного отображения
    getPreview(): IProduct | undefined {
        if (!this._preview) return undefined;
        return this.getProduct(this._preview);
    }
}