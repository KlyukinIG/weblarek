// src/components/view/Basket.ts

import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketData> {
  protected listContainer: HTMLElement;
  protected button: HTMLButtonElement;
  protected totalElement: HTMLElement;

  constructor(container: HTMLElement,protected events: IEvents) {
    super(container);

    this.listContainer = ensureElement<HTMLElement>(".basket__list",this.container);
    this.button = ensureElement<HTMLButtonElement>(".basket__button",this.container);
    this.totalElement = ensureElement<HTMLElement>(".basket__price",this.container);

    this.button.addEventListener("click", () => {
      this.events.emit("order:start");
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      this.listContainer.innerHTML =
        '<li class="basket__item" style="text-align: center; justify-content: center;">Корзина пуста</li>';
      this.button.disabled = true;
    } else {
      this.listContainer.replaceChildren(...items);
      this.button.disabled = false;
    }
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}
