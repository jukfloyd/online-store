import { IProduct, IPagination, StrNumArr } from '../../app/types';
import View from '../view';
import './cart.css';

class CartView extends View {

  showHeaderCount(count: number): void {
    document.querySelector('.header-cart-count')!.innerHTML = count.toString();
  }

  showHeaderTotal(totalSum: number): void {
    document.querySelector('.header-cart-total')!.innerHTML = '€' + totalSum.toFixed(2);
  }

  showCart(data: IProduct[], count: number, total: number, cartPage: IPagination): void {
    document.querySelector('.cart-list')!.innerHTML = '';
    const fragment: DocumentFragment = document.createDocumentFragment();
    const carItemTemp: HTMLTemplateElement = <HTMLTemplateElement>document.querySelector('#templateCart');

    data.forEach((item, indx) => {
      const productClone: HTMLElement = <HTMLElement>carItemTemp.content.cloneNode(true);

      if (!item.cart) { item.cart = 0; }
      this.safeInnerHTML('.item-number', (indx + 1 + cartPage.countOnPage*(cartPage.pageNum - 1)).toString(), productClone);
      this.safeInnerHTML('.item-title', item.title, productClone);
      this.safeInnerHTML('.item-description', item.description, productClone);
      this.safeInnerHTML('.item-brand', item.brand, productClone);
      this.safeInnerHTML('.item-category', item.category, productClone);
      this.safeInnerHTML('.item-price', '€' + (item.price*item.cart).toFixed(2), productClone);
      this.safeInnerHTML('.item-discount', item.discountPercentage.toString() + '%', productClone);
      this.safeInnerHTML('.item-rating', item.rating.toString(), productClone);
      this.safeInnerHTML('.item-stock', item.stock.toString(), productClone);
      this.safeInnerHTML('.cart-item-count', item.cart.toString(), productClone);
      this.safeAttribute('.cart-minus', 'data-id', item.id.toString(), productClone);
      this.safeAttribute('.cart-plus', 'data-id', item.id.toString(), productClone);
      const imgDiv: Element | null = productClone.querySelector('.cart-image');
      if (imgDiv) {
        (<HTMLElement>imgDiv).style.backgroundImage = 'url(\'' + item.thumbnail + '\')';
      }
      

      fragment.append(productClone);
    });
    
    this.safeInnerHTML('.cart-count', count.toString());
    this.safeInnerHTML('.cart-total', '€' + total.toFixed(2));
    if (count) {
      document.querySelector('.cart-list')!.appendChild(fragment);
      document.querySelector('.cart-summary')!.classList.remove('hide');
      document.querySelector('.cart-page-count')!.innerHTML = cartPage.pageNum.toString();
      (<HTMLInputElement>document.querySelector('.cart-page-length')!).value = cartPage.countOnPage.toString();
    } else {
      document.querySelector('.cart-list')!.innerHTML = 'Корзина пуста...';
      document.querySelector('.cart-summary')!.classList.add('hide');
    }
    document.querySelector('.cart-page')!.classList.remove('hide');
  }

  showPromoCodeForAdd(promoObj: StrNumArr): void {
    this.safeInnerHTML('.cart-promocode-found .promo-name', promoObj[0]);
    this.safeInnerHTML('.cart-promocode-found .promo-discount', `${promoObj[1]}%`);
    document.querySelector('.cart-promocode-found')!.classList.remove('hide');
  }

  clearPromoCodeForAdd(): void {
    document.querySelector('.cart-promocode-found')!.classList.add('hide'); 
    (<HTMLInputElement>document.querySelector('.cart-promocode')!).value = '';
  }

  showAllAppliedPromoCodes(promoCodes: StrNumArr[], totalSumWithDiscount: number): void {
    if (promoCodes.length) {
      document.querySelector('.cart-promocode-list')!.innerHTML = '';

      const fragment: DocumentFragment = document.createDocumentFragment();
      const promoTemp: HTMLTemplateElement = <HTMLTemplateElement>document.querySelector('#templatePromo');
      promoCodes.forEach(item => {
        const promoClone: HTMLElement = <HTMLElement>promoTemp.content.cloneNode(true);
        this.safeInnerHTML('.promo-name', item[0], promoClone);
        this.safeInnerHTML('.promo-discount', item[1].toString() + '%', promoClone);
        this.safeAttribute('.cart-promocode-remove', 'data-id', item[0], promoClone);
        fragment.append(promoClone);
      });
      document.querySelector('.cart-promocode-list')!.appendChild(fragment);
      document.querySelector('.cart-total-discount')!.innerHTML = (promoCodes.length) ? '€' + totalSumWithDiscount.toFixed(2) : '';
      document.querySelector('.cart-promocode-block')!.classList.remove('hide');
      document.querySelector('.cart-total')!.classList.add('line-thru');
    } else {
      document.querySelector('.cart-total')!.classList.remove('line-thru');
      document.querySelector('.cart-promocode-block')!.classList.add('hide');
    }
  }
}

export default CartView;