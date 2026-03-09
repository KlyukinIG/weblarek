import { IBuyer, TPayment, TValidationErrors } from '../../types';
import { EventEmitter } from '../base/Events';

export class Buyer {
    private _payment: TPayment | null = null;
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';

    constructor(private events: EventEmitter) {}

    // Универсальный метод для сохранения значения поля
    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        switch (field) {
            case 'payment':
                this._payment = value as TPayment;
                break;
            case 'address':
                this._address = value as string;
                break;
            case 'email':
                this._email = value as string;
                break;
            case 'phone':
                this._phone = value as string;
                break;
        }
        this.events.emit('buyer:changed', this.getData());
        this.validate(); // Автоматически валидируем при изменении
    }

    // Получение всех данных покупателя
    getData(): IBuyer {
        return {
            payment: this._payment || 'online', // Значение по умолчанию
            address: this._address,
            email: this._email,
            phone: this._phone
        };
    }

    // Очистка данных
    clear(): void {
        this._payment = null;
        this._address = '';
        this._email = '';
        this._phone = '';
        this.events.emit('buyer:changed', this.getData());
        this.events.emit('buyer:validation', {});
    }

    // Валидация данных
    validate(): TValidationErrors {
        const errors: TValidationErrors = {};

        // Валидация способа оплаты
        if (!this._payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        // Валидация адреса
        if (!this._address || this._address.trim() === '') {
            errors.address = 'Укажите адрес доставки';
        }

        // Валидация email
        if (!this._email || this._email.trim() === '') {
            errors.email = 'Укажите email';
        } else {
            // Простая проверка формата email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this._email)) {
                errors.email = 'Укажите корректный email';
            }
        }

        // Валидация телефона
        if (!this._phone || this._phone.trim() === '') {
            errors.phone = 'Укажите телефон';
        } else {
            // Проверка, что телефон содержит хотя бы 10 цифр
            const digitsOnly = this._phone.replace(/\D/g, '');
            if (digitsOnly.length < 10) {
                errors.phone = 'Укажите корректный телефон (минимум 10 цифр)';
            }
        }

        this.events.emit('buyer:validation', errors);
        return errors;
    }

    // Проверка валидности всех данных
    isValid(): boolean {
        return Object.keys(this.validate()).length === 0;
    }

    // Получение ошибок для конкретного поля
    getFieldError(field: keyof IBuyer): string | null {
        const errors = this.validate();
        return errors[field] || null;
    }
}