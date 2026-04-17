// src/components/view/card/Card.ts

import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";

export interface ICardData {
    title: string;      
    price: number | null;
    category?: string;
    image?: string;
    description?: string;
    index?: number;
}

export abstract class Card extends Component<ICardData> {
    protected titleElement: HTMLElement;     
    protected priceElement: HTMLElement;   
    protected categoryElement?: HTMLElement;
    protected imageElement?: HTMLImageElement;
    protected buttonElement?: HTMLButtonElement;     
    protected descriptionElement?: HTMLElement;
    protected indexElement?: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);   
        this.categoryElement = container.querySelector('.card__category') || undefined;
        this.imageElement = container.querySelector('.card__image') as HTMLImageElement || undefined;
        this.descriptionElement = container.querySelector('.card__text') || undefined;
        this.indexElement = container.querySelector('.basket__item-index') || undefined;
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

    set category(value: string) {
        if (this.categoryElement) { 
            this.categoryElement.textContent = value;
            const modifier = categoryMap[value as keyof typeof categoryMap];
            if (modifier) {
                this.categoryElement.classList.add(modifier);
            }
        }
    }
    
    set image(value: string) {
        if (this.imageElement) {  
            this.imageElement.src = value;
            this.imageElement.alt = this.titleElement.textContent || 'Товар';  
        }
    }

    set description(value: string) {
        if (this.descriptionElement) {  
            this.descriptionElement.textContent = value;
        }
    }

    set index(value: number) {
        if (this.indexElement) {  
            this.indexElement.textContent = String(value);
        }
    }
    
    disableButton() {
        if (this.buttonElement) {  
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
        }
    }
}