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

}

export default ProductsListController;

