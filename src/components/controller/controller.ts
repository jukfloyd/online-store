import {
  IProduct,
  IProductList,
  checkResult,
  IFilterSort,
  IPagination,
  number4Range,
  StrNumArr,
  stringPair,
} from '../app/types';
import ProductModel from '../model/model';
import ProductsView from '../view/products/products';
import CartModel from '../model/cart';
import CartView from '../view/cart/cart';
import OrderModel from '../model/order';
import OrderView from '../view/order/order';
import View from '../view/view';

class ProductsListController {
  filterSort: IFilterSort;
  productModel: ProductModel;
  productsView: ProductsView;
  cartModel: CartModel;
  cartView: CartView;
  orderModel: OrderModel;
  orderView: OrderView;
  view: View;
  cartPage: IPagination;

  constructor(database: IProductList) {
    this.productModel = new ProductModel(database);
    this.productsView = new ProductsView();
    this.cartModel = new CartModel(this.productModel.data.products);
    this.cartView = new CartView();
    this.orderModel = new OrderModel();
    this.orderView = new OrderView();
    this.view = new View();
    this.cartPage = { countOnPage: 50, pageNum: 1 };
    this.filterSort = { brands: [], categories: [] };

    const url: URL = new URL(window.location.href);
    const brandsParam: string | null = url.searchParams.get('brands');
    const categoriesParam: string | null = url.searchParams.get('categories');
    const sortParam: string | null = url.searchParams.get('sort');
    const priceParam: string | null = url.searchParams.get('price');
    const stockParam: string | null = url.searchParams.get('stock');
    const searchParam: string | null = url.searchParams.get('search');
    const viewParam: string | null = url.searchParams.get('view');
    let id: string | null = url.searchParams.get('id');
    let layer = '';
    const path: string = window.location.pathname;
    if (path !== '/' && path !== '/index.html') {
      layer = path.split('/')[1];
      if (layer === 'product') {
        id = path.split('/')[2];
      }
    }
    const countOnPage: string | null = url.searchParams.get('countOnPage');
    const pageNum: string | null = url.searchParams.get('pageNum');

    this.cartView.showHeaderCount(this.cartModel.getCount());
    this.cartView.showHeaderTotal(this.cartModel.getTotalSum());

    if (layer === '') {
      this.filterSort = {
        sort: sortParam || '',
        brands: brandsParam ? brandsParam.split('↕').map((_) => decodeURIComponent(_)) : [],
        categories: categoriesParam ? categoriesParam.split('↕').map((_) => decodeURIComponent(_)) : [],
      };
      if (priceParam) {
        this.filterSort.price = priceParam.split('↕').map((_) => parseInt(_)) as [number, number];
      }
      if (stockParam) {
        this.filterSort.stock = stockParam.split('↕').map((_) => parseInt(_)) as [number, number];
      }
      if (searchParam) {
        this.filterSort.search = decodeURIComponent(searchParam);
      }
      this.filterSort.viewType = viewParam === 'card' ? viewParam : '';
      this.createResults();
    } else if (layer === 'cart') {
      if (countOnPage && pageNum) {
        const count: number = parseInt(countOnPage);
        if (!Number.isNaN(count)) {
          if (document.querySelector('.cart-page-length [value="' + count + '"]')) {
            this.cartPage.countOnPage = count;
          }
        }
        if (!Number.isNaN(parseInt(pageNum))) {
          this.cartPage.pageNum = parseInt(pageNum);
          this.cartPage.pageNum = this.cartModel.getRealPageNum(this.cartPage);
        }
      }
      this.goCart();
    } else if (layer === 'product') {
      if (id && !Number.isNaN(-id)) {
        this.filterSort = {
          brands: [],
          categories: [],
          id: parseInt(id),
        };
        this.createProductPage();
      } else {
        this.view.show404();
      }
    } else {
      this.view.show404();
    }
  }

  createResults(): void {
    const data: IProductList = this.productModel.filterAndSort(this.filterSort);
    this.view.hideAllLayers();
    const priceRange: number4Range = this.productModel.getPriceRange();
    const stockRange: number4Range = this.productModel.getStockRange();
    const filterContent: IFilterSort = {
      brands: this.productModel.getSorted('brand'),
      categories: this.productModel.getSorted('category'),
      price: [priceRange[0], priceRange[1]],
      stock: [stockRange[0], stockRange[1]],
    };
    this.productsView.createProductsFilter(filterContent);
    this.productsView.updatePriceFilter(priceRange[2], priceRange[3]);
    this.productsView.updateStockFilter(stockRange[2], stockRange[3]);
    this.productsView.updateBrandFilter(this.filterSort, this.productModel.getCountByKey('brand'));
    this.productsView.updateCategoryFilter(this.filterSort, this.productModel.getCountByKey('category'));
    this.productsView.showProductsList(data, this.filterSort);
    this.productsView.updateOtherFilter(this.filterSort);
    this.productsView.changeCartButtons(this.cartModel.products);
  }

  updateResults(field?: string): void {
    const data: IProductList = this.productModel.filterAndSort(this.filterSort);
    const priceRange: number4Range = this.productModel.getPriceRange();
    const stockRange: number4Range = this.productModel.getStockRange();
    if (field !== 'price') {
      this.productsView.updatePriceFilter(priceRange[2], priceRange[3]);
    } else if (this.filterSort.price) {
      this.productsView.updatePriceFilter(this.filterSort.price[0], this.filterSort.price[1]);
    }
    if (field !== 'stock') {
      this.productsView.updateStockFilter(stockRange[2], stockRange[3]);
    } else if (this.filterSort.stock) {
      this.productsView.updateStockFilter(this.filterSort.stock[0], this.filterSort.stock[1]);
    }
    this.productsView.updateBrandFilter(this.filterSort, this.productModel.getCountByKey('brand'));
    this.productsView.updateCategoryFilter(this.filterSort, this.productModel.getCountByKey('category'));
    this.productsView.updateOtherFilter(this.filterSort);
    this.productsView.showProductsList(data, this.filterSort);
    this.productsView.changeCartButtons(this.cartModel.products);
  }

  updateUrl(): void {
    const filterParams: stringPair = {
      brands: this.filterSort.brands.map((_) => encodeURIComponent(_)).join('↕'),
      categories: this.filterSort.categories.map((_) => encodeURIComponent(_)).join('↕'),
      sort: this.filterSort.sort ? encodeURIComponent(this.filterSort.sort) : '',
      price: this.filterSort.price ? this.filterSort.price.join('↕') : '',
      stock: this.filterSort.stock ? this.filterSort.stock.join('↕') : '',
      search: this.filterSort.search ? encodeURIComponent(this.filterSort.search) : '',
      view: this.filterSort.viewType ? this.filterSort.viewType : '',
    };
    this.view.updateUrl('/', filterParams);
  }

  updateFilterObject(filterName?: string): void {
    // brands
    if (filterName === 'brand') {
      const brandInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.filter-brand input');
      const selectedBrands: string[] = [];
      brandInputs.forEach((input) => {
        if (input.checked) {
          selectedBrands.push(input.value);
        }
      });
      this.filterSort.brands = selectedBrands;
    }

    // categories
    if (filterName === 'category') {
      const categoryInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.filter-category input');
      const selectedCategories: string[] = [];
      categoryInputs.forEach((input) => {
        if (input.checked) {
          selectedCategories.push(input.value);
        }
      });
      this.filterSort.categories = selectedCategories;
    }

    // sort
    if (filterName === 'sort') {
      const sortField: Element | null = document.querySelector('.sort');
      if (sortField) {
        this.filterSort.sort = (<HTMLSelectElement>sortField).value;
      }
    }

    // price
    if (filterName === 'price') {
      const priceFromField: Element | null = document.querySelector('.price-from');
      const priceToField: Element | null = document.querySelector('.price-to');
      if (priceFromField && priceToField) {
        this.filterSort.price = [
          parseInt((<HTMLInputElement>priceFromField).value),
          parseInt((<HTMLInputElement>priceToField).value),
        ];
      }
    }

    // stock
    if (filterName === 'stock') {
      const stockFromField: Element | null = document.querySelector('.stock-from');
      const stockToField: Element | null = document.querySelector('.stock-to');
      if (stockFromField && stockToField) {
        this.filterSort.stock = [
          parseInt((<HTMLInputElement>stockFromField).value),
          parseInt((<HTMLInputElement>stockToField).value),
        ];
      }
    }

    // search
    if (filterName === 'search') {
      const searchField: Element | null = document.querySelector('.search');
      if (searchField) {
        this.filterSort.search = (<HTMLInputElement>searchField).value;
      }
    }

    // view
    if (filterName === 'view') {
      const viewField: Element | null = document.querySelector('.view-button.active');
      if (viewField) {
        this.filterSort.viewType = viewField.getAttribute('value') || '';
      }
    }

    this.updateUrl();
  }

  resetFilter(): void {
    this.filterSort.brands = [];
    this.filterSort.categories = [];
    delete this.filterSort.price;
    delete this.filterSort.stock;
    delete this.filterSort.search;
    this.updateUrl();
  }

  copyFilter(): void {
    navigator.clipboard.writeText(window.location.href);
    this.productsView.changeCopyButton();
  }

  addOrDropCart(target: HTMLElement): void {
    const id: string | null = target.getAttribute('data-id');
    if (id) {
      const product: IProduct | undefined = this.productModel.getProductById(parseInt(id));
      if (product) {
        this.cartModel.addOrDrop(product);
        this.cartView.showHeaderCount(this.cartModel.getCount());
        this.cartView.showHeaderTotal(this.cartModel.getTotalSum());
        this.productsView.changeCartButtons(this.cartModel.products);
      }
    }
  }

  goCart(): void {
    this.view.hideAllLayers();
    this.view.updateUrl('/cart', {
      countOnPage: this.cartPage.countOnPage.toString(),
      pageNum: this.cartPage.pageNum.toString(),
    });
    const productsPaged: IProduct[] = this.cartModel.filterByPage(this.cartPage);
    this.cartView.showCart(productsPaged, this.cartModel.getCount(), this.cartModel.getTotalSum(), this.cartPage);
    this.cartView.showAllAppliedPromoCodes(
      this.cartModel.getAllAppliedPromoCodes(),
      this.cartModel.getTotalSumWithDiscount()
    );
  }

  plusCount(target: HTMLElement): void {
    const id: string | null = target.getAttribute('data-id');
    if (id) {
      const product: IProduct | undefined = this.productModel.getProductById(parseInt(id));
      if (product) {
        this.cartModel.plusCount(product);
        this.cartPage.pageNum = this.cartModel.getRealPageNum(this.cartPage);
        const count: number = this.cartModel.getCount();
        const totalSum: number = this.cartModel.getTotalSum();
        this.cartView.showHeaderCount(count);
        this.cartView.showHeaderTotal(totalSum);
        const productsPaged: IProduct[] = this.cartModel.filterByPage(this.cartPage);
        this.cartView.showCart(productsPaged, count, totalSum, this.cartPage);
        this.cartView.showAllAppliedPromoCodes(
          this.cartModel.getAllAppliedPromoCodes(),
          this.cartModel.getTotalSumWithDiscount()
        );
      }
    }
  }

  minusCount(target: HTMLElement): void {
    const id: string | null = target.getAttribute('data-id');
    if (id) {
      const product: IProduct | undefined = this.productModel.getProductById(parseInt(id));
      if (product) {
        this.cartModel.minusCount(product);
        this.cartPage.pageNum = this.cartModel.getRealPageNum(this.cartPage);
        const count: number = this.cartModel.getCount();
        const totalSum: number = this.cartModel.getTotalSum();
        this.cartView.showHeaderCount(count);
        this.cartView.showHeaderTotal(totalSum);
        const productsPaged: IProduct[] = this.cartModel.filterByPage(this.cartPage);
        this.cartView.showCart(productsPaged, count, totalSum, this.cartPage);
        this.cartView.showAllAppliedPromoCodes(
          this.cartModel.getAllAppliedPromoCodes(),
          this.cartModel.getTotalSumWithDiscount()
        );
      }
    }
  }

  searchPromoCode(input: HTMLInputElement): void {
    const promoText: string = input.value;
    if (promoText !== '') {
      const promoObj: StrNumArr | null = this.cartModel.searchNotAppliedPromoCode(promoText);
      if (promoObj) {
        this.cartView.showPromoCodeForAdd(promoObj);
      }
    }
  }

  applyPromoCode(): void {
    const promoText: string = (<HTMLInputElement>document.querySelector('.cart-promocode')!).value;
    this.cartModel.applyPromoCode(promoText);
    this.cartView.clearPromoCodeForAdd();
    this.cartView.showAllAppliedPromoCodes(
      this.cartModel.getAllAppliedPromoCodes(),
      this.cartModel.getTotalSumWithDiscount()
    );
  }

  removePromoCode(target: HTMLElement): void {
    const promoText: string | null = target.getAttribute('data-id');
    if (promoText) {
      this.cartModel.removePromoCode(promoText);
      this.cartView.showAllAppliedPromoCodes(
        this.cartModel.getAllAppliedPromoCodes(),
        this.cartModel.getTotalSumWithDiscount()
      );
    }
  }

  cartNextPage(): void {
    this.cartPage.pageNum += 1;
    this.cartPage.pageNum = this.cartModel.getRealPageNum(this.cartPage);
    this.goCart();
  }

  cartPrevPage(): void {
    if (this.cartPage.pageNum > 1) {
      this.cartPage.pageNum -= 1;
      this.cartPage.pageNum = this.cartModel.getRealPageNum(this.cartPage);
      this.goCart();
    }
  }

  cartChangePageLength(): void {
    this.cartPage.countOnPage = parseInt((<HTMLInputElement>document.querySelector('.cart-page-length')!).value);
    this.cartPage.pageNum = this.cartModel.getRealPageNum(this.cartPage);
    this.goCart();
  }

  goDetailPage(target: HTMLElement): void {
    const id: string | null = target.getAttribute('data-id');
    if (id) {
      this.filterSort.id = parseInt(id);
      this.view.hideAllLayers();
      this.view.updateUrl('/product/' + id, {});
      this.createProductPage();
      this.productsView.changeCartButtons(this.cartModel.products);
    }
  }

  createProductPage(): void {
    if (this.filterSort.id) {
      const product: IProduct | undefined = this.productModel.getProductById(this.filterSort.id);
      if (product) {
        this.productsView.showProduct(product);
        this.productsView.changeCartButtons(this.cartModel.products);
      } else {
        this.view.show404();
      }
    }
  }

  showBigPicture(element: HTMLElement): void {
    if (element.classList.contains('product-photo-small') && this.filterSort.id) {
      const product: IProduct | undefined = this.productModel.getProductById(this.filterSort.id);
      if (product) {
        this.productsView.showBigPicture(product, Array.from(element.parentNode!.children).indexOf(element));
      }
    }
  }

  goOrder(): void {
    this.orderView.showOrderForm();
  }

  buyNow(target: HTMLElement): void {
    const id: string | null = target.getAttribute('data-id');
    if (id) {
      const product: IProduct | undefined = this.productModel.getProductById(parseInt(id));
      if (product) {
        if (!this.cartModel.hasId(parseInt(id))) {
          this.cartModel.addOrDrop(product);
          this.cartView.showHeaderCount(this.cartModel.getCount());
          this.cartView.showHeaderTotal(this.cartModel.getTotalSum());
        }
        this.goCart();
        this.orderView.showOrderForm();
      }
    }
  }

  submitOrder(): void {
    let formCheck = true;
    document.querySelectorAll('.order-form input').forEach((elem) => {
      if ((<HTMLInputElement>elem).type !== 'submit' && !this.checkField(<HTMLInputElement>elem)) {
        formCheck = false;
      }
    });
    if (formCheck) {
      this.orderView.submitOrderForm();
      this.cartModel.clearCart();
      this.cartView.showHeaderCount(this.cartModel.getCount());
      this.cartView.showHeaderTotal(this.cartModel.getTotalSum());
      this.cartView.showEmptyCart();
      this.productsView.changeCartButtons(this.cartModel.products);
      setTimeout(() => {
        this.orderView.closeOrderForm();
        document.location = '/';
      }, 3000);
    }
  }

  closeOrder(): void {
    this.orderView.closeOrderForm();
  }

  formatField(input: HTMLInputElement): void {
    input.value = this.orderModel.formatField(input.name, input.value);
    if (input.name === 'order-card-number') {
      this.orderView.styleCreditCardField(input);
    }
  }

  checkField(input: HTMLInputElement): boolean {
    const checkResult: checkResult = this.orderModel.checkField(input.name, input.value);
    this.orderView.markField(input, checkResult);
    return checkResult[0];
  }
}

export default ProductsListController;
