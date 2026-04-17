// src/components/view/Success.ts

import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";


export interface ISuccessData {
    total: number; 
}

export class Success extends Component<ISuccessData> {
    protected descriptionElement: HTMLElement; 
    protected closeButton: HTMLButtonElement;   
    
    constructor(protected container: HTMLElement,protected events: IEvents) {
        super(container);
        
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        
        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }
    
    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}