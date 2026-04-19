// src/components/view/form/OrderForm.ts

import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export interface IOrderFormData {
  payment: "card" | "cash" | null;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    private events: IEvents,
  ) {
    super(container);

    this.paymentButtons = Array.from(
      this.container.querySelectorAll(".button_alt"),
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      '[name="address"]',
      this.container,
    );

    this.paymentButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const payment = btn.getAttribute("name") as "card" | "cash";
        this.events.emit("order:paymentSelected", { payment });
      });
    });
  }

  protected onInputChange(): void {
    this.events.emit("order:inputChanged", {
      address: this.addressInput.value,
    });
  }

  protected onSubmit(): void {
    this.events.emit("order:submit");
  }

  set selectedPayment(value: "card" | "cash" | null) {
    this.paymentButtons.forEach((btn) => {
      btn.classList.remove("button_alt-active");
    });
    if (value !== null) {
      const targetBtn = this.paymentButtons.find(
        (btn) => btn.getAttribute("name") === value,
      );
      if (targetBtn) {
        targetBtn.classList.add("button_alt-active");
      }
    }
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set isValid(value: boolean) {
    this.valid = value;
  }

  setErrors(errors: { payment?: string; address?: string }): void {
    const errorMessages = [];
    if (errors.payment) errorMessages.push(errors.payment);
    if (errors.address) errorMessages.push(errors.address);
    this.errors = errorMessages.join(", ");
  }
}
