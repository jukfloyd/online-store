import { IProduct, IProductList } from '../app/app';
import { IFilterSort, numberRange } from '../controller/controller';

class ProductModel {
  public data: IProductList

  constructor(data: IProductList) {
    this.data = data;
  }

  filterAndSort(filterSortParams: IFilterSort): IProductList {

     
    return this.data;
  }
  
}


export default ProductModel;