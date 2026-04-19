// src/components/view/form/Form.ts

import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;
    
    constructor(protected container: HTMLFormElement) {
        super(container);
        
        this.submitButton = ensureElement<HTMLButtonElement>('.button', this.container);
        this.errorsContainer = ensureElement<HTMLElement>('.form__errors', this.container);
        
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.onSubmit();
        });
        
        this.container.addEventListener('input', () => {
            this.onInputChange();
        });
    }
    
    protected abstract onInputChange(): void;
    protected abstract onSubmit(): void;
    

    set errors(value: string) {
        this.errorsContainer.textContent = value;
    }
    
    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }
}