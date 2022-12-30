import ProductsListAppController from '../controller/controller';

class App {
  public controller: ProductsListAppController;
  constructor() {
      this.controller = new ProductsListAppController();
  }

  start(): void {

    // Search event
    document.querySelector('.search')?.addEventListener('input', () => {
      this.controller.updateFilterObject();
      this.controller.updateResults();
    });

    // Brand, Category events
    const checkSelectors = ['.filter-brand', '.filter-category'];
    checkSelectors.forEach((selector) => {
      document.querySelector(selector)?.addEventListener('click', (e: Event) => {
        const target = <HTMLElement>e.target;
        if (target.nodeName === 'INPUT' || target.parentElement && target.parentElement.nodeName === 'LABEL') {
          this.controller.updateFilterObject();
          this.controller.updateResults();
        }
      });
    });

    // Proce, Stock events
    const rangeNames = ['price', 'stock'];
    rangeNames.forEach((name) => {
      const priceFromSlider: Element | null = document.querySelector('.' + name + '-from');
      const priceToSlider: Element | null = document.querySelector('.' + name + '-to');
      if (priceFromSlider && priceToSlider) {
        priceToSlider.addEventListener('input', () => {
          const fromVal: number = parseInt((<HTMLInputElement>priceFromSlider).value);
          const toVal: number = parseInt((<HTMLInputElement>priceToSlider).value);
          if (toVal < fromVal + 0) {
            (<HTMLInputElement>priceFromSlider).value = (toVal - 0).toString();
            if (fromVal.toString() === (<HTMLInputElement>priceFromSlider).min) {
              (<HTMLInputElement>priceToSlider).value = '0';
            }
          }
          this.controller.updateFilterObject();
          this.controller.updateResults(name);
        });
        priceFromSlider.addEventListener('input', () => {
          const fromVal: number = parseInt((<HTMLInputElement>priceFromSlider).value);
          const toVal: number = parseInt((<HTMLInputElement>priceToSlider).value);
          if (fromVal > toVal - 0) {
            (<HTMLInputElement>priceToSlider).value = (fromVal + 0).toString();
            if (toVal.toString() === (<HTMLInputElement>priceToSlider).max) {
              (<HTMLInputElement>priceFromSlider).value = (parseInt((<HTMLInputElement>priceToSlider).max) - 0).toString();
            }
          }
          this.controller.updateFilterObject();
          this.controller.updateResults(name);
        });
      }
    });

    // Sort event
    document.querySelector('.sort')?.addEventListener('change', () => {
      this.controller.updateFilterObject();
      this.controller.updateResults();
    });

    // View type event
    document.querySelectorAll('.view-button').forEach(elem => {
      elem.addEventListener('click', (e: Event) => {
        document.querySelectorAll('.view-button').forEach(elem => {
          elem.classList.remove('active');
        })
        const target = <HTMLElement>e.currentTarget;
        target.classList.add('active');
        this.controller.updateFilterObject();
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
      const target = <HTMLElement>e.target;
      if (target.classList.contains('add-to-cart-button')) {
        this.controller.addOrDropCart(target);
      }
    });

    // Go to cart event
    document.querySelector('.header-cart')?.addEventListener('click', () => {
      this.controller.goCart();
    });

    //  cart Add/ remove / promoCode
    document.querySelector('.cart-page')?.addEventListener('click', (e: Event) => {
      const target = <HTMLElement>e.target;
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
    });

    // Cart promo codes
    document.querySelector('.cart-promocode')?.addEventListener('input', (e: Event) => {
      const target = <HTMLInputElement>e.target;
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

  }

}

export default App;