// src/components/view/card/CardBasket.ts

import { Card, ICardActions } from "./Card";
import { ensureElement } from "../../../utils/utils";

export class CardBasket extends Card {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;
    
    constructor(
        container: HTMLLIElement,
        actions?: ICardActions
    ) {
        super(container as HTMLElement);
        
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        
        if (actions?.onClick) {
            this.deleteButton.addEventListener('click', actions.onClick);
        }
    }
    
    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}