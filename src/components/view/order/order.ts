import { checkResult } from "../../app/types";
import View from "../view";
import './order.css';

class OrderView extends View {

  showOrderForm(): void {
    document.querySelector('.body')!.classList.add('overlay');
    document.querySelector('.order-form')!.classList.remove('hide');
    document.querySelector('.order-form-success')!.classList.add('hide');
    document.querySelector('.order-page')!.classList.remove('hide');
  }

  closeOrderForm(): void {
    document.querySelector('.order-page')!.classList.add('hide');
    document.querySelector('.body')!.classList.remove('overlay');
  }

  submitOrderForm(): void {
    document.querySelector('.order-form')!.classList.add('hide');
    document.querySelector('.order-form-success')!.classList.remove('hide');
    setTimeout(() => {
      this.closeOrderForm();
      // window.location 
    }, 3000);
  }

  markField(input: HTMLInputElement, checkResult: checkResult): void {
    if (checkResult[0]) {
      input.classList.remove('error');
    } else {
      input.classList.add('error');
    }
  }

  styleCreditCardField(input: HTMLInputElement): void {
    ['visa','ecmc','mir'].forEach(item => {
      input.classList.remove(item);
    });
    if (input.value.match(/^5\d/) !== null) {
      input.classList.add('ecmc');
    } else if (input.value.match(/^4\d/) !== null) {
      input.classList.add('visa');
    } else if (input.value.match(/^22/) !== null) {
      input.classList.add('mir');
    }
  }

}

export default OrderView;