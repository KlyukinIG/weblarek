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
        
        this.updateValidState();
    }
    
    protected onInputChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.name === 'email' || target.name === 'phone') {
            this.emitChange();
        }
    }
    
    private emitChange(): void {
        this.updateValidState();
        this.events.emit('contacts:change', {
            email: this.emailInput.value,
            phone: this.phoneInput.value
        });
    }
    
    private updateValidState(): void {
        const emailValid = this.validateEmail(this.emailInput.value);
        const phoneValid = this.validatePhone(this.phoneInput.value);
        this.valid = emailValid && phoneValid;
    }
    
    // Валидация email
    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email.trim() !== '' && emailRegex.test(email);
    }
    
    // Валидация телефона
    private validatePhone(phone: string): boolean {
        const phoneRegex = /^[\d\s+()-]{10,}$/;
        return phone.trim() !== '' && phoneRegex.test(phone);
    }
    
    protected onSubmit(): void {
        this.events.emit('order:pay', {
            email: this.emailInput.value,
            phone: this.phoneInput.value
        });
    }
    
    clear(): void {
        this.emailInput.value = '';
        this.phoneInput.value = '';
        this.errors = '';
        this.valid = false;
    }
    
    setErrors(errors: { email?: string; phone?: string }): void {
        const errorMessages = [];
        if (errors.email) errorMessages.push(errors.email);
        if (errors.phone) errorMessages.push(errors.phone);
        this.errors = errorMessages.join(', ');
        this.updateValidState();
    }
}