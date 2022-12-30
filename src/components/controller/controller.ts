import { IProduct, IProductList, IFilterSort, IPagination, numberRange, StrNumArr, stringPair } from "../app/types";
import { database } from "../../assets/database";
import ProductModel from "../model/model";
import ProductsView from "../view/products/products";
import CartModel from "../model/cart";
import CartView from "../view/cart/cart";
import View from "../view/view";

class ProductsListController {
  filterSort: IFilterSort;
  productModel: ProductModel;
  productsView: ProductsView;
  cartModel: CartModel;
  cartView: CartView;
  view: View;
  cartPage: IPagination;

  constructor() {
    this.productModel = new ProductModel(database);
    this.productsView = new ProductsView();
    this.cartModel = new CartModel(this.productModel.data.products);
    this.cartView = new CartView();
    this.view = new View();
    this.cartPage = { 'countOnPage': 50, 'pageNum': 1};

    const url: URL = new URL(window.location.href);
    const brandsParam: string | null = url.searchParams.get('brands');
    const categoriesParam: string | null = url.searchParams.get('categories');
    const sortParam: string | null = url.searchParams.get('sort');
    const priceParam: string | null = url.searchParams.get('price');
    const stockParam: string | null = url.searchParams.get('stock');
    const searchParam: string | null = url.searchParams.get('search');
    const viewParam: string | null = url.searchParams.get('view');
    const id: string | null = url.searchParams.get('id');
    const layer: string | null = url.searchParams.get('layer');
    const countOnPage: string | null = url.searchParams.get('countOnPage');
    const pageNum: string | null = url.searchParams.get('pageNum');
    
    
    this.filterSort = {
      sort: sortParam || 'brand',
      brands: (brandsParam) ? brandsParam.split('↕').map(_ => decodeURIComponent(_)) : [],
      categories: (categoriesParam) ? categoriesParam.split('↕').map(_ => decodeURIComponent(_)) : [],
    };
    if (priceParam) {
      this.filterSort.price = priceParam.split('↕').map(_ => parseInt(_)) as [number, number];
    }
    if (stockParam) {
      this.filterSort.stock = stockParam.split('↕').map(_ => parseInt(_)) as [number, number];
    }
    if (searchParam) {
      this.filterSort.search = decodeURIComponent(searchParam);
    }
    this.filterSort.viewType = viewParam || 'list';
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

    this.cartView.showHeaderCount(this.cartModel.getCount());
    this.cartView.showHeaderTotal(this.cartModel.getTotalSum());
    if (layer === 'cart') {
      this.goCart();
    } else {
      this.createResults();
    }
  }

  createResults(): void {
    const data: IProductList = this.productModel.filterAndSort(this.filterSort);
    const foundProducts: boolean = (this.productModel.getFilteredCount()) ? true : false;
    this.view.hideAllLayers();
    const priceRange: numberRange = this.productModel.getPriceRange();
    const stockRange: numberRange = this.productModel.getStockRange();
    const filterContent: IFilterSort = {
      brands: this.productModel.getSorted('brand'),
      categories: this.productModel.getSorted('category'),
      price: priceRange,
      stock: stockRange,
    };
    this.productsView.createProductsFilter(filterContent);

    if (this.filterSort.price && priceRange[2] && priceRange[2] > this.filterSort.price[0]) {
      this.filterSort.price[0] = priceRange[2];
    }
    if (this.filterSort.price && priceRange[3] && priceRange[3] < this.filterSort.price[1]) {
      this.filterSort.price[1] = priceRange[3];
    }
    if (this.filterSort.price) {
      this.productsView.updatePriceFilter(this.filterSort.price, foundProducts);
    }

    if (this.filterSort.stock && stockRange[2] && stockRange[2] > this.filterSort.stock[0]) {
      this.filterSort.stock[0] = stockRange[2];
    }
    if (this.filterSort.stock && stockRange[3] && stockRange[3] < this.filterSort.stock[1]) {
      this.filterSort.stock[1] = stockRange[3];
    }
    if (this.filterSort.stock) {
      this.productsView.updateStockFilter(this.filterSort.stock, foundProducts);
    }

    this.productsView.updateBrandFilter(this.filterSort, this.productModel.getCountByKey('brand'));
    this.productsView.updateCategoryFilter(this.filterSort, this.productModel.getCountByKey('category'));
    this.productsView.showProductsList(data, this.filterSort);
    this.productsView.updateOtherFilter(this.filterSort);
    this.productsView.changeCartButtons(this.cartModel.products);
  }

  updateResults(field?: string): void {
    const data: IProductList = this.productModel.filterAndSort(this.filterSort);
    const foundProducts: boolean = (this.productModel.getFilteredCount()) ? true : false;
    const priceRange: numberRange = this.productModel.getPriceRange();
    
    if (field !== 'price' && this.filterSort.price) {
      const found: boolean = (priceRange[2] !== 0 && priceRange[3] !== 0);
      if (found) {
        if (priceRange[2] && priceRange[2] > this.filterSort.price[0]) {
          this.filterSort.price[0] = priceRange[2];
        }
        if (priceRange[3] && priceRange[3] < this.filterSort.price[1]) {
          this.filterSort.price[1] = priceRange[3];
        }
      }
    }
    this.productsView.updatePriceFilter(this.filterSort.price ? this.filterSort.price : priceRange, foundProducts);

    const stockRange: numberRange = this.productModel.getStockRange();
    if (field !== 'stock' && this.filterSort.stock) {
      const found: boolean = (stockRange[2] !== 0 && stockRange[3] !== 0);
      if (found) {
        if (stockRange[2] && stockRange[2] > this.filterSort.stock[0]) {
          this.filterSort.stock[0] = stockRange[2];
        }
        if (stockRange[3] && stockRange[3] < this.filterSort.stock[1]) {
          this.filterSort.stock[1] = stockRange[3];
        }
      }
    }
    this.productsView.updateStockFilter(this.filterSort.stock ? this.filterSort.stock : stockRange, foundProducts);
    this.productsView.updateBrandFilter(this.filterSort, this.productModel.getCountByKey('brand'));
    this.productsView.updateCategoryFilter(this.filterSort, this.productModel.getCountByKey('category'));
    this.productsView.updateOtherFilter(this.filterSort);
    this.productsView.showProductsList(data, this.filterSort);
    this.productsView.changeCartButtons(this.cartModel.products);
  }

  updateUrl(): void {
    const filterParams: stringPair = {
      'brands': this.filterSort.brands.map(_ => encodeURIComponent(_)).join('↕'),
      'categories': this.filterSort.categories.map(_ => encodeURIComponent(_)).join('↕'),
      'sort': (this.filterSort.sort) ? encodeURIComponent(this.filterSort.sort) : '',
      'price': (this.filterSort.price) ? this.filterSort.price.join('↕') : '',
      'stock': (this.filterSort.stock) ? this.filterSort.stock.join('↕') : '',
      'search': (this.filterSort.search) ? encodeURIComponent(this.filterSort.search) : '',
      'view': (this.filterSort.viewType) ? this.filterSort.viewType : '',
    };
    this.view.updateUrl(filterParams);
  }

  updateFilterObject(): void {

    // brands
    const brandInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.filter-brand input');
    const selectedBrands: string[] = [];
    brandInputs.forEach((input) => {
      if (input.checked) {
        selectedBrands.push(input.value);
      }
    });
    this.filterSort.brands = selectedBrands;

    // categories
    const categoryInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.filter-category input');
    const selectedCategories: string[] = [];
    categoryInputs.forEach((input) => {
      if (input.checked) {
        selectedCategories.push(input.value);
      }
    });
    this.filterSort.categories = selectedCategories;

    // sort
    const sortField: Element | null = document.querySelector('.sort');
    if (sortField) {
      this.filterSort.sort = (<HTMLSelectElement>sortField).value;
    }

    // price
    //const [minPrice, maxPrice]: numberRange = this.productModel.getPriceRange();
    const priceFromField: Element | null = document.querySelector('.price-from');
    const priceToField: Element | null = document.querySelector('.price-to');
    if (priceFromField && priceToField) {
      this.filterSort.price = [parseInt((<HTMLInputElement>priceFromField).value), parseInt((<HTMLInputElement>priceToField).value)];
    }

    // stock
    const stockFromField: Element | null = document.querySelector('.stock-from');
    const stockToField: Element | null = document.querySelector('.stock-to');
    if (stockFromField && stockToField) {
      this.filterSort.stock = [parseInt((<HTMLInputElement>stockFromField).value), parseInt((<HTMLInputElement>stockToField).value)];
    }

    // search
    const searchField: Element | null = document.querySelector('.search')
    if (searchField) {
      this.filterSort.search = (<HTMLInputElement>searchField).value;
    }

    // view
    const viewField: Element | null = document.querySelector('.view-button.active');
    if (viewField) {
      this.filterSort.viewType = viewField.getAttribute('value') || 'list';
    }

    this.updateUrl();
  }

  resetFilter(): void {
    this.filterSort.brands = [];
    this.filterSort.categories = [];
    delete this.filterSort.price;
    delete this.filterSort.stock;
    this.updateUrl();
  }

  copyFilter(): void {
    navigator.clipboard.writeText(window.location.href);
    this.productsView.changeCopyButton();
  }

  addOrDropCart(target: HTMLElement): void {
    const id: string | null = target.getAttribute('data-id');
    if (id) {
      const product: IProduct | undefined  = this.productModel.getProductById(parseInt(id));
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
    this.view.updateUrl({
      'layer': 'cart',
      'countOnPage': this.cartPage.countOnPage.toString(),
      'pageNum': this.cartPage.pageNum.toString(),
    });
    const productsPaged: IProduct[] = this.cartModel.filterByPage(this.cartPage);
    this.cartView.showCart(productsPaged, this.cartModel.getCount(), this.cartModel.getTotalSum(), this.cartPage);
    this.cartView.showAllAppliedPromoCodes(this.cartModel.getAllAppliedPromoCodes(), this.cartModel.getTotalSumWithDiscount());
  }

  plusCount(target: HTMLElement): void {
    const id: string | null = target.getAttribute('data-id');
    if (id) {
      const product: IProduct | undefined  = this.productModel.getProductById(parseInt(id));
      if (product) {
        this.cartModel.plusCount(product);
        this.cartPage.pageNum = this.cartModel.getRealPageNum(this.cartPage);
        const count: number = this.cartModel.getCount();
        const totalSum: number = this.cartModel.getTotalSum();
        this.cartView.showHeaderCount(count);
        this.cartView.showHeaderTotal(totalSum);
        this.cartView.showCart(this.cartModel.products, count, totalSum, this.cartPage);
        this.cartView.showAllAppliedPromoCodes(this.cartModel.getAllAppliedPromoCodes(), this.cartModel.getTotalSumWithDiscount());
      }
    }
  }

  minusCount(target: HTMLElement): void {
    const id: string | null = target.getAttribute('data-id');
    if (id) {
      const product: IProduct | undefined  = this.productModel.getProductById(parseInt(id));
      if (product) {
        this.cartModel.minusCount(product);
        this.cartPage.pageNum = this.cartModel.getRealPageNum(this.cartPage);
        const count: number = this.cartModel.getCount();
        const totalSum: number = this.cartModel.getTotalSum();
        this.cartView.showHeaderCount(count);
        this.cartView.showHeaderTotal(totalSum);
        this.cartView.showCart(this.cartModel.products, count, totalSum, this.cartPage);
        this.cartView.showAllAppliedPromoCodes(this.cartModel.getAllAppliedPromoCodes(), this.cartModel.getTotalSumWithDiscount());
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
    this.cartView.showAllAppliedPromoCodes(this.cartModel.getAllAppliedPromoCodes(), this.cartModel.getTotalSumWithDiscount());
  }

  removePromoCode(target: HTMLElement): void {
    const promoText: string | null = target.getAttribute('data-id');
    if (promoText) {
      this.cartModel.removePromoCode(promoText);
      this.cartView.showAllAppliedPromoCodes(this.cartModel.getAllAppliedPromoCodes(), this.cartModel.getTotalSumWithDiscount());
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

}

export default ProductsListController;

