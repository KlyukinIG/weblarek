// src/components/view/card/CardCatalog.ts

import { Card } from "./Card";
import { IEvents } from "../../base/Events";

export class CardCatalog extends Card {
  constructor(container: HTMLElement,private events: IEvents,private id: string) {
    super(container);

    this.container.addEventListener("click", () => {
      this.events.emit("card:select", { id: this.id });
    });
  }
}
