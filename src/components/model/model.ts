import { IProduct, IProductList } from '../app/app';
import { IFilterSort, numberRange } from '../controller/controller';

class ProductModel {
  public data: IProductList

  constructor(data: IProductList) {
    this.data = data;
  }

  filterAndSort(filterSortParams: IFilterSort): IProductList {

        // filter
        this.data.products.forEach((item: IProduct) => {
          if (
              (!filterSortParams.price || (item.price >= filterSortParams.price[0] && item.price <= filterSortParams.price[1]))
              &&
              (!filterSortParams.stock || (item.stock >= filterSortParams.stock[0] && item.stock <= filterSortParams.stock[1]))
              
            ) {
            item.excluded = false;
          } else {
            item.excluded = true;
          }
        });
     
    return this.data;
  }

  getPriceRange(): numberRange {
    let min = Number.MAX_VALUE, max = 0;
    this.data.products.forEach((item: IProduct) => {
      min = (item.price < min) ? item.price : min;
      max = (item.price > max) ? item.price : max;
    });
    return [min, max];
  }

  getStockRange(): numberRange {
    let min = Number.MAX_VALUE, max = 0;
    this.data.products.forEach((item: IProduct) => {
      min = (item.stock < min) ? item.stock : min;
      max = (item.stock > max) ? item.stock : max;
    });
    return [min, max];
  }
  
}


export default ProductModel;