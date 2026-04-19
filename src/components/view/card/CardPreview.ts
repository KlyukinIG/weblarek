// src/components/view/card/CardPreview.ts

import { Card, ICardActions } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";

export class CardPreview extends Card {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    
    constructor(
        container: HTMLElement,
        actions?: ICardActions
    ) {
        super(container);
        
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        
        if (actions?.onClick && this.buttonElement) {
            this.buttonElement.addEventListener('click', (e) => {
                e.stopPropagation();
                actions.onClick?.(e);
            });
        }
    }
    
    set category(value: string) {
        this.categoryElement.textContent = value;
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this.categoryElement.classList.add(modifier);
        }
    }
    
    set image(value: string) {
        this.imageElement.src = value;
        this.imageElement.alt = this.titleElement.textContent || 'Товар';
    }
    
    set description(value: string) {
        this.descriptionElement.textContent = value;
    }
    
    set buttonState(inCart: boolean) {
        if (this.buttonElement && !this.buttonElement.disabled) {
            this.buttonElement.textContent = inCart ? 'Удалить из корзины' : 'Купить';
        }
    }
}