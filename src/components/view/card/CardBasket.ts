// src/components/view/card/CardBasket.ts
import { Card } from "./Card";
import { IEvents } from "../../base/Events";

export class CardBasket extends Card {
    private deleteButton?: HTMLButtonElement;
    
    constructor(container: HTMLLIElement,private events: IEvents,private id: string) {
        super(container as HTMLElement);
        
        this.deleteButton = this.container.querySelector('.basket__item-delete') || undefined;
        
        if (this.deleteButton) {
            this.deleteButton.addEventListener('click', () => {
                this.events.emit('basket:remove', { id: this.id });
            });
        }
    }
}