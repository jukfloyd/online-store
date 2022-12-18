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
}

class ProductsListController {
  public filterSort: IFilterSort;
  public model: ProductModel;
  public view: ProductsList;

  constructor() {
    this.model = new ProductModel(database);
    this.view = new ProductsList();

    this.filterSort = {
      sort: 'brand',
      brands: [],
      categories: [],
    };

  }

  createResults(): void {
    const data: IProductList = this.model.filterAndSort(this.filterSort);
    this.view.createProductsFilter(data, this.filterSort);
    this.view.showProductsList(data);

  }

  updateResults(): void {
    const data: IProductList = this.model.filterAndSort(this.filterSort);
    this.view.showProductsList(data);
    console.log(this.filterSort);
    this.view.updateFieldsValues(this.filterSort);
  }

  updateFilterValues(): void {

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

  }

}

export default ProductsListController;

