import ProductsListAppController from '../controller/controller';
import { IProductList } from './types';

class App {

  async fetchDatabase<T>(): Promise<T> {
    const response: Response = await fetch('https://dummyjson.com/products?limit=100');
    const data: T = await response.json()
    if (response.ok) {
        return data;
    } else {
      return Promise.reject('Error while receiving database');
    }
  }

  start(): void {
    this.fetchDatabase()
      .then(data => {
        const controller: ProductsListAppController = new ProductsListAppController(<IProductList>data);
        this.setEvents(controller);
      })
      .catch(error => console.error(error));
  }

  setEvents(controller: ProductsListAppController): void {

    // Search event
    document.querySelector('.search')?.addEventListener('input', () => {
      controller.updateFilterObject('search');
      controller.updateResults();
    });

    // Brand, Category events
    const checkSelectors: string[] = ['.filter-brand', '.filter-category'];
    checkSelectors.forEach((selector) => {
      document.querySelector(selector)?.addEventListener('click', (e: Event) => {
        const target: HTMLElement = <HTMLElement>e.target;
        if (target.nodeName === 'INPUT' || target.parentElement && target.parentElement.nodeName === 'LABEL') {
          controller.updateFilterObject(selector.replace('.filter-',''));
          controller.updateResults();
        }
      });
    });

    // Proce, Stock events
    const rangeNames: string[] = ['price', 'stock'];
    rangeNames.forEach((name) => {
      const priceFromSlider: Element | null = document.querySelector('.' + name + '-from');
      const priceToSlider: Element | null = document.querySelector('.' + name + '-to');
      if (priceFromSlider && priceToSlider) {
        priceToSlider.addEventListener('input', () => {
          const fromVal: number = parseInt((<HTMLInputElement>priceFromSlider).value);
          const toVal: number = parseInt((<HTMLInputElement>priceToSlider).value);
          if (toVal < fromVal) {
            (<HTMLInputElement>priceFromSlider).value = toVal.toString();
            if (fromVal.toString() === (<HTMLInputElement>priceFromSlider).min) {
              (<HTMLInputElement>priceToSlider).value = '0';
            }
          }
          controller.updateFilterObject(name);
          controller.updateResults(name);
        });
        priceFromSlider.addEventListener('input', () => {
          const fromVal: number = parseInt((<HTMLInputElement>priceFromSlider).value);
          const toVal: number = parseInt((<HTMLInputElement>priceToSlider).value);
          if (fromVal > toVal) {
            (<HTMLInputElement>priceToSlider).value = fromVal.toString();
            if (toVal.toString() === (<HTMLInputElement>priceToSlider).max) {
              (<HTMLInputElement>priceFromSlider).value = parseInt((<HTMLInputElement>priceToSlider).max).toString();
            }
          }
          controller.updateFilterObject(name);
          controller.updateResults(name);
        });
      }
    });

    // Sort event
    document.querySelector('.sort')?.addEventListener('change', () => {
      controller.updateFilterObject('sort');
      controller.updateResults('sort');
    });

    // View type event
    document.querySelectorAll('.view-button').forEach(elem => {
      elem.addEventListener('click', (e: Event) => {
        document.querySelectorAll('.view-button').forEach(elem => {
          elem.classList.remove('active');
        })
        const target: HTMLElement = <HTMLElement>e.currentTarget;
        target.classList.add('active');
        controller.updateFilterObject('view');
        controller.updateResults();
      });
    });
    
    // REset Filter event
    document.querySelector('.filter-reset')?.addEventListener('click', () => {
      controller.resetFilter();
      controller.updateResults();
    });

    // Copy filter event
    document.querySelector('.filter-copy')?.addEventListener('click', () => {
      controller.copyFilter();
    });

    // Add to cart & Detail button event on product list page
    document.querySelector('.products-list')?.addEventListener('click', (e: Event) => {
      const target: HTMLElement = <HTMLElement>e.target;
      if (target.classList.contains('add-to-cart-button')) {
        controller.addOrDropCart(target);
      }
      if (target.classList.contains('detail-button')) {
        controller.goDetailPage(target);
      }
    });

    // Add to cart event on detail page
    document.querySelector('.product-page .add-to-cart-button')?.addEventListener('click', (e: Event) => {
      const target: HTMLElement = <HTMLElement>e.target;
      controller.addOrDropCart(target);
    });

    // Photo events
    document.querySelector('.product-page .product-photo-all')?.addEventListener('click', (e: Event) => {
      const target: HTMLElement = <HTMLElement>e.target;
      controller.showBigPicture(target);
    });

    // Go to cart event
    document.querySelector('.header-cart')?.addEventListener('click', () => {
      controller.goCart();
    });

    //  cart Add/ remove / promoCode
    document.querySelector('.cart-page')?.addEventListener('click', (e: Event) => {
      const target: HTMLElement = <HTMLElement>e.target;
      if (target.classList.contains('cart-minus')) {
        controller.minusCount(target);
      }
      if (target.classList.contains('cart-plus')) {
        controller.plusCount(target);
      }
      if (target.classList.contains('cart-promocode-add')) {
        controller.applyPromoCode();
      }
      if (target.classList.contains('cart-promocode-remove')) {
        controller.removePromoCode(target);
      }
      if (target.classList.contains('cart-buy')) {
        controller.goOrder();
      }
    });

    // Cart promo codes
    document.querySelector('.cart-promocode')?.addEventListener('input', (e: Event) => {
      const target: HTMLInputElement = <HTMLInputElement>e.target;
      controller.searchPromoCode(target);
    });

    // cart pagination
    document.querySelector('.cart-page-next')?.addEventListener('click', () => {
      controller.cartNextPage();
    });
    document.querySelector('.cart-page-prev')?.addEventListener('click', () => {
      controller.cartPrevPage();
    });
    document.querySelector('.cart-page-length')?.addEventListener('change', () => {
      controller.cartChangePageLength();
    });

    // Order buttons events
    document.querySelector('.order-accept')?.addEventListener('click', () => {
      controller.submitOrder();
    });
    document.querySelector('.order-cancel')?.addEventListener('click', () => {
      controller.closeOrder();
    });

    // Order fields events
    const orderSelectors = ['[name=order-name]', '[name=order-phone]', '[name=order-address]', '[name=order-email]', '[name=order-card-number]', '[name=order-card-until]', '[name=order-card-cvv]'];
    orderSelectors.forEach((selector) => {
      document.querySelector(selector)?.addEventListener('input', (e: Event) => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        controller.formatField(target);
        controller.checkField(target);
      });
    });
  }

}

export default App;