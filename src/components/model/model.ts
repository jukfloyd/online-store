import { IProduct, IProductList } from '../app/app';


class ProductModel {
  public data: IProductList

  constructor(data: IProductList) {
    this.data = data;
  }

}

export default ProductModel;