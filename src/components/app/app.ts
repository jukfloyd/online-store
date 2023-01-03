import ProductsListAppController from '../controller/controller';

class App {
  public controller: ProductsListAppController;
  constructor() {
      this.controller = new ProductsListAppController();
  }

  start(): void {

    // Search event
    document.querySelector('.search')?.addEventListener('input', () => {
      this.controller.updateFilterObject('search');
      this.controller.updateResults();
    });

    // Brand, Category events
    const checkSelectors: string[] = ['.filter-brand', '.filter-category'];
    checkSelectors.forEach((selector) => {
      document.querySelector(selector)?.addEventListener('click', (e: Event) => {
        const target: HTMLElement = <HTMLElement>e.target;
        if (target.nodeName === 'INPUT' || target.parentElement && target.parentElement.nodeName === 'LABEL') {
          this.controller.updateFilterObject(selector.replace('.filter-',''));
          this.controller.updateResults();
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
          this.controller.updateFilterObject(name);
          this.controller.updateResults(name);
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
          this.controller.updateFilterObject(name);
          this.controller.updateResults(name);
        });
      }
    });

    // Sort event
    document.querySelector('.sort')?.addEventListener('change', () => {
      this.controller.updateFilterObject('sort');
      this.controller.updateResults('sort');
    });

    // View type event
    document.querySelectorAll('.view-button').forEach(elem => {
      elem.addEventListener('click', (e: Event) => {
        document.querySelectorAll('.view-button').forEach(elem => {
          elem.classList.remove('active');
        })
        const target: HTMLElement = <HTMLElement>e.currentTarget;
        target.classList.add('active');
        this.controller.updateFilterObject('view');
        this.controller.updateResults();
      });
    });
    
    // REset Filter event
    document.querySelector('.filter-reset')?.addEventListener('click', () => {
      this.controller.resetFilter();
      this.controller.updateResults();
    });

    // Copy filter event
    document.querySelector('.filter-copy')?.addEventListener('click', () => {
      this.controller.copyFilter();
    });

    // Add to cart & Detail button event on product list page
    document.querySelector('.products-list')?.addEventListener('click', (e: Event) => {
      const target: HTMLElement = <HTMLElement>e.target;
      if (target.classList.contains('add-to-cart-button')) {
        this.controller.addOrDropCart(target);
      }
      if (target.classList.contains('detail-button')) {
        this.controller.goDetailPage(target);
      }
    });

    // Add to cart event on detail page
    document.querySelector('.product-page .add-to-cart-button')?.addEventListener('click', (e: Event) => {
      const target: HTMLElement = <HTMLElement>e.target;
      this.controller.addOrDropCart(target);
    });

    // Photo events
    document.querySelector('.product-page .product-photo-all')?.addEventListener('click', (e: Event) => {
      const target: HTMLElement = <HTMLElement>e.target;
      this.controller.showBigPicture(target);
    });

    // Go to cart event
    document.querySelector('.header-cart')?.addEventListener('click', () => {
      this.controller.goCart();
    });

    //  cart Add/ remove / promoCode
    document.querySelector('.cart-page')?.addEventListener('click', (e: Event) => {
      const target: HTMLElement = <HTMLElement>e.target;
      if (target.classList.contains('cart-minus')) {
        this.controller.minusCount(target);
      }
      if (target.classList.contains('cart-plus')) {
        this.controller.plusCount(target);
      }
      if (target.classList.contains('cart-promocode-add')) {
        this.controller.applyPromoCode();
      }
      if (target.classList.contains('cart-promocode-remove')) {
        this.controller.removePromoCode(target);
      }
      if (target.classList.contains('cart-buy')) {
        this.controller.goOrder();
      }
    });

    // Cart promo codes
    document.querySelector('.cart-promocode')?.addEventListener('input', (e: Event) => {
      const target: HTMLInputElement = <HTMLInputElement>e.target;
      this.controller.searchPromoCode(target);
    });

    // cart pagination
    document.querySelector('.cart-page-next')?.addEventListener('click', () => {
      this.controller.cartNextPage();
    });
    document.querySelector('.cart-page-prev')?.addEventListener('click', () => {
      this.controller.cartPrevPage();
    });
    document.querySelector('.cart-page-length')?.addEventListener('change', () => {
      this.controller.cartChangePageLength();
    });

    // Order buttons events
    document.querySelector('.order-accept')?.addEventListener('click', () => {
      this.controller.submitOrder();
    });
    document.querySelector('.order-cancel')?.addEventListener('click', () => {
      this.controller.closeOrder();
    });

    // Order fields events
    const orderSelectors = ['[name=order-name]', '[name=order-phone]', '[name=order-address]', '[name=order-email]', '[name=order-card-number]', '[name=order-card-until]', '[name=order-card-cvv]'];
    orderSelectors.forEach((selector) => {
      document.querySelector(selector)?.addEventListener('input', (e: Event) => {
        const target: HTMLInputElement = <HTMLInputElement>e.target;
        this.controller.formatField(target);
        this.controller.checkField(target);
      });
    });

  }

}

export default App;