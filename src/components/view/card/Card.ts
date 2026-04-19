// src/components/view/card/Card.ts

import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export interface ICardActions {
    onClick?: (event?: MouseEvent) => void;
}
export interface ICardData {
    title: string;      
    price: number | null;   
}

export abstract class Card extends Component<ICardData> {
    protected titleElement: HTMLElement;     
    protected priceElement: HTMLElement;   
    protected buttonElement?: HTMLButtonElement;     

    constructor(container: HTMLElement) {
        super(container);
        
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);   
        this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement || undefined;   
    }
  
    set title(value: string) {
        this.titleElement.textContent = value; 
    }
    
    set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно';
            this.disableButton();
        } else {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }
    
    disableButton() {
        if (this.buttonElement) {  
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
        }
    }
}