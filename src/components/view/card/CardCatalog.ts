// src/components/view/card/CardCatalog.ts

import { Card, ICardActions } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";

export class CardCatalog extends Card {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    
    constructor(
        container: HTMLElement,
        actions?: ICardActions
    ) {
        super(container);
        
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        
        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
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
}