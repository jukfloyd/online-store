import ProductsListAppController from '../controller/controller';

class App {
  public controller: ProductsListAppController;
  constructor() {
      this.controller = new ProductsListAppController();
  }

  start(): void {
    this.controller.createResults();
  }

}

export default App;

export interface IProduct {
  id: number,
  title: string,
  description: string,
  price: number,
  discountPercentage: number,
  rating: number,
  stock: number,
  brand: string,
  category: string,
  thumbnail: string,
  images: string[],
  excluded?: boolean,
}

export interface IProductList {
  products: IProduct[];
  total?: number,
	skip?: number,
	limit?: number,
}
