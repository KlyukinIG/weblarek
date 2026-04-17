import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";


export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;
    protected _valid: boolean = false;
    
    constructor(protected container: HTMLFormElement) {
        super(container);
        
        this.submitButton = ensureElement<HTMLButtonElement>('.button', this.container);
        this.errorsContainer = ensureElement<HTMLElement>('.form__errors', this.container);
        
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this._valid) {
                this.onSubmit();
            }
        });
        
        this.container.addEventListener('input', (e) => {
            this.onInputChange(e);
        });
    }
    
    protected abstract onInputChange(event: Event): void;
    protected abstract onSubmit(): void;
    
    set errors(value: string) {
        this.errorsContainer.textContent = value;
    }
    
    set valid(value: boolean) {
        this._valid = value;
        this.submitButton.disabled = !value;
    }
    
    abstract clear(): void;
}