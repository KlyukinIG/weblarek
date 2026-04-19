// src/components/view/form/ContactsForm.ts

import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    
    constructor(
        container: HTMLFormElement,
        private events: IEvents
    ) {
        super(container);
        
        this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container);
    }
    
    protected onInputChange(): void {
        this.events.emit('contacts:inputChanged', {
            email: this.emailInput.value,
            phone: this.phoneInput.value
        });
    }
    
    protected onSubmit(): void {
        this.events.emit('order:pay');
    }
    
    set email(value: string) {
        this.emailInput.value = value;
    }
    
    set phone(value: string) {
        this.phoneInput.value = value;
    }
    
    set isValid(value: boolean) {
        this.valid = value;
    }
    
    setErrors(errors: { email?: string; phone?: string }): void {
        const errorMessages = [];
        if (errors.email) errorMessages.push(errors.email);
        if (errors.phone) errorMessages.push(errors.phone);
        this.errors = errorMessages.join(', ');
    }
}