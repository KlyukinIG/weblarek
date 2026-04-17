// src/components/view/card/CardPreview.ts

import { Card } from "./Card";
import { IEvents } from "../../base/Events";

export class CardPreview extends Card {
    constructor(container: HTMLElement,private events: IEvents,private id: string) {
        super(container);
        
        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', (e) => {
                e.stopPropagation(); 
                this.events.emit('card:buy', { id: this.id });
            });
        }
    }
    
    set buttonState(inCart: boolean) {
        if (this.buttonElement && !this.buttonElement.disabled) {
            this.buttonElement.textContent = inCart ? 'Удалить из корзины' : 'Купить';
        }
    }
}