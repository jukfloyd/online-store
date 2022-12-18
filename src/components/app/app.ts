import ProductsListAppController from '../controller/controller';

class App {
  public controller: ProductsListAppController;
  constructor() {
      this.controller = new ProductsListAppController();
  }

  start(): void {
    this.controller.createResults();
    (<HTMLSelectElement>document.querySelector('.price-from')!).addEventListener('change', () => {
      this.controller.updateFilterValues();
      this.controller.updateResults();
    });
    (<HTMLSelectElement>document.querySelector('.price-to')!).addEventListener('change', () => {
      this.controller.updateFilterValues();
      this.controller.updateResults();
    });
    (<HTMLSelectElement>document.querySelector('.stock-from')!).addEventListener('change', () => {
      this.controller.updateFilterValues();
      this.controller.updateResults();
    });
    (<HTMLSelectElement>document.querySelector('.stock-to')!).addEventListener('change', () => {
      this.controller.updateFilterValues();
      this.controller.updateResults();
    });
    (<HTMLSelectElement>document.querySelector('.sort')!).addEventListener('change', () => {
      this.controller.updateFilterValues();
      this.controller.updateResults();
    });
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
