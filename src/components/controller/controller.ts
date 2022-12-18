import { IProductList } from "../app/app";
import { database } from "../../assets/database";
import ProductModel from "../model/model";
import ProductsList from "../view/list/list";



class ProductsListController {
  public model: ProductModel;
  public view: ProductsList;

  constructor() {
    this.model = new ProductModel(database);
    this.view = new ProductsList();

   
  }

  createResults(): void {
    const data: IProductList = this.model.data;
    this.view.showProductsList(data);

  }

}

export default ProductsListController;

