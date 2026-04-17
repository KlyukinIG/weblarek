// src/components/view/form/OrderForm.ts

import { Form } from "./Form";
import { IEvents } from "../../base/Events";  // ← IEvents, а не EventEmitter
import { ensureElement } from "../../../utils/utils";

export interface IOrderFormData {
    payment: 'card' | 'cash' | null;
    address: string;
}


export class OrderForm extends Form<IOrderFormData> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;
    protected selectedPayment: 'card' | 'cash' | null = null;
    
    constructor(
        container: HTMLFormElement,
        private events: IEvents 
    ) {
        super(container);
        
        this.paymentButtons = Array.from(this.container.querySelectorAll('.button_alt'));
        this.addressInput = ensureElement<HTMLInputElement>('[name="address"]', this.container);
        
        this.paymentButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
                btn.classList.add('button_alt-active');
                this.selectedPayment = btn.getAttribute('name') as 'card' | 'cash';
                this.emitChange();
            });
        });
        
        this.updateValidState();
    }
    
    protected onInputChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.name === 'address') {
            this.emitChange();
        }
    }
    
    private emitChange(): void {
        this.updateValidState();
        this.events.emit('order:change', {
            payment: this.selectedPayment,
            address: this.addressInput.value
        });
    }
    
    private updateValidState(): void {
        const hasPayment = this.selectedPayment !== null;
        const hasAddress = this.addressInput.value.trim() !== '';
        this.valid = hasPayment && hasAddress;
    }
    
    protected onSubmit(): void {
        this.events.emit('order:submit', {
            payment: this.selectedPayment,
            address: this.addressInput.value
        });
    }
    
    clear(): void {
        this.selectedPayment = null;
        this.addressInput.value = '';
        this.paymentButtons.forEach(btn => {
            btn.classList.remove('button_alt-active');
        });
        this.errors = '';
        this.valid = false;
    }
    
    setErrors(errors: { payment?: string; address?: string }): void {
        const errorMessages = [];
        if (errors.payment) errorMessages.push(errors.payment);
        if (errors.address) errorMessages.push(errors.address);
        this.errors = errorMessages.join(', ');
        this.updateValidState();
    }
}