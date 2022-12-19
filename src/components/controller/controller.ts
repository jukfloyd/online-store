import { IProductList } from "../app/app";
import { database } from "../../assets/database";
import ProductModel from "../model/model";
import ProductsList from "../view/list/list";

export type numberRange = [number, number];

export interface IFilterSort {
  sort?: string,
  brands: string[],
  categories: string[],
  price?: numberRange,
  stock?: numberRange,
  search?: string,
  viewType?: string,
}

class ProductsListController {
  public filterSort: IFilterSort;
  public model: ProductModel;
  public view: ProductsList;

  constructor() {
    this.model = new ProductModel(database);
    this.view = new ProductsList();

    const url: URL = new URL(window.location.href);
    const brandsParam: string | null = url.searchParams.get('brands');
    const categoriesParam: string | null = url.searchParams.get('categories');
    const sortParam: string | null = url.searchParams.get('sort');
    const priceParam: string | null = url.searchParams.get('price');
    const stockParam: string | null = url.searchParams.get('stock');
    const searchParam: string | null = url.searchParams.get('search');
    const viewParam: string | null = url.searchParams.get('view');
    const id: string | null = url.searchParams.get('id');

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

  }

  createResults(): void {
    const data: IProductList = this.model.filterAndSort(this.filterSort);
    this.view.createProductsFilter(data, this.filterSort);
    this.view.showProductsList(data, this.filterSort);
    this.view.updateFieldsValues(this.filterSort);
    this.view.styleFilterFields(data, this.filterSort);
  }

  updateResults(): void {
    const data: IProductList = this.model.filterAndSort(this.filterSort);
    this.view.showProductsList(data, this.filterSort);
    console.log(this.filterSort);
    this.view.updateFieldsValues(this.filterSort);
    this.view.styleFilterFields(data, this.filterSort);
  }

  updateUrl(): void {
    const url: URL = new URL(window.location.href);
    (this.filterSort.brands.length)
      ? url.searchParams.set('brands', this.filterSort.brands.map(_ => encodeURIComponent(_)).join('↕'))
      : url.searchParams.delete('brands');
    (this.filterSort.categories.length)
      ? url.searchParams.set('categories', this.filterSort.categories.map(_ => encodeURIComponent(_)).join('↕'))
      : url.searchParams.delete('categories');
    (this.filterSort.sort)
      ? url.searchParams.set('sort', encodeURIComponent(this.filterSort.sort))
      : url.searchParams.delete('sort');
    (this.filterSort.price)
      ? url.searchParams.set('price', this.filterSort.price.join('↕'))
      : url.searchParams.delete('price');
    (this.filterSort.stock)
      ? url.searchParams.set('stock', this.filterSort.stock.join('↕'))
      : url.searchParams.delete('stock');
    (this.filterSort.search)
      ? url.searchParams.set('search', encodeURIComponent(this.filterSort.search))
      : url.searchParams.delete('search');
    (this.filterSort.viewType)
      ? url.searchParams.set('view', this.filterSort.viewType)
      : url.searchParams.delete('view');
    window.history.pushState({}, '', url);
  }

  updateFilterValues(): void {

    // brands
    const brandInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('[name^=brand]');
    const selectedBrands: string[] = [];
    brandInputs.forEach((input) => {
      if (input.checked) {
        selectedBrands.push(input.value);
      }
    });
    this.filterSort.brands = selectedBrands;

    // categories
    const categoryInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('[name^=category]');
    const selectedCategories: string[] = [];
    categoryInputs.forEach((input) => {
      if (input.checked) {
        selectedCategories.push(input.value);
      }
    });
    this.filterSort.categories = selectedCategories;
    
    // sort
    this.filterSort.sort = (<HTMLSelectElement>document.querySelector('.sort')!).value;

    // price
    const [minPrice, maxPrice]: numberRange = this.model.getPriceRange();
    let priceFrom: string = (<HTMLInputElement>document.querySelector('.price-from')!).value;
    let priceTo: string = (<HTMLInputElement>document.querySelector('.price-to')!).value;
    if (!priceFrom) {
      (<HTMLInputElement>document.querySelector('.price-from')!).value = minPrice.toString();
      priceFrom = minPrice.toString();
    }
    if (!priceTo) {
      (<HTMLInputElement>document.querySelector('.price-to')!).value = maxPrice.toString();
      priceTo = maxPrice.toString();
    }
    if (priceFrom && priceTo) {
      this.filterSort.price = [parseInt(priceFrom), parseInt(priceTo)];
    } else {
      delete this.filterSort.price;
    }

    // stock
    const [minStock, maxStock]: numberRange = this.model.getStockRange();
    let stockFrom = (<HTMLInputElement>document.querySelector('.stock-from')!).value;
    let stockTo = (<HTMLInputElement>document.querySelector('.stock-to')!).value;
    if (!stockFrom) {
      (<HTMLInputElement>document.querySelector('.stock-from')!).value = minStock.toString();
      stockFrom = minStock.toString();
    }
    if (!stockTo) {
      (<HTMLInputElement>document.querySelector('.stock-to')!).value = maxStock.toString();
      stockTo = maxStock.toString();
    }
    if (stockFrom && stockTo) {
      this.filterSort.stock = [parseInt(stockFrom), parseInt(stockTo)];
    } else {
      delete this.filterSort.stock;
    }

    // search
    this.filterSort.search = (<HTMLInputElement>document.querySelector('.search')!).value;
    
    // view
    this.filterSort.viewType = (<HTMLInputElement>document.querySelector('input[name="view"]:checked')!).value;

    this.updateUrl();
  }

}

export default ProductsListController;

