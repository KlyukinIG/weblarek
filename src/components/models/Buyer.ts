import { IBuyer, TPayment, TValidationErrors } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private _payment: TPayment | null = null;
  private _address: string = "";
  private _email: string = "";
  private _phone: string = "";

  constructor(private events: IEvents) {}

  // Универсальный метод для сохранения значения поля
  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    switch (field) {
      case "payment":
        this._payment = value as TPayment;
        break;
      case "address":
        this._address = value as string;
        break;
      case "email":
        this._email = value as string;
        break;
      case "phone":
        this._phone = value as string;
        break;
    }
    this.events.emit("order:changed");
  }

  // Получение всех данных покупателя
  getData(): IBuyer {
    return {
      payment: this._payment || "", 
      address: this._address,
      email: this._email,
      phone: this._phone,
    };
  }

  // Очистка данных
  clear(): void {
    this._payment = null;
    this._address = "";
    this._email = "";
    this._phone = "";
    this.events.emit("order:changed");
  }

  // Валидация данных
  validate(): TValidationErrors {
    const errors: TValidationErrors = {};

    // Валидация способа оплаты
    if (!this._payment) {
      errors.payment = "Выберите способ оплаты";
    }

    // Валидация адреса
    if (!this._address || this._address.trim() === "") {
      errors.address = "Укажите адрес доставки";
    }

    // Валидация email
    if (!this._email || this._email.trim() === "") {
      errors.email = "Укажите email";
    }

    // Валидация телефона
    if (!this._phone || this._phone.trim() === "") {
      errors.phone = "Укажите телефон";
    }
    return errors;
  }
}
